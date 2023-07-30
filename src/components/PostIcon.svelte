<script lang="ts">
    export let icon: string;
    export let title: string;
    export let width = 24;
    export let height = 24;
    export let style = "";
</script>

<picture {title} class="icon" {style}>
    <source srcset={`/img/icons/${icon}.svg`} type="image/svg+xml"/>
    <source srcset={`/img/icons/${icon}.svg`} type="image/svg"/>
    <img alt={title} {title} class="icon" src={`/img/icons/${icon}.png`} height={height ?? 24} width={width ?? 24} {style} />
</picture>

<style>
    .icon {
        cursor: url("/img/cursors/help.png"), help;
        vertical-align: text-bottom;
    }
</style>