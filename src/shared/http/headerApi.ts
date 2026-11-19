export function getScraperHeaders(baseUrl: string): Record<string, string> {
    const isShinigami = baseUrl.includes("shinigami.io") || baseUrl.includes("shngm.io");
    const origin = isShinigami ? "https://s1.shinigami.mx" : baseUrl;
    const referer = isShinigami ? "https://s1.shinigami.mx/" : `${baseUrl}/`;

    return {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        DNT: "1",
        Origin: origin,
        Referer: referer,
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/120.0.0.0 Safari/537.36",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": isShinigami ? "cross-site" : "same-origin",
        "Sec-Fetch-Dest": "empty",
        "Sec-GPC": "1",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
    };
}