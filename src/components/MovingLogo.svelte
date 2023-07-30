<script lang="ts">
    export let websiteText = "The Yonic Corner";
</script>

<h1>Welcome to &nbsp;
    <div class="bungee-container">
        {#each websiteText.split("") as char,i}
            {#if char===" "}
                <span class="bungee" translate="no">&nbsp;</span>
            {:else}
                <span class="bungee" translate="no">{char}</span>
            {/if}
        {/each}
        <div class="bungee-shadow">
            {#each websiteText.split("") as char,i}
                {#if char===" "}
                    <span class="bungee" translate="no">&nbsp;</span>
                {:else}
                    <span class="bungee" translate="no">{char}</span>
                {/if}
            {/each}
        </div>
    </div>
</h1>

<style lang="scss">
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;

    @for $i from 1 through 16 {
        .bungee-container > .bungee:nth-child(#{$i}), .bungee-container > .bungee-shadow > span:nth-child(#{$i}) {
            animation-delay: #{$i * 0.1}s;
        }
    }

    .bungee-container {
		position: relative;
		z-index: 0;
		cursor: url("/img/cursors/arrow.png"), default;
		.bungee {
			display: inline-block;
			font-family: Bungee, Arial, Helvetica, sans-serif;
			color: #{$emphasis-color};
			-webkit-text-stroke: 2px black;
			animation: logo 2s ease-in-out infinite;
			text-shadow: 2px 2px 0px black, 4px 4px 0px black;
			z-index: 1;
		}
		.bungee-shadow {
			position: absolute;
			display: block;
			width: 100%;
			font-family: Bungee, Arial, Helvetica, sans-serif;
			opacity: 1;
			top: 4px;
			left: 4px;
			z-index: -1;
			span {
				animation: shadow 2s ease-in-out infinite;
			}
		}
	}

    @keyframes logo {
		0%, 100% {
			color: #0b396d;
			transform: translate3d(0px, 0px, 0px);
		}
		25%, 75% {
			color: #21dfe6;
		}
		50% {
			color: #c0ffdc;
			transform: translate3d(-15px, -15px, 0px);
		}
	}

	@keyframes shadow {
		0%, 100% {
			opacity: 1;
			filter: blur(0px);
		}
		50% {
			opacity: 0.5;
			filter: blur(3px);
		}
	}
</style>