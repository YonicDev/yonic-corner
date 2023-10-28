import type { APIRoute } from 'astro';

// Astro won't minify the CSS imported here, so we'll do it ourselves with cssnano.
// HMR won't work as well because this will only load under noscript tags
// but that's fine, the HMR-capable one shares the same SCSS codebase.
import postcss from 'postcss';
import cssnano from 'cssnano';
import advancedPreset from 'cssnano-preset-advanced';

import css from "@lib/styles/themes/dark-player-noscript.scss?inline";
import cssUrl from "@lib/styles/themes/dark-player-noscript.scss?url";

export const get: APIRoute = async () => {
    try {
        const minCss = await postcss([cssnano({preset: advancedPreset})]).process(css, {from: cssUrl}).then((res) => res.css);
        return new Response(minCss, { headers: { "Content-Type": "text/css" } });
    } catch (e: any) {
        return new Response("Internal server error", { status: 500 })
    }
}