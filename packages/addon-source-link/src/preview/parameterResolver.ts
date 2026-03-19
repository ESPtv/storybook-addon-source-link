import { type FC, useEffect as useReactEffect } from "react";
import type { Addon_DecoratorFunction } from "storybook/internal/types";
import { addons, useEffect as useSbEffect } from "storybook/preview-api";
import { EVENTS } from "../constants";
import type {
	LinkEntry,
	Resolvable,
	ResolveContext,
	SourceLinkParameter,
} from "../types";

// Creates the channel listener effect function, returning a cleanup callback.
// Used by both the story decorator and the React docs component.
const createParameterResolverEffect =
	(parameter: SourceLinkParameter) => () => {
		const channel = addons.getChannel();

		const handler = (context: ResolveContext) => {
			const resolvedParameters = Object.entries(parameter.links)
				.map(([id, entry]) => {
					const resolvedEntry = resolveLinkEntry(entry, context);
					if (!resolvedEntry) return undefined;
					return {
						id,
						...resolvedEntry,
					};
				})
				.filter((entry) => !!entry);

			channel.emit(EVENTS.RESPONSE_RESOLVABLE_PARAM, resolvedParameters);
		};

		channel.on(EVENTS.REQUEST_RESOLVABLE_PARAM, handler);

		return () => {
			channel.off(EVENTS.REQUEST_RESOLVABLE_PARAM, handler);
		};
	};

// For story decorators: uses Storybook's own framework-agnostic useEffect from
// preview-api so this works in React, Svelte, Vue, and any other framework.
export const useParameterResolver = (
	parameter: SourceLinkParameter,
	disabled?: boolean,
) => {
	useSbEffect(() => {
		if (disabled) return;
		return createParameterResolverEffect(parameter)();
	});
};

export const withParameterResolver: Addon_DecoratorFunction = (
	StoryFn,
	ctx,
) => {
	// if the viewMode is docs, the source link is resolved in ParameterResolver
	useParameterResolver(ctx.parameters.sourceLink, ctx.viewMode === "docs");
	return StoryFn();
};

// For the React docs container component: uses React's own useEffect so it
// participates correctly in the React rendering lifecycle.
export const ParameterResolver: FC<{
	parameter: SourceLinkParameter;
}> = ({ parameter }) => {
	useReactEffect(createParameterResolverEffect(parameter));
	return null;
};

const resolveLinkEntry = (
	value: Resolvable<LinkEntry>,
	params: ResolveContext,
): LinkEntry => {
	if (value instanceof Function) {
		return value(params);
	}
	return value;
};
