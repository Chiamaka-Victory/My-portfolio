import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const rootDir = process.cwd();

const assetMappings = [
  {target: 'css/style.css', filename: 'style.css'},
  {target: 'js/main.js', filename: 'main.js'},
  {target: 'js/projects.js', filename: 'projects.js'},
  {target: 'js/planner.js', filename: 'planner.js'},
  {target: 'js/contact.js', filename: 'contact.js'},
  {target: 'images/profile.jpg', filename: 'profile.jpg'},
  {target: 'images/p1-monthly-trend.svg', filename: 'p1-monthly-trend.svg'},
  {target: 'images/p1-product-mix.svg', filename: 'p1-product-mix.svg'},
  {target: 'images/p1-trading-days.svg', filename: 'p1-trading-days.svg'},
  {target: 'images/p2-rfm-segments.svg', filename: 'p2-rfm-segments.svg'},
  {target: 'images/p2-reorder-gap.svg', filename: 'p2-reorder-gap.svg'},
  {target: 'images/p2-retention-actions.svg', filename: 'p2-retention-actions.svg'},
  {target: 'media/intro.mp3', filename: 'intro.mp3'},
];

function copyStaticAssetsPlugin() {
  const dirsToCopy = ['css', 'js', 'images', 'media'];
  let projectRoot = rootDir;

  return {
    name: 'copy-static-assets',
    configResolved(config: {root: string}) {
      projectRoot = config.root || rootDir;
      // If a user uploaded assets flat into the repo root without folders, restore them into expected folders before bundling
      for (const {target, filename} of assetMappings) {
        const targetPath = path.resolve(projectRoot, target);
        const flatPath = path.resolve(projectRoot, filename);
        if (!fs.existsSync(targetPath) && fs.existsSync(flatPath)) {
          fs.mkdirSync(path.dirname(targetPath), {recursive: true});
          fs.copyFileSync(flatPath, targetPath);
        }
      }
    },
    buildStart() {
      const missing = assetMappings
        .map((m) => m.target)
        .filter((relPath) => !fs.existsSync(path.resolve(projectRoot, relPath)));
      if (missing.length > 0) {
        throw new Error(
          `Missing required portfolio assets in repository root (${projectRoot}): ${missing.join(', ')}. Make sure you upload the css/, js/, images/, and media/ folders to GitHub (drag the folders into GitHub rather than using "choose your files").`,
        );
      }
    },
    closeBundle() {
      const outDir = path.resolve(projectRoot, 'dist');
      for (const dir of dirsToCopy) {
        const srcDir = path.resolve(projectRoot, dir);
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
