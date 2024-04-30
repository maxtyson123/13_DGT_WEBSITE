export function addMeasureSuffix(value: number): string {

    if(value < 1000) return value.toString();

    if(value < 1000000) return (value / 1000).toFixed(1) + 'k';

    if(value < 1000000000) return (value / 1000000).toFixed(1) + 'm';

    return (value / 1000000000).toFixed(1) + 'b';
}