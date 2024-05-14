<script lang="ts">
    import { onMount } from "svelte";

    export let instance: string;
    export let id: string;
    export let title: string;
    export let description: string | undefined;
    export let duration: `${number}:${number}` | undefined;
    export let noJs = false;

    let iframe: HTMLIFrameElement;

    
    const src = `${instance}/embed/${id}`;
    
    onMount(() => {
        iframe.src = src;
    })
</script>

<div class="video-wrapper{noJs? "": " video-js"}">
    <iframe bind:this={iframe} class="video-player" title="Video player" src={noJs? src : "/video-placeholder/"}></iframe>
</div>
<div class="videoCaption{noJs? "": " video-js"}">
    <p>
        <b><u>{title ?? "Untitled video"}</u></b>
            {#if duration}
                <span>({duration})</span>
            {/if}
        </p>
    {#if description}
        <p><i class="biyonic-string">{description}</i></p>
    {/if}
</div>

<style lang="scss">
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;

    :global(.video-player) {
        width: 100%;
        aspect-ratio: 16 / 9;
        border: 2px solid #{$emphasis-color};
    }
    :global(.video-wrapper.video-js) {
        border: 2px solid #{$emphasis-color};
        box-shadow: util.extrude(8);
        background: $nav-color-dark;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        aspect-ratio: 16 / 9;
        position: relative;
        :global(.video-player) {
            box-shadow: none;
            background: none;
            border: none;
        }
    }
    :global(.videoCaption b) {
        margin-bottom: 1em;
    }
</style>