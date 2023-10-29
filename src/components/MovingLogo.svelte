<script>
    export let websiteText = "The Yonic Corner";
	export let theme = "default";
</script>

<div class="bungee-{theme}">
	<div class="bungee-container">
		{#each websiteText.split("") as char}
			{#if char===" "}
				<span class="bungee" translate="no">&nbsp;</span>
			{:else}
				<span class="bungee" translate="no">{char}</span>
			{/if}
		{/each}
		<div class="bungee-shadow">
			{#each websiteText.split("") as char}
				{#if char===" "}
					<span class="bungee" translate="no">&nbsp;</span>
				{:else}
					<span class="bungee" translate="no">{char}</span>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
    @use "../styles/util.scss";
    @use "../styles/vars.scss" as *;

	$bungee-length: 16;

    @for $i from 1 through $bungee-length {
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
			transform: translate3d(0px, 0px, 0px);
			animation: logo 2s ease-in-out infinite;
			text-shadow: util.extrude(4, black);
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

	.bungee-legacy > .bungee-container {
		.bungee {
			animation-name: logo-legacy;
			animation-duration: 2s;
			animation-timing-function: steps(#{$bungee-length}, start)!important;
			text-shadow: #{util.extrude(6, #00322e)};
			-webkit-text-stroke: 2.5px #002a26;
		}
		.bungee-shadow {
			display: none;
		}
		@for $i from 1 through 16 {
			> .bungee:nth-child(#{$i}) {
				animation-delay: -#{$i * 0.1}s;
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

	@keyframes logo-legacy {
		0%,100% {
			color: #0041d0;
			transform: translate3d(0px, 0px, 0px);
		}
		50% {
			color: #00fcff;
		}
		85% {
			color: #00f14c;
			transform: translate3d(0px, 0px, 0px);
		}
		90% {
			color: #0041d0;
			transform: translate3d(0, -15px, 0px);
		}
	}
</style>