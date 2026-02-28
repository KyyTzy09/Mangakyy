
export function formatRelativeTime(input: Date | string, withYear?: boolean): string {
    const date = typeof input === "string" ? new Date(input) : input;
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    const diffMinutes = Math.floor(diffMs / minute);
    const diffHours = Math.floor(diffMs / hour);
    const diffDays = Math.floor(diffMs / day);

    // kurang dari 1 menit
    if (diffMinutes < 1) {
        return "baru saja";
    }

    // kurang dari 1 jam
    if (diffMinutes < 60) {
        return `${diffMinutes} menit lalu`;
    }

    // masih hari yang sama
    const isSameDay =
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();

    if (isSameDay) {
        return `${diffHours} jam lalu`;
    }

    // ≤ 14 hari
    if (diffDays <= 14) {
        return `${diffDays} hari lalu`;
    }

    // lebih dari 14 hari → tampil tanggal + bulan
    const result = !withYear ? date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    }) : date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return result
}