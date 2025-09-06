const isDevelopment = __DEV__;

export const API_BASE_URL = isDevelopment
    ? 'http://localhost:8081'
    : '//';

export const config = {
    apiUrl: API_BASE_URL,
    authUrl: `${API_BASE_URL}/api/auth`
};