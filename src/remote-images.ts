import type { ImageOutputFormat } from "astro";
import { getImage } from "astro:assets";
import crypto from "node:crypto";

const { IMGPROXY_HOST, IMGPROXY_KEY, IMGPROXY_SALT } = import.meta.env;

const salt = Buffer.from(IMGPROXY_SALT, "hex").toString();

function addToRemoteManifest(imageUrl: string) {
    (globalThis as any).remoteImageManifest?.push(imageUrl);
}

export function getSignedUrl(href: string): string {
    try {
        const url = new URL(href);
        const signature = crypto.createHmac("sha256", Buffer.from(IMGPROXY_KEY, "hex")).update(url.pathname.slice(1)).digest("base64url");
        const result = new URL(`${IMGPROXY_HOST}/${signature}${url.pathname.slice(salt.length+1)}`, url.origin)
        return result.href;
    } catch (e) {
        console.error(e);
        return href;
    }
}

export function getRemoteImage(options: {src: string, width: number, format: ImageOutputFormat, quality: number}) {
    const { src, width, format, quality } = options;
    const encodedURL = Buffer.from(src).toString("base64url");
    const imageSrc = getSignedUrl(`${IMGPROXY_HOST}/${salt}/s:${Math.round(width)}/q:${quality}/${encodedURL}.${format}`);
    addToRemoteManifest(imageSrc);
    return imageSrc;
}

export function getRemoteSizedImage(options: {src: string, width: number, height: number, format: ImageOutputFormat, quality: number}) {
    const { src, width, height, format, quality } = options;
    const encodedURL = Buffer.from(src).toString("base64url");
    const imageSrc = getSignedUrl(`${IMGPROXY_HOST}/${salt}/rs:fill:${Math.round(width)}:${Math.round(height)}/q:${quality}/${encodedURL}.${format}`);
    addToRemoteManifest(imageSrc);
    return imageSrc;
}

export function generateSourceset(options: {src: string, sizes: number[], width: number, format: ImageOutputFormat, quality: number}) {
    const { sizes, width } = options;
    return sizes.map(size => `${getRemoteImage({...options, width: width*size})} ${Math.round(width*size)}w`).join(", ");
}

export function getRemoteHeroImage(options: {src: string, format?: ImageOutputFormat}) {
    const { src, format = "webp" } = options;
    return getRemoteSizedImage({src, width: 550, height: 310, format, quality: 90});
}

export function getRemoteCover(options: {src: string, width: number, height: number, format?: ImageOutputFormat}) {
    const { src, format = "webp", width, height} = options;
    return getRemoteSizedImage({src, width, height, format, quality: 90});
}

export function getRemoteAlbumCover(src: string) {
    return getRemoteSizedImage({src, width: 64, height: 64, format: "webp", quality: 80});
}

export async function getImageDimensions(options: {src: string, width: number}): Promise<{width: number, height?: number}> {
    const { src, width } = options;
    try {
        const image = (await getImage({src, width, inferSize: true}));
        return {
            width: Math.round(image.attributes.width),
            height: Math.round(image.attributes.height)
        }
    } catch (e) {
        console.error(e);
        return {
            width,
            height: undefined
        }
    }
}

export interface Shorthandle {
    replaceCase: RegExp,
    value: string
}

export function processShorthandles(src: string, shorthandles: Shorthandle[]) {
    return shorthandles.reduce((str, {replaceCase, value}) => str.replace(replaceCase, value), src)
}

export function toLocalShort(url: string) {
    return url.split(".")[0].split("/").slice(["blog","year","id"].length,-1).join("/");
}

export function getSeriesShorthandles(seriesId: string): Shorthandle[] {
    return [
        { replaceCase: /@id/, value: seriesId },
        { replaceCase: /^@series:/, value: import.meta.env.BLOG_IMAGE_ROOT + 'series-legacy/' }
    ]
}
