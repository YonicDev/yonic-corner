import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

import modernizr from "astro-modernizr";

import AutoImport from 'astro-auto-import';
import MDXCodeBlocks, { mdxCodeBlockAutoImport } from 'astro-mdx-code-blocks';

import absent from "./src/assets/code-themes/absent-light.json";

import readingTime from './src/remark/reading-time.mjs';

import { filterSitemap, serializeSitemap } from './src/sitemap-config';

const site = "https://www.yonic.blog"

const {
  USE_CONTENT_COLLECTION_CACHE
} = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site,
  markdown: {
    remarkPlugins: [readingTime],
    shikiConfig: {
      theme: absent
    }
  },
  devToolbar: {
    enabled: false
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
    modernizr({
      enableJSClass: false,
      options: ["setClasses"],
      featureDetects: [
        "css/flexbox",
        "img/webp",
        "storage/sessionstorage"
      ]
    }),
    sitemap({
      changefreq: "weekly",
      filter: filterSitemap,
      serialize: serializeSitemap,
      customPages: [
        `${site}/feeds/atom.xml`,
        `${site}/feeds/atom-full.xml`,
      ]
    })
  ],
  scopedStyleStrategy: "class",
  redirects: {
    '/blog/article/biyonic-reading': '/blog/article/2023/06/biyonic-reading'
  },
  experimental: {
    contentCollectionCache: (USE_CONTENT_COLLECTION_CACHE === "true") ?? false,
    contentCollectionJsonSchema: true,
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