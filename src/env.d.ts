/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Blurb {
    blurb: string,
    start?: Date,
    end?: Date
}

interface Category {
    title: string,
    description: string,
    order: number,
    baseColor: string,
    emphasisColor: string,
}