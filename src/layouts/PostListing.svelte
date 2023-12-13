<script lang="ts">
    import type { CollectionEntry } from 'astro:content';

    import { categories } from "@lib/settings";

    import Tag from "@lib/components/Tag.svelte";
    import PostIcon from "@lib/components/PostIcon.svelte";

    export let posts: CollectionEntry<"blog">[];
    export let currentPage = 1;
    export let lastPage: number;
    export let baseUrl: string;
    export let heroImages: (string | null)[];

    const dateFormat = new Intl.DateTimeFormat('en-US',
    {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    })
</script>

<slot/>
<ul class="listing">
    <!-- Nested anchor elements are illegal, so instead, we make hit zones in separate layers. -->
    {#each posts as post, i} 
        <li class="article">
            <a aria-label="Article poster image" class="hero" class:placeholder={heroImages[i]==null} href={`/blog/article/${post.slug}`} style={`background-image: ${heroImages[i]? `url(${heroImages[i]})` : `url(/img/icons/category-${post.data.category}.svg), url(/img/pattern3.svg); background-color: ${categories[post.data.category].baseColor}!important`}; background-position: center ${post.data.heroPosition ?? "center"}, top left`}/>
            <div class="data">
                <a href={`/category/${post.data.category}/1`} class="category">{categories[post.data.category].title.toUpperCase()}</a>
                <a href={`/blog/article/${post.slug}`}>
                    <h1>{post.data.title}{#if post.data.draft} <sup>[draft]</sup>{/if}</h1>
                    <span class="metadata">
                        <span class="dataGroup">
                            <PostIcon title="Published on" icon="post" height={24} width={24} />
                            <span>{dateFormat.format(post.data.pubDate)}</span>
                        </span>
                        {#if post.data.updatedDate}
                            <span class="dataGroup">
                                <PostIcon title="Last updated on" icon="edit" height={22} width={22} />
                                <span>{dateFormat.format(post.data.updatedDate)}</span>
                            </span>
                        {/if}
                    </span>
                    <p class="description biyonic-string">{post.data.description}</p>
                    </a>
                <div class="tags">
                    <PostIcon title="Tags" icon="tag" height={22} width={22}/>
                    {#if post.data.tags.length > 0}
                        {#each post.data.tags as tag}
                            <Tag {tag} />
                        {/each}
                    {:else}
                        <span>None</span>
                    {/if}
                </div>
            </div>
        </li>
    {/each}
</ul>

<ul class="nav">
    {#if currentPage > 1} 
        <li><a href={`${baseUrl}/1`}>&lt;&lt; <span class="label">First</span></a></li>
    {/if}
    <li><ul class="adjacent">
        {#if (currentPage - 2) > 0}
            <li><a href={`${baseUrl}/${currentPage-2}`}>{currentPage-2}</a></li>
        {/if}
        {#if (currentPage - 1) > 0} 
            <li><a href={`${baseUrl}/${currentPage-1}`}>{currentPage-1}</a></li>
        {/if}
        <li class="current"><a href={`${baseUrl}/${currentPage}`}>{currentPage}</a></li>
        {#if lastPage >= (currentPage +1)}
            <li><a href={`${baseUrl}/${currentPage+1}`}>{currentPage+1}</a></li>
        {/if}
        {#if lastPage >= (currentPage +2)}
            <li><a href={`${baseUrl}/${currentPage+2}`}>{currentPage+2}</a></li>
        {/if}
    </ul></li>
    {#if currentPage < lastPage}
        <li><a href={`${baseUrl}/${lastPage}`}>&gt;&gt; <span class="label">Last</span></a></li>
    {/if}
</ul>

<style lang="scss">
    @use '../styles/util.scss';
    @use '../styles/vars.scss' as *;

    .listing {
        padding: 0;
        margin: 0 auto;
        width: 100%;
        max-width: 1200px;
        li {
            display: block;
            margin: 1rem;
        }
        .article {
            display: flex;
            align-items: stretch;
            gap: 1rem;
            border: 2px solid #{$emphasis-color};
            background-color: #{$article-color};
            box-shadow: util.extrude(8);
            position: relative;
            .hero, .data {
                width: 50%;
            }

            .hero {
                background-repeat: no-repeat;
                background-size: cover;
                background-color: #{$nav-color-dark};
            }


            .hero.placeholder {
                background-repeat: no-repeat, repeat;
                background-size: contain, 16px;
            }

            a {
                display: block;
                color: #{$emphasis-color};
                padding-right: 1rem;
                text-decoration: none;
            }
            
            .data {
                padding: 1rem 0;
                h1 {
                    display: -webkit-box;
                    font-size: 24pt;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    margin: 0;
                    padding: 0.5rem 0;
                    sup {
                        font-size: 40%;
                    }
                }
                .dataGroup {
                    display: inline-block;
                    > span {
                        margin-right: 1em;
                    }
                    &:last-child > span {
                        margin-right: 0;
                    }
                }

                .description {
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    height: 90px;
                }

                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    color: #{$emphasis-color};
                }
            }
            .category {
                font-weight: bold;
            }
        }
    }

    .nav {
        display: flex;
        width: 100%;
        margin: 1.5rem auto;
        justify-content: center;
        gap: 10px;
        padding: 0;
        li {
            display: block;
            
            a {
                display: flex;
                justify-content: center;
                padding: 10px;
                border: 2px solid #{$emphasis-color};
                background: #{$nav-color-dark};
                color: #{$emphasis-color};
                font-weight: bold;
                box-shadow: util.extrude(4);
                text-decoration: none;
            }

        }
        .adjacent {
            display: flex;
            gap: 6px;
            padding: 0;
            li > a {
                width: 4ch;
            }
            li.current > a {
                border: 2px solid #{$nav-color-dark};
                background: #{$article-color};
                font-weight: bold;
                color: #{$nav-color-dark};
                box-shadow: util.extrude(4, #{$nav-color-dark});
            }
        }
    }

    @media screen and (max-width: 768px) {
        .listing {
            .article {
                flex-direction: column;
                gap: 0;
            }
            .hero {
                flex-grow: 1;
                width: auto!important;
                aspect-ratio: 16 / 9;
            }
            .data {
                width: auto!important;
                padding: 1rem!important;
            }
        }
        .nav a .label {
            display: none;
        }
    }
</style>