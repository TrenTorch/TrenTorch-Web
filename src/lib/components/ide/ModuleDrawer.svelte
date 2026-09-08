<script lang="ts">
	import { MODULES, MODULE_PARTS } from '$lib/curriculum/modules';
	import type { ModuleMetadata } from '$lib/curriculum/types';
	import { getCompletedModules } from '$lib/runtime/storage';
	import { X, Check, ArrowRight, Layers } from '@lucide/svelte';

	let {
		isOpen = false,
		activeModuleId = '',
		onSelect = () => {},
		onClose = () => {}
	} = $props<{
		isOpen: boolean;
		activeModuleId: string;
		onSelect?: (mod: ModuleMetadata) => void;
		onClose?: () => void;
	}>();

	let completedSet = $state(new Set<string>());

	$effect(() => {
		if (isOpen) {
			completedSet = getCompletedModules();
		}
	});

	let progressPercent = $derived(Math.round((completedSet.size / MODULES.length) * 100));
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex bg-foreground/20 backdrop-blur-sm transition-opacity">
		<!-- Backdrop click to close -->
		<button
			type="button"
			class="fixed inset-0 h-full w-full cursor-default"
			onclick={onClose}
			aria-label="Close drawer"
		></button>

		<!-- Sidebar Container -->
		<div
			class="relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden border-r border-border bg-background p-6 font-mono text-foreground shadow-2xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-border pb-4">
				<div class="flex items-center gap-2">
					<Layers class="size-4 text-foreground" />
					<h2 class="text-sm font-bold tracking-wider uppercase">Curriculum Modules</h2>
				</div>
				<button
					type="button"
					class="flex size-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
					onclick={onClose}
				>
					<X class="size-4" />
				</button>
			</div>

			<!-- Overall Progress -->
			<div class="my-4 border border-border bg-secondary p-3">
				<div class="mb-2 flex items-center justify-between text-xs text-muted-foreground">
					<span>Overall Progress</span>
					<span class="font-bold text-foreground"
						>{completedSet.size} / {MODULES.length} Completed ({progressPercent}%)</span
					>
				</div>
				<div class="h-1.5 w-full overflow-hidden bg-muted">
					<div
						class="h-full bg-foreground transition-all duration-300"
						style="width: {progressPercent}%"
					></div>
				</div>
			</div>

			<!-- Module List grouped by Part -->
			<div class="flex-1 space-y-6 overflow-y-auto pr-1">
				{#each MODULE_PARTS as part (part.id)}
					{@const partModules = MODULES.filter((m) => m.part === part.id)}
					<div>
						<div class="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
							{part.title}
						</div>
						<div class="space-y-1.5">
							{#each partModules as mod (mod.id)}
								{@const isCurrent = mod.id === activeModuleId}
								{@const isDone = completedSet.has(mod.id)}
								<button
									type="button"
									class="flex w-full items-center justify-between border p-2.5 text-left text-xs transition-colors {isCurrent
										? 'border-foreground bg-secondary font-bold text-foreground'
										: 'border-border bg-background text-foreground/70 hover:border-foreground/30 hover:bg-secondary'}"
									onclick={() => {
										onSelect(mod);
										onClose();
									}}
								>
									<div class="flex items-center gap-2.5">
										<div
											class="flex size-5 shrink-0 items-center justify-center border text-[10px] {isDone
												? 'border-foreground bg-foreground text-background'
												: isCurrent
													? 'border-foreground text-foreground'
													: 'border-border text-muted-foreground'}"
										>
											{#if isDone}
												<Check class="size-3 stroke-[3]" />
											{:else}
												{mod.number}
											{/if}
										</div>
										<div>
											<div class="font-medium {isCurrent ? 'text-foreground' : 'text-foreground/80'}">
												{mod.title}
											</div>
											<div class="text-[10px] text-muted-foreground">
												{mod.difficulty} • {mod.estimatedTime}
											</div>
										</div>
									</div>

									{#if isCurrent}
										<ArrowRight class="size-3.5 text-foreground" />
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
