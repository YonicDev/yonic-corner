<script lang="ts">
    import type { CollectionEntry } from "astro:content";

    export let prev: CollectionEntry<"blog"> | null = null;
    export let next: CollectionEntry<"blog"> | null = null;
    export let series: string = "All posts";
    export let seriesUrl: string = "/blog";
    export let category: string = "all";

    // const { prev, next, series = "All posts", seriesUrl="/blog", category } = Astro.props
</script>

<div class="navigator {category}">
    <div class="page">
        {#if prev}
            <a href={`/blog/article/${prev.slug}`}>
                <b>&larr; PREV</b>
                <span class="title" style="justify-content: flex-start">{prev.data.title}{#if prev.data.draft}<sup>[draft]</sup>{/if}</span>
            </a>
        {/if}
    </div>
    <div class="series"><a href={seriesUrl}>{series}</a></div>
    <div class="page" style="text-align: right">
        {#if next}
            <a href={`/blog/article/${next.slug}`}>
                <b>NEXT &rarr;</b>
                <span class="title" style="justify-content: flex-end">{next.data.title}{#if next.data.draft}<sup>[draft]</sup>{/if}</span>
            </a>
        {/if}
    </div>
</div>

<style lang="scss">
    @use "sass:map";
    @use "sass:list";
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;

    @each $category, $data in $categories {
        $base-color: list.nth($data, 1);
        $border-color: list.nth($data, 2);
        $light-color: list.nth($data, 3);
        .navigator.#{$category} {
            border-color: $border-color;
            box-shadow: util.extrude(8, $border-color);
            background-color: $light-color;
            .series {
                background-color: $base-color;
                border-color: $border-color;
            }
            a {
                color: $border-color;
            }
        }
    }

</style>