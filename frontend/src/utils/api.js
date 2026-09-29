// API endpoints append their own leading slash.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
