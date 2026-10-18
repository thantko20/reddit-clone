import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolves tsconfig baseUrl ("src") so imports like "lib/..." keep working.
    tsconfigPaths: true,
  },
});
