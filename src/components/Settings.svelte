<script lang="ts">
    import Toggle from "svelte-toggle";
    import { textVide } from "text-vide";

    import { biyonicEnabled } from "@lib/stores"

    $biyonicEnabled = window.localStorage.getItem("biyonic-reading") === "on";

    $: {
        window.localStorage.setItem("biyonic-reading", $biyonicEnabled? "on" : "off");
        toggleBiyonic();
    }

    // Elements with HTML inside.
    const biyonicElements = Array.from(document.getElementsByClassName("biyonic")) as HTMLElement[];
    const biyonicHTML = biyonicElements.map(element => {
        return {element, innerHTML: element.innerHTML}
    });
    
    // String only elements.
    const biyonicStringElements = Array.from(document.getElementsByClassName("biyonic-string")) as HTMLElement[];
    const biyonicStrings = biyonicStringElements.map(element => {
        return {element, innerString: element.innerHTML}
    });


    async function toggleBiyonic() {
        if($biyonicEnabled) {
            await Promise.all([
                ...biyonicStrings.map(({element, innerString}) => {
                    return new Promise<void>((resolve) => {
                        element.innerHTML = textVide(innerString, { ignoreHtmlTag: false });
                        resolve();
                    })
                }),
                ...biyonicHTML.map(({element, innerHTML}) => {
                    return new Promise<void>((resolve) => {
                        let nonBiyonicElements = Array.from(element.getElementsByClassName("no-biyonic")) as HTMLElement[];
                        const nonBiyonicOriginalHtml = nonBiyonicElements.map((ignoredElement) => ignoredElement.innerHTML.slice());
                        element.innerHTML = textVide(innerHTML, { ignoreHtmlTag: true });
                        nonBiyonicElements = Array.from(element.getElementsByClassName("no-biyonic")) as HTMLElement[];
                        for (let i in nonBiyonicElements) {
                            const ignoredElement = nonBiyonicElements[i];
                            ignoredElement.innerHTML = nonBiyonicOriginalHtml[i];
                        }
                        resolve();
                    })
                }),
            ]);
        } else {
            await Promise.all([
                ...biyonicStrings.map(({element, innerString}) => {
                    return new Promise<void>((resolve) => {
                        element.innerHTML = innerString;
                        resolve();
                    })
                }),
                ...biyonicHTML.map(({element, innerHTML}) => {
                    return new Promise<void>((resolve) => {
                        element.innerHTML = innerHTML;
                        resolve();
                    })
                }),
            ]);
        }
    }
</script>

<div id="settings-panel">
    <div class="settings-inner">
        <div>
            <label for="biyonicToggle">{@html textVide("Biyonic reading", {ignoreHtmlTag: true})} <a href="/blog/article/biyonic-reading" target="_blank" rel="noreferrer">(?)</a></label>
            <Toggle id="biyonicToggle" style="cursor: url('/img/cursors/pointer.png'), pointer;" toggledColor="var(--nav-color-dark)" bind:toggled={$biyonicEnabled} hideLabel on="On" off="Off"/>
        </div>
    </div>
    <div class="settings-tab"><img alt="Music" src="/img/icons/settings.svg" width="28"/></div>
</div>

<style lang="scss">
    @use "../styles/util.scss";
    #settings-panel {
        display: flex;
        position: fixed;
        z-index: 555;
        width: 250px;
        height: 69px;
        bottom: 64px;
        left: 0;
        box-shadow: util.extrude(8);
        transform: translateX(calc(-100% + 28px));
        background-color: var(--article-color);
        border: 2px solid var(--emphasis-color);
        transition: transform 0.5s ease-out;

        .settings-inner {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 16px;
        }

        .settings-tab {
            display: flex;
            background-color: var(--nav-color-dark);
            width: 28px;
        }

        &:hover {
            transform: translateX(-8px);
        }
        label {
            font-size: 16px;
            cursor: url("/img/cursors/text.png"), text;
        }
    }
</style>