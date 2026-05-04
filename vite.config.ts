import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@emotion/react', '@emotion/styled'],
        esbuildOptions: {
            target: 'es2020'
        }
    },
    base: '/app/',
    build: {
        outDir: '../wwwroot/app',
        emptyOutDir: true,
        chunkSizeWarningLimit: 3000, 
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true
        },
        rollupOptions: {
            output: {
                manualChunks: undefined 
            }
        }
    },
    server: {
        port: 3000,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://192.168.100.165',
                changeOrigin: true,
                secure: false
            }
        }
    }
})