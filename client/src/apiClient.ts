/// <reference types="vite/client" />

import {Api} from './Api.ts';
const baseUrl = import.meta.env.VITE_APP_BASE_API_URL
console.log('Base URL:', baseUrl); // Додано для перевірки
export const apiClient = new Api({
    baseURL: baseUrl,
    headers: {
        "Prefer": "return=representation"
    }
});

interface ImportMetaEnv {
    readonly VITE_APP_BASE_API_URL: string
}
