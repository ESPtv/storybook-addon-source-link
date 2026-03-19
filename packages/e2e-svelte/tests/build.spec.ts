import { expect, test } from "@playwright/test";

test.describe("Storybook Svelte (Build) - addon-source-link", () => {
	test("should load Storybook homepage from static files", async ({ page }) => {
		await page.goto("/");

		await expect(page).toHaveTitle(/Storybook/);
		await expect(page.locator("nav")).toBeVisible();
		await expect(page.locator("iframe#storybook-preview-iframe")).toBeVisible();
	});

	test("should display source-link addon tool in static build", async ({
		page,
	}) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.getByText("Button", { exact: true }).first().click();
		await page.waitForURL(/.*button.*/i, { timeout: 10000 });

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await expect(sourceLinkButton).toBeVisible();
		await expect(sourceLinkButton.locator("svg")).toBeVisible();
	});

	test("should show only 'Powered by' link in static build (no rootPath)", async ({
		page,
	}) => {
		// In a static build, rootPath is empty, so editor links are hidden.
		// Only the static "Powered by" link should remain.
		await page.goto("/?path=/story/example-button--primary");
		await page.waitForLoadState("networkidle");

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await expect(sourceLinkButton).toBeVisible();
		await sourceLinkButton.click();

		const tooltip = page.locator('[data-testid="tooltip"]');
		await expect(tooltip).toBeAttached({ timeout: 10000 });

		const links = tooltip.locator("a[href], button");
		const linkCount = await links.count();
		expect(linkCount).toBe(1);

		const poweredByLink = links.first();
		expect(await poweredByLink.textContent()).toBe(
			"Powered by addon-source-link",
		);
		expect(await poweredByLink.getAttribute("href")).toBe(
			"https://github.com/elecdeer/storybook-addon-source-link",
		);
	});
});
