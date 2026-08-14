import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
/** Where the dev server forwards API and upload requests. */
const API_TARGET = 'http://localhost:5000';

export default defineConfig({
    plugins: [react()],
    // All media lives with the server and is served from /uploads.
    publicDir: false,
    // Proxying keeps the app and API on one origin, so the session cookie is
    // first-party. Calling :5000 directly makes it cross-site, and the browser
    // then drops it on every request — which reads as "Authentication required".
    server: {
        proxy: {
            '/api': { target: API_TARGET, changeOrigin: true },
            '/uploads': { target: API_TARGET, changeOrigin: true }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('.', import.meta.url))
        }
    }
});
