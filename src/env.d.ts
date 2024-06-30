/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare interface Blurb {
    blurb: string,
    start?: Date,
    end?: Date
}

declare interface Category {
    title: string,
    description: string,
    order: number,
    baseColor: string,
    emphasisColor: string,
}

declare interface ImportMetaEnv {
    BLOG_IMAGE_ROOT: string,
    BLOG_STATIC_ROOT: string,
    BLOG_MUSIC_COVER_ROOT: string,
    INVIDIOUS_DEFAULT_INSTANCE: string,
    USE_CONTENT_COLLECTION_CACHE: boolean,
    IMGPROXY_HOST: string,
    IMGPROXY_KEY: string,
    IMGPROXY_SALT: string,
}