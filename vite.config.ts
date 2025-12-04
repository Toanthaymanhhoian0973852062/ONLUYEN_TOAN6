import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
});
```

## BƯỚC 5: Tạo file .env.example

Tạo file `.env.example` để hướng dẫn người khác:
```
VITE_GEMINI_API_KEY=your_api_key_here
