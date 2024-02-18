<script lang="ts">
    import { onMount } from "svelte";

    import "@lib/extensions";
    import type { BlurbList } from "@lib/content/config";

    export let blurbList: BlurbList;
    export let maxLength = 6;

    let blurbs: string[] = ["Hello! Welcome to my blog!", "This website works without JavaScript.", ...blurbList.base.shuffle()];

    onMount(() => {
        const now = new Date();
        blurbs = [...blurbs, ...blurbList.timed.shuffle().filter((blurb) => {
            if(blurb.singleDate != null) {
                const date = new Date(blurb.singleDate.date);
                const result = (!blurb.singleDate.useYear || date.getUTCFullYear() == now.getUTCFullYear()) && date.getUTCMonth() == now.getUTCMonth() && date.getUTCDate() == now.getUTCDate()
                return result;
            } else if (blurb.dateRange != null) {
                const from = new Date(blurb.dateRange.from);
                const to = new Date(blurb.dateRange.to);
                if(blurb.dateRange.useYear) {
                    return from.getTime() <= now.getTime() && to.getTime() >= now.getTime()
                } else {
                    if(now.getUTCMonth() < from.getUTCMonth() || now.getUTCMonth() > to.getUTCMonth()) {
                        return false;
                    }
                    if(now.getUTCMonth() == from.getUTCMonth()) {
                        return now.getUTCDate() >= from.getUTCDate() && (from.getUTCMonth() != to.getUTCMonth() || now.getUTCDate() <= to.getUTCDate())
                    } else if(now.getUTCMonth() == to.getUTCMonth()) {
                        return now.getUTCDate() <= to.getUTCDate() && (from.getUTCMonth() != to.getUTCMonth() || now.getUTCDate() >= from.getUTCDate())
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }).map(blurb => blurb.text)]
        blurbs[1] = "It's nice to see you here!";
        if(blurbs.length > maxLength)
            blurbs.length = 6;
    });
</script>

<ul aria-hidden="true">
    {#each blurbs as blurb}
        <li>{blurb}</li>
    {/each}
</ul>

<style lang="scss">
    @use "../styles/vars.scss" as *;

    ul {
        position: absolute;
        display: flex;
        align-items: center;
        width: max-content;
        overflow: hidden;
        height: 100%;
        margin: 0;
        padding: 0;
        color: #{$base-color};
        text-shadow: 0px 2px 2px rgba(26, 255, 232, 0.555);
        animation: marquee 20s linear infinite;
        user-select: none;
        font-size: 14px;
        li {
            display: block;
            margin: 3em;
        }
    }

    @keyframes marquee {
        0% { transform: translate(calc(40vw + 1em)) }
        100% { transform: translate(-100%) }
    }
</style>