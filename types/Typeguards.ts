export function isDate(date: string | Date): boolean {
    const timestamp = Date.parse(date as string);
    return isNaN(timestamp) ? true : false;
}
