import {useState, useEffect, useCallback} from 'react';

export type FetchState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
    fetchData: (url: string) => void;
    resetData: (resetCache?: boolean) => void;
};

const CACHE_DURATION = 5 * 60 * 1000;
const cache: Record<string, {data: any; expires: number}> = {};

function useFetch<T>(responseHandler: (res: Response) => Promise<T>): FetchState<T> {
    const [url, setUrl] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!url) return;
        const cachedEntry = cache[url];

        if(cachedEntry && Date.now() < cachedEntry.expires) {            
            setData(cachedEntry.data);
            setLoading(false);
            return;
        }
        
        const fetchData = async () => {
            try {
                setLoading(true);                
                const response = await fetch(url);
                if(!response.ok) {
                    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                }
                const result: T = await responseHandler(response);
                cache[url] = { data: result, expires: Date.now() + CACHE_DURATION };
                setData(result);
            } catch(err){
                if (typeof err === "string"){
                    setError(err);
                } else if(err instanceof Error){
                    setError(err.message)
                }                
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [url]);

    const fetchData = useCallback((url: string) => {
        setError(null);
        setUrl(url);
    }, []);

    const resetData = useCallback((resetCache?: boolean) => {        
        setError(null);
        setData(null);
        setUrl(null);
    }, []);

    return {data, loading, error, fetchData, resetData};
}

export default useFetch;