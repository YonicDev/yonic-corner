<script lang="ts">
    import { onMount } from "svelte";
    import additionalBlurbs from "@assets/blurbs";

    const commonBlurbs: Blurb[] = [
        {
            blurb: "Hello! Welcome to my blog!"
        },
        {
            blurb: "This blog works without JavaScript."
        },
        {
            blurb: "Marquees are a thing again!"
        },
    ]

    function shuffle<T>(array: T[]) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    let blurbs: Blurb[] = [];
    onMount(async () => {
        commonBlurbs[1].blurb = "It's nice to see you here!";
        const filteredBlurbs = additionalBlurbs.filter(({start, end}) => {
            if(start == null || end == null)
                return true;
            else {
                const now = new Date();
                start.setFullYear(now.getFullYear());
                end.setFullYear(now.getFullYear());
                return now >= start && now <= end;
            }
        })
        blurbs = commonBlurbs.concat(filteredBlurbs);
        shuffle(blurbs);
        blurbs.length = 3;
    });
</script>

<ul aria-hidden="true">
    {#each (blurbs.length > 0 ? blurbs : commonBlurbs) as {blurb}}
        <li>{blurb}</li>
    {/each}
</ul>

<style lang="scss">
    ul {
        position: absolute;
        display: flex;
        align-items: center;
        width: max-content;
        overflow: hidden;
        height: 100%;
        margin: 0;
        padding: 0;
        color: var(--base-color);
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