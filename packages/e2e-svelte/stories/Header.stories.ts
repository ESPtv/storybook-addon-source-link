import type { Meta, StoryObj } from "@storybook/svelte-vite";

import type {
	ResolveContext,
	SourceLinkParameter,
} from "storybook-addon-source-link";
import { joinPath } from "storybook-addon-source-link";

import Header from "./Header.svelte";

const meta = {
	title: "Example/Header",
	component: Header,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
	args: {
		user: { name: "Jane Doe" },
	},
};

export const LoggedOut: Story = {};

export const WithCustomLinks: Story = {
	args: {
		user: { name: "Jane Doe" },
	},
	parameters: {
		sourceLink: {
			links: {
				"component-editor": false,
				"story-editor": false,
				"header-github": {
					label: "Open Header on GitHub",
					href: "https://github.com/elecdeer/storybook-addon-source-link/blob/main/packages/e2e-svelte/stories/Header.svelte",
					icon: "GithubIcon",
					order: 1,
				},
				"header-custom-link": {
					label: "Custom external link",
					href: "https://example.com",
					icon: "LinkIcon",
					type: "linkBlank" as const,
					order: 2,
				},
			},
		} satisfies SourceLinkParameter,
	},
};

export const WithFunctionLinks: Story = {
	args: {
		user: { name: "Jane Doe" },
	},
	parameters: {
		sourceLink: {
			links: {
				"component-editor": false,
				"story-editor": false,
				"dynamic-github": ({ importPath, isStaticBuild }: ResolveContext) => ({
					label: isStaticBuild ? "GitHub (Static Build)" : "GitHub (Dev Mode)",
					href: `https://github.com/elecdeer/storybook-addon-source-link/blob/main/${joinPath("packages/e2e-svelte", importPath)}`,
					icon: "GithubIcon",
					order: 1,
				}),
				"context-aware": ({ name, id }: ResolveContext) => ({
					label: `Story: ${name}`,
					href: `https://example.com/story/${id}`,
					icon: "BookIcon",
					order: 2,
				}),
			},
		} satisfies SourceLinkParameter,
	},
};
