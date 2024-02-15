import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";

import { HIDE_DRAFTS_IN_DEVELOPMENT } from "./settings";

export async function getHeroImages(posts: CollectionEntry<"blog">[]) {
    return await Promise.all(posts.map(async (post) => {
        // The images can be of any supported filetype, not just PNG.
        // But the file *has* to be an article asset named hero.png,
        // regardless of what the image type actually is.
        try {
            const imageMeta: ImageMetadata = post.data.hero?.modern ?? (await import(`./assets/articles/${post.slug}/hero.png`)).default;
            const processedImage = await getImage({ src: imageMeta, width: 550, height: 280, format: "webp"});
            return Promise.resolve(processedImage.src);
        } catch (err: any) {
            if(!err.message.includes("Unknown variable dynamic import"))
                console.error(err);
            return null;
        }
    }));    
}

export function filterPosts(post: CollectionEntry<"blog">) {
    return post.data.legacy !== "only" && ((import.meta.env.DEV && !HIDE_DRAFTS_IN_DEVELOPMENT) || !post.data.draft);
}

export function sortPosts(a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) {
    const aPub = a.data.pubDate.getTime();
    const bPub = b.data.pubDate.getTime();
    const aEdt = a.data.updatedDate?.getTime() ?? 0;
    const bEdt = b.data.updatedDate?.getTime() ?? 0;
    return Math.max(bEdt, bPub) - Math.max(aPub, aEdt) || a.id.localeCompare(b.id);
}

export function shuffle<T>(arr: Array<T>): Array<T> {
    const array = structuredClone(arr);
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    return array;
}