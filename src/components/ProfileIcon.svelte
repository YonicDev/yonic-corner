<script lang="ts">
    import { onMount } from "svelte";

    export let images: Record<string, {
        webp: string,
        png: string
    }>;

    
    function selectSource(currentDate: Date): keyof typeof images {
        const month = currentDate.getUTCMonth();
        if(images.special != null)
            return "special";
        if(month >= 9 || month <= 2)
            return "winter";
        return "summer";
    }

    let profileSource = images[selectSource(new Date())]

    onMount(() => {
        profileSource = images[selectSource(new Date())];
    })
    
</script>

<picture id="profile-image">
    <source srcset={profileSource.webp} type="image/webp" />
    <img alt="Profile icon" src={profileSource.png} width=200 height=200 />
</picture>

<style lang="scss">
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;

    #profile-image {
        display: block;
        position: relative;
        top: -8px;
        left: -8px;
        border: 4px solid #{$emphasis-color};
        border-radius: 50%;
        box-shadow: util.extrude(8, $emphasis-color);
        margin: 0 auto;
        width: 208px;
        height: 208px;
    }
</style>