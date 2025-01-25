import { useParentSize } from '@visx/responsive';
import styles from './dwd-cloudy-visual.module.css';
import { useMemo } from 'react';
import { getRandomIntBetween } from '../../lib/utility';

const DwdCloudyVisual = () => {
    const {parentRef, width, height} = useParentSize({ debounceTime: 150, enableDebounceLeadingCall: true })
        
    const elementCount = 25;    
    const elementDimensions = useMemo(
        () => {
            return Array.from({length: elementCount}, (_, index) => getRandomDimensions(width, height));
        },
        [width, height]
    )
    const elementClasses = useMemo(
        () => {
            return Array.from({length: elementCount}, (_, index) => getAnimationClass());
        },
        []
    )
    const elementDelay = useMemo(
        () => {
            return [0, ...Array.from({length: elementCount-1}, (_, index) => getRandomIntBetween(0, 100)/10)]
        },
        []
    )

    return (
        <div ref={parentRef} className={styles['cloudy-visual']} >
            {Array.from({length: elementCount}, (_, index) => {   
                const dimensions = elementDimensions[index];     
                const className = elementClasses[index];
                const delay = elementDelay[index];
                return (
                    <div key={index}
                         className={styles[className]}
                         style={{
                            top: `${dimensions.top}px`,
                            left: `${dimensions.left}px`,
                            width: `${dimensions.size}px`,
                            height: `${dimensions.size}px`,
                            borderRadius: `${dimensions.size}px`,
                            animationDelay: `${delay}s`
                         }}></div>
                );
            })}
        </div>
    )
}

function getRandomDimensions(containerWidth: number, containerHeight: number) : {left: number, top: number, size: number}{
    const size = containerWidth/3;
    const left = containerWidth + size/2;   
    const top = getRandomIntBetween(0, containerHeight/10) - size/2;
    
    return {
        left,
        top,
        size
    }
}

function getAnimationClass(): string {
    const random = getRandomIntBetween(0, 10);
    return random < 5 ? "cloudy-1" : "cloudy-2"
}

export default DwdCloudyVisual;