import { execSync } from 'child_process';
import fs from 'fs';

// Clean & recreate dist
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// Run rollup build with env vars
const env = { ...process.env, SERVE: 'false', CONFIG: 'src' };
execSync('npx rollup -c', { stdio: 'inherit', env });

// Copy package.json and screenshot.jpg to dist
if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'dist/package.json');
}
if (fs.existsSync('src/screenshot.jpg')) {
    fs.copyFileSync('src/screenshot.jpg', 'dist/screenshot.jpg');
}
