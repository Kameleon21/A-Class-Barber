import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon(),
    compress({
      img: true,
      svg: true,
      js: true,
      css: true,
    })
  ],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    format: ['webp', 'avif'],
  },

  build: {
    inlineStylesheets: 'auto',
  },

  adapter: netlify()
});