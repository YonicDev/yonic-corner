<script lang="ts">
export let tag: string;
export let total: number | undefined = undefined;

</script>

<a class:list={tag} href={`/tags/${tag}/1`}>
    <span class="biyonic-string">{tag.replace("-", " ")}</span>
    {#if total}<span>{total}</span>{/if}
</a>

<style lang="scss">
    @use "../styles/vars.scss" as *;

    a {
        display: inline-flex;
        gap: 1rem;
        background-color: #{$base-color};
        padding: 4px 1em;
        margin: 2px 4px!important;
        border-radius: 999px;
        font-size: 16px;
        text-decoration: none;
        color: #{$emphasis-color};
    }
</style>