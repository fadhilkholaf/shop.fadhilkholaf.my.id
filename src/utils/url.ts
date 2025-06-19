export function getBaseUrl(): string {
    const ENV = process.env.APP_ENVIRONMENT;

    if (ENV === "production") {
        return "https://www.shop.fadhilkholaf.my.id";
    }

    if (ENV === "preview") {
        return "https://www.preview.shop.fadhilkholaf.my.id";
    }

    return "http://localhost:3000";
}

export function getOgUrl(title?: string, name?: string): string {
    const encodedTitle = title ? encodeURIComponent(title) : "";
    const encodedName = name ? encodeURIComponent(name) : "";

    return `https://www.fadhilkholaf.my.id/api/og?title=${encodedTitle}&name=${encodedName}`;
}
