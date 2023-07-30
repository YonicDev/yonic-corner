import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";

export async function getHeroImages(posts: CollectionEntry<"blog">[]) {
    return await Promise.all(posts.map(async (post) => {
        // The images can be of any supported filetype, not just PNG.
        // But the file *has* to be an article asset named hero.png,
        // regardless of what the image type actually is.
        try {
            const imageMeta: ImageMetadata = (await import(`./assets/articles/${post.slug}/hero.png`)).default;
            const processedImage = await getImage({ src: imageMeta, width: 550, height: 280, format: "webp"});
            return Promise.resolve(processedImage.src);
        } catch (err: any) {
            if(!err.message.includes("Unknown variable dynamic import"))
                console.error(err);
            return null;
        }
    }));    
}