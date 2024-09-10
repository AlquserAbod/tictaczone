/* eslint-disable no-undef */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  proxy: {
    '/': {
      target: process.env.VITE_SERVER_URL || 'http://localhost:5000',
    }
  },
})
