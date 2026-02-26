export function countryCodeToFlag(countryCode: string): string {
    return countryCode
        .toUpperCase()
        .split("")
        .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join("");
}