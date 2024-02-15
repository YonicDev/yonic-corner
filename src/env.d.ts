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