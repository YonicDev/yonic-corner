<script lang="ts">
    import { onMount } from "svelte";

    export let images: Record<string, {
        webp: string,
        png: string
    }>;

    let profilePicture: HTMLSourceElement;
    let profileImage: HTMLImageElement;

    onMount(() => {
        const currentMonth = new Date().getMonth();
        if(currentMonth >= 9 || currentMonth <= 2) {
            profileImage.src = images.winter.png;
            profilePicture.src = images.winter.webp;
        }
    })
    
</script>

<picture id="profile-image">
    <source bind:this={profilePicture} srcset={images.summer.webp} type="image/webp" />
    <img bind:this={profileImage} alt="Profile icon" src={images.summer.png} width=200 height=200 />
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