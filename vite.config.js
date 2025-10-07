import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// あなたのGitHubリポジトリ名（例: tenbin-game）をここに設定
const repoName = 'tenbin';

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,  // ← GitHub Pages用に追加
  server: {
    port: 3000,
    open: true,
  },
});
