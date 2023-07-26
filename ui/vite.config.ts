import { defineConfig, loadEnv } from 'vite';
import { readFileSync } from 'fs';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return isProduction ? {
    plugins: [
      {
        name: 'copy-assets',
        apply: 'build',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'icon.png',
            source: readFileSync('icon.png'),
          });
        },
      },
    ],
    build: {
      lib: {
        entry: 'src/applet-index.ts',
        name: 'applet',
        fileName: (_format) => `index.js`,
        formats: ['es'],
      }
    },
  } : {}
})
