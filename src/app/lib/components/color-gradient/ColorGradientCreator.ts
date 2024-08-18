import { Color } from "./color";


export class ColorGradientCreator {
    private colors: Map<number, Color> = new Map<number, Color>();

    constructor(start: Color, end: Color) {
        this.colors.set(0.0, start);
        this.colors.set(1.0, end);
    }

    setColor(step: number, color: Color) {
        if (step > 1.0 || step < 0.0) {
            throw "";
        }
        this.colors.set(step, color);

        let sortedKeys = Array.from(this.colors.keys()).sort();
        let sortedMap = new Map<number, Color>();
        sortedKeys.forEach(x => {
            sortedMap.set(x, this.colors.get(x)!);
        });
        this.colors = sortedMap;
    }

    getColorOnGradient(step: number): Color {
        let directMatch = this.colors.get(step);
        if (directMatch) return directMatch;

        let lower: [number, Color] = [0, this.colors.get(0)!];
        let higher: [number, Color] = [1, this.colors.get(1)!];

        this.colors.forEach((color, colorStep) => {
            if (step > colorStep && colorStep > lower[0]) {
                lower = [colorStep, color];
            }
            if (step < colorStep && colorStep < higher[0]) {
                higher = [colorStep, color];
            }
        });

        let adjustedStep = (step * (1 - lower[0])) / higher[0];
        return this.getColorBetween(adjustedStep, lower[1]!, higher[1]!)!;
    }

    private getColorBetween(step: number, colorA: Color, colorB: Color): Color {
        return {
            red: this.getValueBetween(step, colorA.red, colorB.red),
            green: this.getValueBetween(step, colorA.green, colorB.green),
            blue: this.getValueBetween(step, colorA.blue, colorB.blue),
            alpha: this.getValueBetween(step, colorA.alpha, colorB.alpha),
        };
    }

    private getValueBetween(step: number, valueA: number, valueB: number): number {
        if (valueA == valueB) return valueA;
        if (valueA < valueB) {
            let delta = valueB - valueA;
            return valueA + delta * step;
        } else {
            let delta = valueA - valueB;
            return valueA - delta * step;
        }
    }
}
