import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'save-kai-asset-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/save-kai-asset') && req.method === 'POST') {
              try {
                let body = '';
                for await (const chunk of req) {
                  body += chunk;
                }
                const { filename, base64Data } = JSON.parse(body);
                if (filename && base64Data) {
                  const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
                  const buffer = Buffer.from(base64Clean, 'base64');
                  const targetDir = path.join(process.cwd(), 'public', 'images', 'kai');
                  const targetPath = path.join(targetDir, filename);
                  
                  if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                  }
                  
                  fs.writeFileSync(targetPath, buffer);
                  console.log(`[Asset Server] Saved asset: ${filename} (${buffer.length} bytes)`);
                  
                  // Also write to dist/images/kai check if dist exists, to be immediately served
                  const distDir = path.join(process.cwd(), 'dist', 'images', 'kai');
                  if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
                    if (!fs.existsSync(distDir)) {
                      fs.mkdirSync(distDir, { recursive: true });
                    }
                    fs.writeFileSync(path.join(distDir, filename), buffer);
                    console.log(`[Asset Server] Synced to dist: ${filename}`);
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, message: `Saved ${filename}` }));
                  return;
                }
              } catch (err: any) {
                console.error('[Asset Server] Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
                return;
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
