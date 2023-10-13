import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import AutoImport from 'astro-auto-import';
import MDXCodeBlocks, { mdxCodeBlockAutoImport } from 'astro-mdx-code-blocks';

import absent from "./src/assets/code-themes/absent-light.json";


// https://astro.build/config
export default defineConfig({
  site: "https://yonic-corner-astro.netlify.app",
  markdown: {
    shikiConfig: {
      theme: absent
    }
  },
  integrations: [
    svelte(),
    AutoImport({
      imports: [
        mdxCodeBlockAutoImport("@lib/components/CodeBlock.astro"),
        '@lib/components/TextBubble.astro',
        '@lib/components/Chara.astro',
        '@lib/components/Anchor.astro',
        '@lib/components/PlayerLink.astro',
        '@lib/components/biyonic/Paragraph.astro',
        '@lib/components/biyonic/ListItem.astro',
        '@lib/components/biyonic/Code.astro',
        '@lib/components/ImageGrid.astro',
        '@lib/components/Picture.astro',
        {
          'astro:assets': ['Image']
        },
      ]
    }),
    MDXCodeBlocks(),
    mdx(), 
    sitemap()
  ],
  scopedStyleStrategy: "class",
  experimental: {
    assets: true,
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    build: {
      target: "es2018"
    }
  }
});