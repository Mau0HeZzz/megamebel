import { resolve } from 'path'
import { defineConfig } from "vite";
import handlebars from 'vite-plugin-handlebars';
import injectHTML from 'vite-plugin-html-inject';
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { DEFAULT_OPTIONS } from './config/imageOptimizerConfig';
import cssnanoPlugin from 'cssnano';
import viteHTMLIncludes from '@kingkongdevs/vite-plugin-html-includes';
import Unfonts from 'unplugin-fonts/vite';

import pages from './vitejs/pages.config'
import { htmlReplacer } from './config/htmlReplacer';

const pagesInput = {}

pages.forEach((page => {
    pagesInput[page.name] = page.path
}));

const replaceArr = [
  { entry: `crossorigin`, replace: `` },
  { entry: `script`, replace: `script defer` },
];

const fontsConditions = {
  'thin': {
    weight: 100
  },
  'light': {
    weight: 300
  },
  'extralight': {
    weight: 200
  },
  'medium': {
    weight: 500
  },
  'bold': {
    weight: 700
  },
  'semibold': {
    weight: 600
  },
  'extrabold': {
    weight: 900
  },
}

const fontTransformer = (font) => {
  Object.keys(fontsConditions).forEach(key=>{
    const value = fontsConditions[key];
    if (font.basename.toLowerCase().includes(key)) {
      if (value.weight) {
        font.weight = value.weight;
      }
    }
  })
  if (font.basename.toLowerCase().includes('italic')) {
    font.style = 'italic';
  }
  return font
}


export default defineConfig({
  build: {
    target: 'es2017',
    // target: 'es5',
    outDir: 'dist',
    rollupOptions: {
      input: {
        ...pagesInput
      },
      output: {
        // sourcemap: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'app.css') {
            return 'assets/style.css';
          }

          return 'assets/'+assetInfo.name;
        },
        chunkFileNames: (chunkInfo) => {
          console.log(chunkInfo);
          return "assets/[name].js"
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    },
    devSourcemap: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: true,
  },
  plugins: [
    Unfonts({
      custom: {
        families: [{
          name: 'Noto Sans',
          local: 'Noto Sans',
          src: './public/local/templates/megamebel/fonts/*',
          transform: fontTransformer
        }],
        display: 'swap',
        preload: true,
        prefetch: false,
        injectTo: 'head',
      },
    }),
    ViteImageOptimizer(DEFAULT_OPTIONS),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/html'),
    }),
    injectHTML(),
    // Минификация CSS
    cssnanoPlugin({
      preset: "default",
    }),
    viteHTMLIncludes({
      componentsPath: '/src/html/',
      componentsDir: '/src/html/'
    }),
    // htmlReplacer(replaceArr)
  ],
})