import he from "he"

export function cleanText(text: string) {
    let cleaned = he.decode(text)
    cleaned = cleaned.replace(/\*+/g, "")
    cleaned = cleaned.replace(/[<>]/g, "")
    cleaned = cleaned.replace(/\s+/g, " ").trim()

    return cleaned
}