<script lang="ts">
	import { marked } from 'marked';
	import type { ModuleMetadata } from '$lib/curriculum/types';
	import { ChevronDown, ChevronRight, Lightbulb, BookOpen } from '@lucide/svelte';

	let { module } = $props<{ module: ModuleMetadata }>();

	let showHints = $state(false);
	let htmlContent = $derived(marked.parse(module.guideMarkdown, { async: false }) as string);
</script>

<div class="h-full overflow-y-auto bg-background p-5 font-mono text-sm text-foreground/90">
	<!-- Module Header Info -->
	<div class="mb-6 border-b border-border pb-4">
		<div
			class="mb-1 flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase"
		>
			<BookOpen class="size-3.5" />
			<span>{module.partTitle}</span>
			<span>•</span>
			<span>{module.difficulty}</span>
			<span>•</span>
			<span>{module.estimatedTime}</span>
		</div>
		<h1 class="text-xl font-bold tracking-tight text-foreground">
			{module.number.toString().padStart(2, '0')}. {module.title}
		</h1>
		<p class="mt-1 text-xs text-muted-foreground">{module.subtitle}</p>
	</div>

	<!-- Markdown Content -->
	<div
		class="prose max-w-none text-xs leading-relaxed prose-neutral dark:prose-invert prose-headings:font-mono prose-headings:text-foreground prose-p:text-foreground/80 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-pre:border prose-pre:border-border prose-pre:bg-secondary"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html htmlContent}
	</div>

	<!-- Hints Accordion -->
	{#if module.hints && module.hints.length > 0}
		<div class="mt-8 border border-border bg-secondary p-3">
			<button
				type="button"
				class="flex w-full items-center justify-between font-mono text-xs font-semibold text-foreground/80 hover:text-foreground"
				onclick={() => (showHints = !showHints)}
			>
				<span class="flex items-center gap-2">
					<Lightbulb class="size-3.5 text-muted-foreground" />
					Hints & Implementation Tips ({module.hints.length})
				</span>
				{#if showHints}
					<ChevronDown class="size-4 text-muted-foreground" />
				{:else}
					<ChevronRight class="size-4 text-muted-foreground" />
				{/if}
			</button>

			{#if showHints}
				<ul class="mt-3 space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
					{#each module.hints as hint, idx (idx)}
						<li class="flex items-start gap-2">
							<span class="font-mono text-muted-foreground/60 select-none">{idx + 1}.</span>
							<span>{hint}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>
