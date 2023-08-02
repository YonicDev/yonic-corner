<script lang="ts">
    export let categoryId: string;
    export let category: Category;
</script>

<div class="heroContainer">
    <div class="data">
        <h1>{category.title}</h1>
        <p class="biyonic-string">{category.description ? category.description : "Dolor sit amet"}</p>
    </div>
    <div class="hero" style={`background-color: ${category.baseColor}; background-image: url(/img/icons/category-${categoryId}.svg), url(/img/pattern3.svg)`}/>
</div>

<style lang="scss">
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;

    .heroContainer {
        display: flex;
        position: relative;
        width: calc(100% - 3rem);
        max-width: 1600px;
        margin: 1rem auto;
        border: 4px solid #{$emphasis-color};
        background-color: #{$article-color};
        box-shadow: util.extrude(12);
        z-index: 2;
        div {
            padding: 0.5rem 1rem;
            width: 50%;
        }
        .data {
            h1 {
                display: inline-block;
                word-break: break-word;
                font-size: 38pt;
            }
            p {
                font-size: 14pt;
                min-height: 5em;
            }
        }
        .hero {
            padding: 20px;
            background-size: contain, 16px;
            background-repeat: no-repeat, repeat;
            background-position: center, top left;
            background-origin: content-box, border-box;
        }
    }

    @media screen and (max-width: 750px) {
        .heroContainer {
            flex-direction: column-reverse;
            height: 500px;
            h1 {
                margin: 0.25rem 0;
            }
            div {
                width: auto;
            }
            .data > p {
                min-height: 0;
            }
            .hero {
                flex-grow: 1;
            }
        }
    }
</style>