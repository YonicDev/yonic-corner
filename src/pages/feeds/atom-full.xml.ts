import AtomFeed from "@lib/components/feed/AtomFeed.astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro/virtual-modules/container.js";
import { getContainerRenderer as MDXContainerRenderer } from "@astrojs/mdx"
import { getContainerRenderer as SvelteContainerRenderer } from "@astrojs/svelte"
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({request, locals}) => {
    const renderers = await loadRenderers([
        MDXContainerRenderer(),
        SvelteContainerRenderer()
    ])
    const container = await AstroContainer.create({ renderers });

    const xmlString = await container.renderToString(AtomFeed, { request, locals, props: { full: true } });
    return new Response(xmlString.replace("<!DOCTYPE html>", ""), {
        headers: {
            'Content-Type': "application/atom+xml; charset=utf-8",
        }
    });
}