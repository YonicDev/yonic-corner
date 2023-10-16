<script lang="ts">
    import { biyonicEnabled } from "@lib/stores";
    export let readingTime: {
        text: number,
        video: number
    };
</script>

<span>
    {#if $biyonicEnabled}
        <b>{Math.round(readingTime.text * 0.5)}</b>
    {:else}
        {readingTime.text}
    {/if}
    {#if $biyonicEnabled}<b>min</b>{:else}min{/if}{#if Math.round(readingTime.text * 0.5) != 1}s{/if}
    {#if readingTime.video > 0}
        (plus {readingTime.video} min{#if readingTime.video != 1}s{/if} of videos)
    {/if}
</span>
