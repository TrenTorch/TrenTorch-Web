<script lang="ts">
	import type { ModuleMetadata, RuntimeState } from '$lib/curriculum/types';
	import {
		Play,
		ShieldCheck,
		RotateCcw,
		ChevronLeft,
		ChevronRight,
		Layers,
		CheckCircle2,
		Loader2
	} from '@lucide/svelte';

	let {
		module,
		runtimeState = 'ready',
		isRunning = false,
		isCompleted = false,
		onOpenDrawer = () => {},
		onPrevModule = () => {},
		onNextModule = () => {},
		onResetCode = () => {},
		onRunCode = () => {},
		onRunTests = () => {}
	} = $props<{
		module: ModuleMetadata;
		runtimeState: RuntimeState;
		isRunning: boolean;
		isCompleted: boolean;
		onOpenDrawer?: () => void;
		onPrevModule?: () => void;
		onNextModule?: () => void;
		onResetCode?: () => void;
		onRunCode?: () => void;
		onRunTests?: () => void;
	}>();

	let runtimeStatusText = $derived.by(() => {
		switch (runtimeState) {
			case 'loading_runtime':
				return 'Loading Pyodide...';
			case 'loading_packages':
				return 'Loading NumPy...';
			case 'running':
				return 'Executing...';
			case 'testing':
				return 'Running Tests...';
			case 'error':
				return 'Runtime Error';
			default:
				return 'Pyodide Ready';
		}
	});
</script>

<header
	class="flex h-12 w-full items-center justify-between border-b border-border bg-background px-4 font-mono text-xs text-foreground"
>
	<!-- Left: Module selector & navigation -->
	<div class="flex items-center gap-2">
		<button
			type="button"
			class="flex items-center gap-2 border border-border bg-secondary px-2.5 py-1.5 transition-colors hover:border-foreground/30 hover:bg-muted"
			onclick={onOpenDrawer}
			title="Open Curriculum Modules List"
		>
			<Layers class="size-3.5 text-muted-foreground" />
			<span class="font-bold">{module.number.toString().padStart(2, '0')}_{module.slug}</span>
			{#if isCompleted}
				<CheckCircle2 class="size-3.5 text-foreground" />
			{/if}
		</button>

		<div class="flex items-center border border-border bg-secondary">
			<button
				type="button"
				class="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
				disabled={module.number <= 1}
				onclick={onPrevModule}
				title="Previous Module"
			>
				<ChevronLeft class="size-3.5" />
			</button>
			<div class="h-3 w-px bg-border"></div>
			<button
				type="button"
				class="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
				disabled={module.number >= 20}
				onclick={onNextModule}
				title="Next Module"
			>
				<ChevronRight class="size-3.5" />
			</button>
		</div>
	</div>

	<!-- Center: Status indicator -->
	<div class="hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex">
		{#if runtimeState === 'loading_runtime' || runtimeState === 'loading_packages' || isRunning}
			<Loader2 class="size-3 animate-spin text-foreground" />
		{:else if runtimeState === 'ready'}
			<div class="size-1.5 rounded-full bg-foreground"></div>
		{:else}
			<div class="size-1.5 rounded-full bg-muted-foreground"></div>
		{/if}
		<span>{runtimeStatusText}</span>
	</div>

	<!-- Right: Action Buttons -->
	<div class="flex items-center gap-2">
		<button
			type="button"
			class="flex items-center gap-1.5 border border-border bg-secondary px-2.5 py-1.5 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
			onclick={onResetCode}
			title="Reset code to original starter template"
		>
			<RotateCcw class="size-3" />
			<span class="hidden md:inline">Reset</span>
		</button>

		<button
			type="button"
			class="flex items-center gap-1.5 border border-border bg-muted px-3 py-1.5 text-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
			disabled={isRunning}
			onclick={onRunCode}
			title="Execute code (Shift+Enter)"
		>
			<Play class="size-3 fill-current" />
			<span>Run</span>
		</button>

		<button
			type="button"
			class="flex items-center gap-1.5 bg-primary px-3 py-1.5 font-bold text-primary-foreground shadow-sm transition-colors hover:opacity-85 disabled:pointer-events-none disabled:opacity-40"
			disabled={isRunning}
			onclick={onRunTests}
			title="Run Test Suite & Verify Implementation"
		>
			<ShieldCheck class="size-3.5" />
			<span>Test & Submit</span>
		</button>
	</div>
</header>
