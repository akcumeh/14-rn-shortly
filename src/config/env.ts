const isDevelopment = __DEV__;

export const API_BASE_URL = isDevelopment
    ? 'http://localhost:3000'
    : 'https://your-project-name.vercel.app';

export const config = {
    apiUrl: API_BASE_URL,
    authUrl: `${API_BASE_URL}/api/auth`
};