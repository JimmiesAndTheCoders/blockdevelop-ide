import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

function getBlocklyMediaDir(): string {
  try {
    const blocklyPkg = fileURLToPath(import.meta.resolve('blockly/package.json'));
    return path.join(path.dirname(blocklyPkg), 'media');
  } catch {
    const possiblePaths = [
      path.resolve(__dirname, '../../node_modules/blockly/media'),
      path.resolve(__dirname, 'node_modules/blockly/media'),
      path.resolve(__dirname, '../../packages/block-engine/node_modules/blockly/media'),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) return p;
    }
    return '';
  }
}

function blocklyMediaPlugin(): Plugin {
  return {
    name: 'blockly-media-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && /^\/(blockly-media|media)\//.test(req.url)) {
          const fileName = req.url.replace(/^\/(blockly-media|media)\//, '').split('?')[0];
          const mediaDir = getBlocklyMediaDir();
          if (mediaDir && fileName) {
            const filePath = path.join(mediaDir, fileName);
            if (fs.existsSync(filePath)) {
              const mimeTypes: Record<string, string> = {
                '.png': 'image/png',
                '.svg': 'image/svg+xml',
                '.gif': 'image/gif',
                '.wav': 'audio/wav',
                '.mp3': 'audio/mpeg',
                '.ogg': 'audio/ogg',
                '.cur': 'image/x-icon',
              };
              const ext = path.extname(filePath);
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
        }
        next();
      });
    },
    closeBundle() {
      const mediaDir = getBlocklyMediaDir();
      const outDir = path.resolve(__dirname, 'dist/blockly-media');
      if (mediaDir && fs.existsSync(mediaDir)) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.cpSync(mediaDir, outDir, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    blocklyMediaPlugin(),
    electron({
      main: {
        entry: 'src/main/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: ['electron'],
              output: {
                entryFileNames: 'index.js',
              },
            },
          },
        },
      },
      preload: {
        input: 'src/preload/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: ['electron'],
              output: {
                entryFileNames: 'index.js',
                format: 'cjs',
              },
            },
          },
        },
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
