namespace NodeJS {
    interface ProcessEnv {
        APP_ENVIRONMENT: string;
        DATABASE_URL: string;
        AUTH_SECRET: string;
        AUTH_GITHUB_ID: string;
        AUTH_GITHUB_SECRET: string;
        GITHUB_ACCESS_TOKEN: string;
        PAYPAL_CLIENT_ID: string;
        PAYPAL_CLIENT_SECRET: string;
        NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
        CLOUDINARY_URL: string;
        AUTH_TRUST_HOST: string;
    }
}
