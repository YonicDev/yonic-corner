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
        {
          'astro:assets': ['Image']
        },
      ]
    }),
    MDXCodeBlocks(),
    mdx(), 
    sitemap()
  ],
  experimental: {
    assets: true,
  },
});