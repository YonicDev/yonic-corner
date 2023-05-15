<script lang="ts">
    import type { CollectionEntry } from "astro:content";

    export let before: CollectionEntry<"blog"> | undefined = undefined;
    export let after: CollectionEntry<"blog">  | undefined = undefined;
    export let series = "All posts"
</script>

<div class="navigator">
    <div>
        {#if before}
            <a href="/blog/{before.slug}">
                PREV
                <br/>
                {before.data.title}
            </a>
        {/if}
    </div>
    <div class="series">{series}</div>
    <div>
        {#if after}
            <a href="/blog/{after.slug}">
                NEXT
                <br/>
                {after.data.title}
            </a>
        {/if}
    </div>
</div>

<style lang="scss">
    .navigator {
        display: flex;
        width: 80%;
        max-width: 600px;
        justify-content: center;
        align-items: stretch;
        border: 1px solid black;
        margin: 0 auto;
        margin-bottom: 2rem;
        div {
            padding: 0 1rem;
            display: flex;
            flex-direction: column;
            width: 40%;
            a {
                width: 100%;
            }
        }
        .series {
            width: 20%;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border: solid black;
            border-width: 0 1px 0 1px;
        }
    }
</style>