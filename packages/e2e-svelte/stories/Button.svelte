<script lang="ts">
	export let label: string = "Button";
	export let primary: boolean = false;
	export let size: "small" | "medium" | "large" = "medium";
	export let backgroundColor: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
</script>

<button
	type="button"
	class="storybook-button"
	class:storybook-button--primary={primary}
	class:storybook-button--secondary={!primary}
	class:storybook-button--small={size === "small"}
	class:storybook-button--large={size === "large"}
	style={backgroundColor ? `background-color: ${backgroundColor}` : ""}
	on:click={onClick}
>
	{label}
</button>

<style>
	.storybook-button {
		font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 700;
		border: 0;
		border-radius: 3em;
		cursor: pointer;
		display: inline-block;
		line-height: 1;
	}
	.storybook-button--primary {
		color: white;
		background-color: #1ea7fd;
	}
	.storybook-button--secondary {
		color: #333;
		background-color: transparent;
		box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
	}
	.storybook-button--small {
		font-size: 12px;
		padding: 10px 16px;
	}
	.storybook-button--large {
		font-size: 16px;
		padding: 12px 24px;
	}
	.storybook-button:not(.storybook-button--small):not(.storybook-button--large) {
		font-size: 14px;
		padding: 11px 20px;
	}
</style>
