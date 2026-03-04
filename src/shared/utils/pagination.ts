export function getPagination(currentPage: number, totalPage: number) {
    if (totalPage <= 3) {
        return Array.from({ length: totalPage }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    const start = Math.max(1, Math.min(currentPage - 1, totalPage - 2))
    const end = start + 2

    // kiri
    if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push("...")
    }

    // window 3 angka
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    // kanan
    if (end < totalPage) {
        if (end < totalPage - 1) pages.push("...")
        pages.push(totalPage)
    }

    return pages
}