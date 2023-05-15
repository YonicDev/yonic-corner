import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import AutoImport from 'astro-auto-import';
import MDXCodeBlocks, { mdxCodeBlockAutoImport } from 'astro-mdx-code-blocks';


// https://astro.build/config
export default defineConfig({
  site: "https://yonic-corner.netlify.app",
  integrations: [
    svelte(),
    AutoImport({
      imports: [
        mdxCodeBlockAutoImport("@lib/components/CodeBlock.astro"),
        '@lib/components/TextBubble.astro'
      ]
    }),
    MDXCodeBlocks(),
    mdx(), 
    sitemap()]
});