import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function copyStaticAssetsPlugin() {
  const dirsToCopy = ['css', 'js', 'images', 'media'];
  const requiredFiles = [
    'css/style.css',
    'js/main.js',
    'js/projects.js',
    'js/planner.js',
    'js/contact.js',
    'images/profile.jpg',
    'media/intro.mp3',
  ];
  return {
    name: 'copy-static-assets',
    buildStart() {
      const missing = requiredFiles.filter(
        (relPath) => !fs.existsSync(path.resolve(rootDir, relPath)),
      );
      if (missing.length > 0) {
        throw new Error(
          `Missing required portfolio assets: ${missing.join(', ')}. Make sure the css/, js/, images/, and media/ folders were uploaded to your repository.`,
        );
      }
    },
    closeBundle() {
      const outDir = path.resolve(rootDir, 'dist');
      for (const dir of dirsToCopy) {
        const srcDir = path.resolve(rootDir, dir);
        const destDir = path.resolve(outDir, dir);
        if (fs.existsSync(srcDir)) {
          fs.mkdirSync(destDir, {recursive: true});
          fs.cpSync(srcDir, destDir, {recursive: true});
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [copyStaticAssetsPlugin()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(rootDir, 'index.html'),
          about: path.resolve(rootDir, 'about.html'),
          projects: path.resolve(rootDir, 'projects.html'),
          planner: path.resolve(rootDir, 'planner.html'),
          contact: path.resolve(rootDir, 'contact.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
