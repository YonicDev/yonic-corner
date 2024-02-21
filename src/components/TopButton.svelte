<script lang="ts">
    import { onMount } from "svelte";

    import { spring } from "svelte/motion";

    export let href: string;
    export let targetId: string;

    const margin = -128;

    let scrollY = 0;
    let targetY = 0;
    let offset = spring(margin, {
        stiffness: 0.1,
        damping: 0.5
    });
    let button: HTMLAnchorElement;
    $: $offset = scrollY < targetY ? margin : 0;
    onMount(() => {
        const linkSection = document.getElementById(targetId);
        if(linkSection) {
            const rect = linkSection.getBoundingClientRect();
            targetY = rect.top + rect.height;
        }
    })

    function onClick() {
        window.scrollTo({top: 0});
        button.style.pointerEvents = "none";
        button.style.pointerEvents = "all";
    }
    
</script>
<svelte:window bind:scrollY={scrollY} />
<a bind:this={button} {href} id="top-scroller" title="Back to top" style="margin-right: {$offset}px;" on:click|preventDefault={onClick}>&uarr;</a>

<style lang="scss">
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;
    #top-scroller {
        position: fixed;
        bottom: 64px;
        right: -32px;
        z-index: 99;
        display: flex;
        align-items: center;
        border: 3px solid #{$emphasis-color};
        width: 64px;
        padding-left: 0.5rem;
        height: 69px;
        font-size: 16pt;
        background-color: $nav-color-dark;
        box-shadow: util.extrude(8);
        color: $article-color;
        text-decoration: none;
        transition: all 0.1s ease-out;
        @media (hover:hover) {
            &:hover {
                right: -3px;
            }
        }
    }
</style>