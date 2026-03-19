<script lang="ts">
	export let user: { name: string } | undefined = undefined;
	export let onLogin: (() => void) | undefined = undefined;
	export let onLogout: (() => void) | undefined = undefined;
	export let onCreateAccount: (() => void) | undefined = undefined;
</script>

<header>
	<div class="storybook-header">
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
				<title>Storybook</title>
				<path fill="#FF4785" d="M9.29 0L8.8 6.09c-.01.15.1.28.25.29l1.37.1c.15.01.28-.1.3-.25L11.2.54 9.29 0z" />
				<path fill="#FF4785" d="M32 0H0v32h32z" />
			</svg>
			<h1>Acme</h1>
		</div>
		<div>
			{#if user}
				<span class="welcome">Welcome, <b>{user.name}</b>!</span>
				<button type="button" on:click={onLogout}>Log out</button>
			{:else}
				<button type="button" on:click={onCreateAccount}>Sign up</button>
				<button type="button" class="button--primary" on:click={onLogin}>Log in</button>
			{/if}
		</div>
	</div>
</header>

<style>
	header {
		font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		padding: 15px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.storybook-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.storybook-header div {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	h1 {
		font-weight: 900;
		font-size: 20px;
		margin: 0;
	}
	.welcome {
		color: #333;
		font-size: 14px;
	}
	button {
		font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 700;
		font-size: 14px;
		border: 0;
		border-radius: 3em;
		cursor: pointer;
		padding: 10px 20px;
	}
	.button--primary {
		color: white;
		background-color: #1ea7fd;
	}
</style>
