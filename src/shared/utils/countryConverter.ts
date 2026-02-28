export function countryCodeToFlag(countryCode: string): string {
    return countryCode
        .toUpperCase()
        .split("")
        .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join("");
}

export function displayCountryName(countryCode: string): string {
    const regionName = new Intl.DisplayNames(["id"], { type: "region" })

    return regionName.of(countryCode) as string
}

export function displayComicType(countryCode: string): string {
    return countryCode === "KR" ? "Manhwa" : countryCode === "JP" ? "Manga" : "Manhua"
}