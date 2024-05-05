import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import AutoImport from 'astro-auto-import';
import MDXCodeBlocks, { mdxCodeBlockAutoImport } from 'astro-mdx-code-blocks';

import absent from "./src/assets/code-themes/absent-light.json";

import readingTime from './src/remark/reading-time.mjs';

import { filterSitemap, serializeSitemap } from './src/sitemap-config';

const site = "https://www.yonic.blog"

// https://astro.build/config
export default defineConfig({
  site,
  markdown: {
    remarkPlugins: [readingTime],
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
        '@lib/components/PlayerLink.astro',
        '@lib/components/ImageGrid.astro',
        '@lib/components/Figure.astro',
        '@lib/components/VersionBranch.astro',
        '@lib/components/Ruby.astro',
        {
          'astro:assets': ['Image', 'Picture']
        },
      ]
    }),
    MDXCodeBlocks(),
    mdx(), 
    sitemap({
      changefreq: "weekly",
      filter: filterSitemap,
      serialize: serializeSitemap,
      customPages: [`${site}/atom/feed.xml`]
    })
  ],
  scopedStyleStrategy: "class",
  redirects: {
    '/blog/article/biyonic-reading': '/blog/article/2023/06/biyonic-reading'
  },
  vite: {
    build: {
      target: "es2018"
    },
    resolve: {
      preserveSymlinks: true
    }
  }
});