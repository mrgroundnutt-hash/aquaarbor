import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // ─── IMPORTANT ───────────────────────────────────────────
    // Change 'aquaarbor' to YOUR GitHub repository name exactly
    // Example: if repo is github.com/ashok0393/aquaarbor
    //          base should be '/aquaarbor/'
    // ---------------------------------------------------------
    base: '/aquaarbor/',

    plugins: [react(), tailwindcss()],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
