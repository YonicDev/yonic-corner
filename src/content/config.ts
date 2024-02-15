// 1. Import utilities from `astro:content`
import { z, defineCollection, reference } from 'astro:content';
import type { ZodNever, Primitive, ZodLiteral, } from 'astro/zod';

import { CATEGORY_IDS } from '@lib/settings';

type MappedZodLiterals<T extends readonly Primitive[]> = {
    -readonly [K in keyof T]: ZodLiteral<T[K]>;
};

function createUnionSchema<T extends readonly []>(values: T, params?: z.RawCreateParams): ZodNever;
function createUnionSchema<T extends readonly [Primitive]>(
    values: T,
    params?: z.RawCreateParams
): ZodLiteral<T[0]>;
function createUnionSchema<
    T extends readonly [Primitive, Primitive, ...Primitive[]]
>(values: T, params?: z.RawCreateParams): z.ZodUnion<MappedZodLiterals<T>>;
function createUnionSchema<T extends readonly Primitive[]>(values: T, params?: z.RawCreateParams) {
    if (values.length > 1) {
        return createManyUnion(
        values as typeof values & [Primitive, Primitive, ...Primitive[]],
        params
        );
    } else if (values.length === 1) {
        return z.literal(values[0], params);
    } else if (values.length === 0) {
        return z.never();
    }
    throw new Error("Array must have a length");
}

function createManyUnion<
    A extends Readonly<[Primitive, Primitive, ...Primitive[]]>
>(literals: A, params?: z.RawCreateParams) {
    return z.union(
        literals.map((value) => z.literal(value)) as MappedZodLiterals<A>,
        params
    );
}

const audioTypes = ["audio/aac","audio/mpeg","audio/mp3","audio/ogg","audio/x-wav","audio/webm","audio/3gpp"] as const;

// 2. Define your collection(s)
const blogCollection = defineCollection({
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string(),
        category: createUnionSchema(CATEGORY_IDS).optional().default("misc"),
        tags: z.array(z.string()).optional().default([]),
        hero: z.object({
            modern: image(),
            legacy: image().refine(({width, height}) => (Math.abs(width/height - 1.5) <= 0.01), "Legacy hero images must be of 2:3 aspect ratio." ),
        }).partial().strict().optional(),
        heroPosition: z.union([
            z.literal("top"),
            z.literal("center"),
            z.literal("bottom")
        ]).optional(),
        draft: z.boolean().optional().default(false),
        legacy: z.boolean().or(z.literal("only")).default(true),
        pubDate: z
            .string()
            .or(z.date())
            .transform((val) => new Date(val)),
        updatedDate: z
            .string()
                .or(z.date())
            .optional()
            .transform((str) => (str ? new Date(str) : undefined)),
        series: z.object({
            id: reference("series"),
            order: z.number().int()
        }).strict().optional(),
        readingTime: z.object({
            text: z.number().int(),
            video: z.number().int().default(0)
        }).optional() // Filled in the reading time Remark plugin
    }).strict()
});

const musicCollection = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        author: z.string().optional(),
        album: z.string().optional(),
        cover: z.string().optional(),
        sources: z.array(z.object({
            src: z.string().url().or(z.literal("")),
            type: createUnionSchema(audioTypes, {invalid_type_error: "Music sources with an URL source must have a compatible audio MIME type."})
        }).or(z.object({
            src: z.string(),
            type: z.literal("youtube", {invalid_type_error: "Music sources with a non-URL source must have their type set to 'youtube'."}),
        })))
    }).strict()
})

const seriesCollection = defineCollection({
  type: "data",
    schema: ({image}) => z.object({
        title: z.string(),
        hero: z.object({
            modern: image(),
            legacy: image().refine(({width, height}) => (Math.abs(width/height - 1.5) <= 0.01), "Legacy hero images must be of 2:3 aspect ratio." ),
        }).partial().strict().optional(),
        description: z.string()
    }).strict()
});

const blurbSchema = z.object({
    base: z.array(z.string()),
    timed: z.array(z.object({
        text: z.string(),
        dateRange: z.object({
            from: z.string(),
            to: z.string(),
            useYear: z.boolean().default(false)
        }).optional(),
        singleDate: z.object({
            date: z.string(),
            useYear: z.boolean().default(false)
        }).optional()
    }).strict())
}).strict();

const blurbsCollection = defineCollection({
    type: "data",
    schema: blurbSchema
})

export type BlurbList = z.infer<typeof blurbSchema>;
export type TimedBlurb = BlurbList["timed"][number];


export const collections = {
    blog: blogCollection,
    music: musicCollection,
    series: seriesCollection,
    blurb: blurbsCollection,
};