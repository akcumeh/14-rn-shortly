const isDevelopment = __DEV__;

export const API_BASE_URL = isDevelopment
    ? 'http://localhost:8081'  // Local development (will be replaced when you deploy to Vercel)
    : 'https://your-project-name.vercel.app';  // Replace with your actual Vercel URL after deployment

export const config = {
    apiUrl: API_BASE_URL,
    authUrl: `${API_BASE_URL}/api/auth`
};