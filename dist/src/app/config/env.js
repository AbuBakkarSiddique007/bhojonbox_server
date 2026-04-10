import dotenv from 'dotenv';
import status from 'http-status';
import AppError from '../errorHelpers/AppError';
dotenv.config();
const loadEnvVariables = () => {
    // Minimal required vars for this repo based on current .env
    const required = ['NODE_ENV', 'PORT', 'DATABASE_URL'];
    required.forEach((v) => {
        if (!process.env[v]) {
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${v} is required but not set in .env file.`);
        }
    });
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || '';
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        ACCESS_TOKEN_SECRET: accessTokenSecret,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
        FRONTEND_URL: process.env.FRONTEND_URL || process.env.BASE_URL || '',
        BASE_URL: process.env.BASE_URL || '',
        ADMIN_EMAIL: adminEmail,
        ADMIN_PASSWORD: adminPassword,
    };
};
export const envVars = loadEnvVariables();
//# sourceMappingURL=env.js.map