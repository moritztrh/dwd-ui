export function GetLocalToday() : Date {    
    const now = new Date();        
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function GetStartOfDay(date: Date) : Date {
    let result = new Date(date.getTime());
    result.setHours(0,0,0,0);
    return result;
}

export function AddHours(date: Date, hours: number): Date {
    var result = new Date();
    result.setTime(date.getTime() + (hours*60*60*1000));
    return result;
}