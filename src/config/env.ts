const isDevelopment = __DEV__;

export const API_BASE_URL = isDevelopment
    ? 'http://localhost:3010'
    : 'https://fdd434995dd5.ngrok-free.app';

export const config = {
    apiUrl: API_BASE_URL,
    authUrl: `${API_BASE_URL}/api/auth`
};