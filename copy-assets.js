import fs from 'fs';
import path from 'path';

console.log("[Build Asset Setup] Ensuring /public/images/kai/ exists...");
const workspaceRoot = process.cwd();
const publicDir = path.join(workspaceRoot, 'public');
const kaiDir = path.join(publicDir, 'images', 'kai');

if (!fs.existsSync(kaiDir)) {
  fs.mkdirSync(kaiDir, { recursive: true });
}
console.log("[Build Asset Setup] Directory ready.");
