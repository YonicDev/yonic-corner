<script lang="ts">
import { categories } from "@lib/settings";
</script>

<ul class="category-list">
    {#each Object.entries(categories) as [id, category]}
        <li class={`link-${id}`} >
            <a href={`/category/${id}/1`}>
                {category.title.toUpperCase()}
            </a>
        </li>
    {/each}
</ul>

<style lang="scss">
    @use "sass:list";
    @use "sass:map";
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;

    @each $category, $data in $categories {
        .category-list li.link-#{$category} a:hover {
            background-color: list.nth($data, 1);
            color: list.nth($data, 2);
            border-color: list.nth($data, 2);
            box-shadow: util.extrude(8, list.nth($data, 2));
        }
        .category-list li.link-#{$category} a:active {
            background-color: list.nth($data, 1);
            color: list.nth($data, 2);
            border-color: list.nth($data, 2);
            box-shadow: none;
        }
    }

    .category-list {
        display: block;
        text-align: center;
        width: 100%;
        max-width: 1200px;
        padding: 0;
        margin: 0 auto;
        padding: 1rem;
        gap: 0.5em;
        font-weight: bold;
        flex-wrap: wrap;
        justify-content: center;
        li {
            display: inline;
            margin: 0.2rem 0;
            a {
                display: inline-block;
                position: relative;
                border: 2px solid #{$emphasis-color};
                background-color: #{$article-color};
                padding: 0.5rem 1rem;
                color: #{$emphasis-color};
                box-shadow: util.extrude(4);
                transform: translate3d(0, 0, 0);
                transition: all 0.1s ease-out;
                &:hover {
                    transform: translate3d(-4px, -4px, 0);
                }
                &:active {
                    transform: translate3d(4px, 4px, 0);
                }
            }
        }
    }
</style>