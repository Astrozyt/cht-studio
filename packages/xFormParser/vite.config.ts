import { defineConfig } from 'vite';

// adjust if you use React, Vue, Svelte etc.
export default defineConfig({
    root: '.', // make sure Vite uses your index.html
    build: {
        sourcemap: true, // ✅ enable source maps for debugging
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        port: 5173, // you can change this if needed
    }
});
