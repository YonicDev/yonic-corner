<script lang="ts">
    let hasMusic = false;
    let nowPlaying = false;
    let playerTimeout: number;

    let player: HTMLIFrameElement;

    function onPlayMusic() {
        const src = player.contentWindow?.location.href ?? "/player/null";
        if(player.contentWindow != null && /\/player\/null$/.test(src))
            return;
        nowPlaying = true;
        playerTimeout = setTimeout(() => {
            nowPlaying = false;
            hasMusic = true;
        }, 3000) as unknown as number;
    }
</script>

<div  id="player" class:hasMusic class:nowPlaying>
    <iframe bind:this={player} name="music-player" title="Music player" scrolling="no" on:load={onPlayMusic} src="/player/null"></iframe>
    <div class="music-tab"><img alt="Music" src="/img/icons/music.svg" width="28"/></div>
</div>

<noscript>
<style>
    #player {
        transform: translateX(calc(-100% + 28px))!important;
    }
</style>
</noscript>

<style lang="scss">
    @use "../styles/util.scss";
    #player {
        @media screen and (orientation: portrait) and (min-width: 768px), screen and (orientation: landscape) and (min-width: 1024px) {
            display: flex;
        }  
        position: fixed;
        z-index: 555;
        display: none;
        width: 20%;
        min-width: 370px;
        height: 69px;
        bottom: 150px;
        left: 0;
        box-shadow: util.extrude(8);
        transform: translateX(calc(-100% - 8px));
        background-color: var(--article-color);
        border: 2px solid var(--emphasis-color);
        transition: transform 0.5s ease-out;

        iframe {
            height: 100%; 
            border: none;
            flex-grow: 1;
        }

        .music-tab {
            display: flex;
            background-color: var(--nav-color-dark);
        }

        &.nowPlaying, &:hover {
            transform: translateX(-8px)!important;
        }

        &.hasMusic {
            transform: translateX(calc(-100% + 28px));
        }
    }
</style>