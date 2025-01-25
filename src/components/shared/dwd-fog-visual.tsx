import { useParentSize } from '@visx/responsive';
import styles from './dwd-fog-visual.module.css';
import { useMemo } from 'react';

const DwdFogVisual = () => {        
    const {parentRef, width, height} = useParentSize({ debounceTime: 150, enableDebounceLeadingCall: true })
        
    const elementCount = 20;
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

    return (
        <div ref={parentRef} className={styles['fog-visual']} >
            {Array.from({length: elementCount}, (_, index) => {   
                const dimensions = elementDimensions[index];     
                const className = elementClasses[index];
                return (
                    <div key={index}
                         className={styles[className]}
                         style={{
                            top: `${dimensions.top}px`,
                            left: `${dimensions.left}px`,
                            width: `${dimensions.size}px`,
                            height: `${dimensions.size}px`,
                            borderRadius: `${dimensions.size}px`
                         }}></div>
                );
            })}
        </div>
    )
}

function getRandomDimensions(containerWidth: number, containerHeight: number) : {left: number, top: number, size: number}{
    const left = getRandomIntBetween(0, containerWidth);
    const top = getRandomIntBetween(0, containerHeight);
    const size = getRandomIntBetween(containerHeight/2, containerHeight/2)

    return {
        left,
        top,
        size
    }
}

function getAnimationClass(): string {
    const random = getRandomIntBetween(0, 10);
    return random < 5 ? "fog-1" : "fog-2"
}

function getRandomIntBetween(a: number, b: number) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

export default DwdFogVisual;