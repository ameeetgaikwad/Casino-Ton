export const AppConfig = {
    env: process.env.NODE_ENV ?? 'development',
    database: process.env.DATABASE ?? 'mongodb://localhost:27017/',

    jwt: {
        secret: process.env.JWT_SECRET ?? 'supersecret',
        expiry: process.env.JWT_EXPIRES_IN ?? '30d',
        cookieExpiry: Number(process.env.JWT_COOKIE_EXPIRES_IN) ?? 30,
    },

    appDomain: process.env.APP_DOMAIN,

    USDC_EXPNENT: 9,
};