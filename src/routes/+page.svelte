<script lang="ts">
	import { resolve } from '$app/paths';
	import LogoMark from '$lib/components/LogoMark.svelte';
	import Button from '$lib/components/Button.svelte';
	import { MODULES, MODULE_PARTS } from '$lib/curriculum/modules';
	import { ArrowRight, Code2, Terminal, Play, Sparkles } from '@lucide/svelte';
	import Github from '$lib/components/GithubIcon.svelte';

	const GITHUB_URL = 'https://github.com/TrenTorch/TrenTorch';

	const FEATURES = [
		{
			title: 'No local setup',
			body: 'The same 20-module curriculum as the CLI, running straight in the browser: no Python venv, no CLI install.'
		},
		{
			title: 'Built on SvelteKit',
			body: 'A fast, small, modern web stack: no framework weight standing between the student and the material.'
		},
		{
			title: 'Same curriculum, new surface',
			body: "Tensor to Transformer, one op at a time, exactly as it's taught in TrenTorch's CLI, just reachable from a browser tab."
		},
		{
			title: 'Open source, same team',
			body: 'Built by the same maintainers, under the same governance and Code of Conduct as TrenTorch itself.'
		}
	];
</script>

<div>
	<!-- Hero -->
	<section class="container flex flex-col items-center px-4 pt-20 pb-12 text-center md:px-6">
		<div
			class="mb-6 inline-flex items-center gap-2 border border-border bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground"
		>
			<Sparkles class="size-3.5 text-primary" />
			<span>Interactive Web IDE Now Live</span>
		</div>

		<LogoMark class="mb-6 h-16 w-16" />
		<h1 class="mb-4 font-mono text-4xl font-bold tracking-tight sm:text-6xl">
			TrenTorch<span class="text-primary">-Web</span>
		</h1>
		<p class="mb-3 max-w-2xl font-mono text-xl text-muted-foreground">
			Build PyTorch from scratch in your browser
		</p>
		<p class="mb-8 max-w-2xl font-mono text-sm text-neutral-400">
			20 progressive modules taking you from raw NumPy tensors to a complete GPT Transformer with
			KV-cache and INT8 quantization.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<Button size="lg" href={resolve('/ide')} class="font-mono font-bold">
				<Code2 class="size-4" />
				Launch Web IDE
			</Button>
			<Button
				size="lg"
				variant="outline"
				href={GITHUB_URL}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Github class="size-4" />
				TrenTorch CLI
			</Button>
			<Button size="lg" variant="ghost" href={resolve('/docs')}>
				<Terminal class="size-4" />
				Documentations
			</Button>
		</div>
	</section>

	<!-- Curriculum Map Section -->
	<section class="container px-4 py-12 md:px-6">
		<div class="mx-auto max-w-5xl">
			<div class="mb-8 flex items-center justify-between border-b border-border pb-4">
				<div>
					<h2 class="font-mono text-xl font-bold tracking-tight">20 Progressive Modules</h2>
					<p class="mt-1 font-mono text-xs text-muted-foreground">
						Master deep learning systems through 4 progressive milestones.
					</p>
				</div>
				<a
					href={resolve('/ide')}
					class="hidden items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline sm:inline-flex"
				>
					<span>Open All in IDE</span>
					<ArrowRight class="size-3.5" />
				</a>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				{#each MODULE_PARTS as part (part.id)}
					{@const partModules = MODULES.filter((m) => m.part === part.id)}
					<div class="flex flex-col justify-between border border-border bg-secondary/40 p-5">
						<div>
							<div
								class="mb-2 flex items-center justify-between font-mono text-xs text-muted-foreground"
							>
								<span class="font-bold tracking-wider uppercase">{part.title}</span>
								<span>{part.moduleRange}</span>
							</div>
							<p class="mb-4 font-mono text-xs text-neutral-400">{part.description}</p>

							<div class="space-y-2 border-t border-border pt-3">
								{#each partModules as mod (mod.id)}
									<a
										href={resolve(`/ide/${mod.id}`)}
										class="group flex items-center justify-between border border-border/40 bg-background/50 p-2 font-mono text-xs transition-colors hover:border-border hover:bg-background"
									>
										<div class="flex items-center gap-2">
											<span class="text-muted-foreground"
												>{mod.number.toString().padStart(2, '0')}</span
											>
											<span class="font-medium text-foreground group-hover:text-primary"
												>{mod.title}</span
											>
										</div>
										<Play class="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
									</a>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Features -->
	<section class="container px-4 py-16 md:px-6">
		<div class="mx-auto max-w-5xl">
			<h2 class="mb-6 text-center font-mono text-xl font-bold tracking-tight">
				Built for Deep Learning Systems
			</h2>
			<div class="grid gap-px border bg-border sm:grid-cols-2">
				{#each FEATURES as feature (feature.title)}
					<div class="bg-background p-6">
						<h3 class="mb-2 font-mono font-semibold">{feature.title}</h3>
						<p class="font-mono text-xs leading-relaxed text-muted-foreground">{feature.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>
