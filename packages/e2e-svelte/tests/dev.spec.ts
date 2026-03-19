import { expect, test } from "@playwright/test";

test.describe("Storybook Svelte - addon-source-link", () => {
	test("should load Storybook homepage", async ({ page }) => {
		await page.goto("/");

		await expect(page).toHaveTitle(/Storybook/);
		await expect(page.locator("nav")).toBeVisible();
		await expect(page.locator("iframe#storybook-preview-iframe")).toBeVisible();
	});

	test("should display source-link addon tool", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.getByText("Button", { exact: true }).first().click();
		await page.waitForURL(/.*button.*/i, { timeout: 10000 });

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await expect(sourceLinkButton).toBeVisible();
		await expect(sourceLinkButton.locator("svg")).toBeVisible();
	});

	test("should have correct links for Button story — component link uses .ts not .tsx", async ({
		page,
	}) => {
		// This is the key regression test for Svelte support.
		// Before the fix, component-editor always produced a .tsx extension regardless of the
		// actual story file extension. For a .stories.ts file in a Svelte project this gave
		// Button.tsx — a file that does not exist — instead of Button.ts.
		await page.goto("/?path=/story/example-button--primary");
		await page.waitForLoadState("networkidle");

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await expect(sourceLinkButton).toBeVisible();
		await sourceLinkButton.click();

		const tooltip = page.locator('[data-testid="tooltip"]');
		await expect(tooltip).toBeAttached({ timeout: 10000 });

		const links = tooltip.locator("a[href], button");
		const linkCount = await links.count();
		expect(linkCount).toBeGreaterThan(0);

		const expectedLinkLabels = [
			// story-editor: points to the .stories.ts file
			"./stories/Button.stories.ts",
			// component-editor: strips ".stories" and keeps the original extension (.ts, not .tsx)
			"./stories/Button.ts",
			"Powered by addon-source-link",
		];

		expect(linkCount).toBe(expectedLinkLabels.length);

		for (let i = 0; i < linkCount; i++) {
			const title = await links.nth(i).textContent();
			expect(title).toBe(expectedLinkLabels[i]);
		}

		// Verify neither link shows the wrong .tsx extension
		const allTitles = await Promise.all(
			Array.from({ length: linkCount }, (_, i) => links.nth(i).textContent()),
		);
		for (const title of allTitles) {
			expect(title).not.toMatch(/\.tsx$/);
		}
	});

	test("should display editor type links as clickable buttons without href", async ({
		page,
	}) => {
		await page.goto("/?path=/story/example-button--primary");
		await page.waitForLoadState("networkidle");

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await sourceLinkButton.click();

		const tooltip = page.locator('[data-testid="tooltip"]');
		await expect(tooltip).toBeAttached({ timeout: 10000 });

		const storyEditorLink = tooltip
			.locator("button")
			.filter({ hasText: "./stories/Button.stories.ts" });
		await expect(storyEditorLink).toBeVisible();
		await expect(storyEditorLink).toBeEnabled();
		expect(await storyEditorLink.getAttribute("href")).toBeNull();

		const componentEditorLink = tooltip
			.locator("button")
			.filter({ hasText: "./stories/Button.ts" });
		await expect(componentEditorLink).toBeVisible();
		await expect(componentEditorLink).toBeEnabled();
		expect(await componentEditorLink.getAttribute("href")).toBeNull();
	});

	test("should display custom links for Header WithCustomLinks story", async ({
		page,
	}) => {
		await page.goto("/?path=/story/example-header--with-custom-links");
		await page.waitForLoadState("networkidle");

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await expect(sourceLinkButton).toBeVisible();
		await sourceLinkButton.click();

		const tooltip = page.locator('[data-testid="tooltip"]');
		await expect(tooltip).toBeAttached({ timeout: 10000 });

		const links = tooltip.locator("a[href], button");
		const linkCount = await links.count();
		expect(linkCount).toBeGreaterThanOrEqual(2);

		const actualLinks = await Promise.all(
			Array.from({ length: linkCount }, async (_, i) => ({
				title: await links.nth(i).textContent(),
				href: await links.nth(i).getAttribute("href"),
			})),
		);

		const githubLink = actualLinks.find(
			(l) => l.title === "Open Header on GitHub",
		);
		expect(githubLink).toBeTruthy();
		expect(githubLink?.href).toBe(
			"https://github.com/elecdeer/storybook-addon-source-link/blob/main/packages/e2e-svelte/stories/Header.svelte",
		);

		const customLink = actualLinks.find((l) => l.title === "Custom external link");
		expect(customLink).toBeTruthy();
		expect(customLink?.href).toBe("https://example.com");

		const poweredBy = actualLinks.find(
			(l) => l.title === "Powered by addon-source-link",
		);
		expect(poweredBy).toBeTruthy();
		expect(poweredBy?.href).toBe(
			"https://github.com/elecdeer/storybook-addon-source-link",
		);
	});

	test("should display function-based links for Header WithFunctionLinks story", async ({
		page,
	}) => {
		await page.goto("/?path=/story/example-header--with-function-links");
		await page.waitForLoadState("networkidle");

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await expect(sourceLinkButton).toBeVisible();
		await sourceLinkButton.click();

		const tooltip = page.locator('[data-testid="tooltip"]');
		await expect(tooltip).toBeAttached({ timeout: 10000 });

		const links = tooltip.locator("a[href], button");
		const linkCount = await links.count();
		expect(linkCount).toBeGreaterThanOrEqual(2);

		const actualLinks = await Promise.all(
			Array.from({ length: linkCount }, async (_, i) => ({
				title: await links.nth(i).textContent(),
				href: await links.nth(i).getAttribute("href"),
			})),
		);

		const githubLink = actualLinks.find((l) => l.title === "GitHub (Dev Mode)");
		expect(githubLink).toBeTruthy();
		expect(githubLink?.href).toBe(
			"https://github.com/elecdeer/storybook-addon-source-link/blob/main/packages/e2e-svelte/stories/Header.stories.ts",
		);

		const contextLink = actualLinks.find(
			(l) => l.title === "Story: With Function Links",
		);
		expect(contextLink).toBeTruthy();
		expect(contextLink?.href).toBe(
			"https://example.com/story/example-header--with-function-links",
		);
	});

	test("should have correct links for Header autodocs", async ({ page }) => {
		await page.goto("/?path=/docs/example-header--docs");
		await page.waitForLoadState("networkidle");

		const sourceLinkButton = page.locator('button[title="Open source file"]');
		await expect(sourceLinkButton).toBeVisible();
		await sourceLinkButton.click();

		const tooltip = page.locator('[data-testid="tooltip"]');
		await expect(tooltip).toBeAttached({ timeout: 10000 });

		const links = tooltip.locator("a[href], button");
		const linkCount = await links.count();
		expect(linkCount).toBeGreaterThan(0);

		const expectedLinkLabels = [
			"./stories/Header.stories.ts",
			"./stories/Header.ts",
			"Powered by addon-source-link",
		];

		expect(linkCount).toBe(expectedLinkLabels.length);
		for (let i = 0; i < linkCount; i++) {
			expect(await links.nth(i).textContent()).toBe(expectedLinkLabels[i]);
		}
	});
});
