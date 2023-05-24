// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// 2. Define your collection(s)
const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).optional().default([]),
        heroPosition: z.union([
            z.literal("top"),
            z.literal("center"),
            z.literal("bottom")
        ]).optional(),
        draft: z.boolean().optional().default(false),
        pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
            .or(z.date())
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
    }).strict()
});

const aboutCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
    }).strict()
});


export const collections = {
  blog: blogCollection,
  about: aboutCollection,
};