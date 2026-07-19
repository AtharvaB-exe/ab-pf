import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Instructs Vite to treat 3D mesh geometry files as static assets
  assetsInclude: ['**/*.glb']
});