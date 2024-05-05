import { type SitemapItem, ChangeFreqEnum } from "@astrojs/sitemap";

export function serializeSitemap(item: SitemapItem): SitemapItem {
    const url = new URL(item.url);
    const segments = url.pathname.split("/");
    if(url.pathname === "/") {
        item.changefreq = ChangeFreqEnum.MONTHLY;
        item.priority = 0.9;
    } else if(segments[1] === "about") {
        item.priority = 0.7;
    } else if(segments[1] === "blog") {
        item.priority = 0.75;
    } else if(segments[1] === "browse") {
        if(segments[2] === "tags") {
            item.priority = segments[3] ? 0.2 : 0.5;
        } else {
            item.priority = 0.5;
            if(segments[2] == "series") {
                if(segments[3]) {
                    item.priority = 0.6;
                } else {
                    item.priority = 0.75;
                    item.changefreq = ChangeFreqEnum.MONTHLY;
                }
            }
        }
    } else {
        item.priority = 0.5;
    }
    return item;
}

export function filterSitemap(page: string) {
    let inSitemap = true;
    const url = new URL(page);
    const segments = url.pathname.split("/");
    inSitemap &&= segments[1] !== "player";
    if(segments[1] === "browse" && segments[2] === "tags")
        inSitemap &&= segments[3] == null || segments[3] == '';
    return inSitemap;
}