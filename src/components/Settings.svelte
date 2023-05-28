<div id="settings-panel">
    <div class="settings-inner">
        <p>There are no settings to configure yet.</p>
    </div>
    <div class="settings-tab"><img alt="Music" src="/img/icons/settings.svg" width="28"/></div>
</div>

<style lang="scss">
    @use "../styles/util.scss";
    #settings-panel {
        @media screen and (orientation: portrait) and (min-width: 768px), screen and (orientation: landscape) and (min-width: 1024px) {
            display: flex;
        }  
        position: fixed;
        z-index: 555;
        display: none;
        width: 20%;
        min-width: 370px;
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
    }
</style>