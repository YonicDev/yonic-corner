<script lang="ts">
    import { onMount } from "svelte";
    import Toggle from "svelte-toggle";
    import { textVide } from "text-vide";
    
    import { biyonicEnabled } from "@lib/stores"

    const themes = ["auto", "light", "dark", "legacy"] as const;
    type Theme = typeof themes[number];

    let theme: Theme;

    let biyonicHTML: {element: HTMLElement, innerHTML: string}[];
    let biyonicStrings: {element: HTMLElement, innerString: string}[];

    onMount(() => {
        document.getElementById("settings-panel")!.style.display = "flex";
        // Elements with HTML inside.
        const biyonicElements = Array.from(document.getElementsByClassName("biyonic")) as HTMLElement[];
        biyonicHTML = biyonicElements.map(element => {
            return {element, innerHTML: element.innerHTML}
        });
        // String only elements.
        const biyonicStringElements = Array.from(document.getElementsByClassName("biyonic-string")) as HTMLElement[];
        biyonicStrings = biyonicStringElements.map(element => {
            return {element, innerString: element.innerHTML}
        });

        biyonicEnabled.set(window.localStorage.getItem("biyonic-reading") === "on");
        theme = (window.localStorage.getItem("theme") ?? "auto") as Theme;

        biyonicEnabled.subscribe((enabled) => {
            window.localStorage.setItem("biyonic-reading", enabled? "on" : "off");
            toggleBiyonic(enabled);
        })
    })

    const toggleColor: Record<Exclude<Theme, "auto">, string> = {
        light: "#00A090",
        dark: "#0e57aa",
        legacy: "#009183"
    }

    let toggleTheme: Exclude<Theme, "auto">;
    
    $: {
        if(theme != null) {
            window.localStorage.setItem("theme", theme);
            if(theme === "auto") {
                const autoTheme = window.matchMedia("(prefers-color-scheme: dark)").matches? "dark" : "light";
                document.documentElement.setAttribute("data-theme", autoTheme);
                toggleTheme = autoTheme;
            } else {
                document.documentElement.setAttribute("data-theme", theme);
                toggleTheme = theme;
            }
            (document.getElementById("player")?.getElementsByTagName("iframe")[0].contentWindow as any).setTheme();
            for (const iframe of document.getElementsByClassName("video-player") as HTMLCollectionOf<HTMLIFrameElement>) {
                (iframe.contentWindow as any).setTheme();
            }
        }
    }

    async function toggleBiyonic(enabled: boolean) {
        if(enabled) {
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
            <label for="themeSwitcher" class="biyonic-string">Theme</label><br/>
            <select id="themeSwitcher" bind:value={theme}>
                {#each themes as theme}
                    <option value={theme}>{theme[0].toUpperCase()}{theme.substring(1)}</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="biyonicToggle">{@html textVide("Bi(y)onic reading", {ignoreHtmlTag: true})} <a href="/blog/article/biyonic-reading" target="_blank" rel="noreferrer">(?)</a></label>
            <Toggle label="Toggle Bi(y)onic reading" aria-label="Toggle Biyonic reading" role="switch" id="biyonicToggle" style="cursor: url('/img/cursors/pointer.png'), pointer;" toggledColor={toggleColor[toggleTheme]} bind:toggled={$biyonicEnabled} hideLabel on="On" off="Off"/>
        </div>
    </div>
    <div class="settings-tab"><img alt="Music" src="/img/icons/settings.svg" width="28"/></div>
</div>

<style lang="scss">
    @use "../styles/util.scss";
    #settings-panel {
        display: none;
        position: fixed;
        z-index: 555;
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
            gap: 1em;
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
        select, option {
            cursor: url("/img/cursors/arrow.png"), default;
        }
    }
</style>