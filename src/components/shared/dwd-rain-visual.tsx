import { useMemo } from 'react';
import { getRandomIntBetween } from '../../lib/utility';
import styles from './dwd-rain-visual.module.css'
import { useParentSize } from "@visx/responsive";

const DwdRainVisual = () => {
    const {parentRef, width, height} = useParentSize({debounceTime: 150, enableDebounceLeadingCall: true})

    const elementCount = 30;
    const elementWidth = 3;
    const elementHeight = 30;

    const elementPositions = useMemo(
        () => {
            return Array.from({length: elementCount}, (_, index) => getRandomPosition(width, elementHeight))
        },
        [width, height]
    )

    const elementDelay = useMemo(
        () => {
            return Array.from({length: elementCount}, (_, index) => getRandomIntBetween(0, 100)/10)
        },
        []
    )

    return (
        <div ref={parentRef} className={styles['rain-visual']}>
            {                
                Array.from({length: elementCount}, (_, index) => {
                    const position = elementPositions[index];
                    const delay = elementDelay[index];
                    return (
                        <div key={index}
                             className={styles["rain-drop"]}
                             style={{
                                top: `${position.top}px`,
                                left: `${position.left}px`,
                                width: `${elementWidth}px`,
                                height: `${elementHeight}px`,
                                animationDelay: `${delay}s`
                             }}>
                        </div>
                    )
                })
            }
        </div>
    )
}

function getRandomPosition(containerWidth: number, elementHeight: number) : {left: number, top: number}{
    const left = getRandomIntBetween(0, containerWidth);
    const top = -elementHeight;

    return {
        left,
        top
    }
}

export default DwdRainVisual;