export function formatUsd(n: number) {
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(n);
}

export function formatDate(d: Date) {
    return Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(d);
}
