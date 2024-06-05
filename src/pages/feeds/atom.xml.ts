import AtomFeed from "@lib/components/feed/AtomFeed.astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({request, locals}) => {
    const container = await AstroContainer.create({
        renderers: [
            {
                name: "@astrojs/mdx",
                serverEntrypoint: "astro/jsx/server.js",
            },
            {
                name: "@astrojs/svelte",
                serverEntrypoint: "@astrojs/svelte/server.js",
            }
        ],
    });

    const xmlString = await container.renderToString(AtomFeed, { request, locals });
    return new Response(xmlString.replace("<!DOCTYPE html>", ""), {
        headers: {
            'Content-Type': "application/atom+xml; charset=utf-8",
        }
    });
}