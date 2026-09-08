<script lang="ts">
	import { onMount } from 'svelte';
	import { MODULES } from '$lib/curriculum/modules';
	import type { ModuleMetadata } from '$lib/curriculum/types';
	import { pyodideService } from '$lib/runtime/pyodideService';
	import {
		loadUserCode,
		saveUserCode,
		resetUserCode,
		isModuleCompleted,
		saveLastActiveModule,
		getLastActiveModule
	} from '$lib/runtime/storage';
	import IdeHeader from '$lib/components/ide/IdeHeader.svelte';
	import GuidePane from '$lib/components/ide/GuidePane.svelte';
	import CodeEditor from '$lib/components/ide/CodeEditor.svelte';
	import OutputConsole from '$lib/components/ide/OutputConsole.svelte';
	import TestResultsView from '$lib/components/ide/TestResultsView.svelte';
	import ModuleDrawer from '$lib/components/ide/ModuleDrawer.svelte';
	import { BookOpen, Code2, Terminal, ShieldCheck } from '@lucide/svelte';

	let activeModule = $state<ModuleMetadata>(MODULES[0]);
	let userCode = $state('');
	let isDrawerOpen = $state(false);
	let activeRightTab = $state<'console' | 'tests'>('tests');
	let mobileActiveTab = $state<'guide' | 'editor' | 'output'>('editor');

	let runtimeState = $state(pyodideService.runtimeState);
	let consoleOutput = $state(pyodideService.consoleOutput);
	let testResults = $state(pyodideService.testResults);
	let isRunning = $state(pyodideService.isRunning);

	onMount(() => {
		pyodideService.init();

		const lastId = getLastActiveModule(MODULES[0].id);
		const found = MODULES.find((m) => m.id === lastId || m.slug === lastId) || MODULES[0];
		selectModule(found);
	});

	function selectModule(mod: ModuleMetadata) {
		activeModule = mod;
		userCode = loadUserCode(mod.id, mod.starterCode);
		saveLastActiveModule(mod.id);
		pyodideService.testResults.set(null);
	}

	function handleCodeChange(newCode: string) {
		userCode = newCode;
		saveUserCode(activeModule.id, newCode);
	}

	function handleResetCode() {
		if (confirm('Reset code to the original starter template for this module?')) {
			resetUserCode(activeModule.id);
			userCode = activeModule.starterCode;
		}
	}

	async function handleRunCode() {
		activeRightTab = 'console';
		mobileActiveTab = 'output';
		try {
			await pyodideService.runCode(userCode);
		} catch (e) {
			console.error('Run failed', e);
		}
	}

	async function handleRunTests() {
		activeRightTab = 'tests';
		mobileActiveTab = 'output';
		try {
			await pyodideService.runTests(userCode, activeModule.testHarnessCode, activeModule.id);
		} catch (e) {
			console.error('Test run failed', e);
		}
	}

	function handlePrevModule() {
		const idx = MODULES.findIndex((m) => m.id === activeModule.id);
		if (idx > 0) {
			selectModule(MODULES[idx - 1]);
		}
	}

	function handleNextModule() {
		const idx = MODULES.findIndex((m) => m.id === activeModule.id);
		if (idx < MODULES.length - 1) {
			selectModule(MODULES[idx + 1]);
		}
	}
</script>

<svelte:head>
	<title
		>{activeModule.number.toString().padStart(2, '0')}_{activeModule.slug} | TrenTorch Web IDE</title
	>
	<meta
		name="description"
		content="Build deep learning framework primitives in Python directly in your browser with TrenTorch Web IDE."
	/>
</svelte:head>

<div
	class="flex h-[calc(100vh-3.5rem)] w-full flex-col overflow-hidden bg-background font-mono text-foreground"
>
	<!-- IDE Top Header -->
	<IdeHeader
		module={activeModule}
		runtimeState={$runtimeState}
		isRunning={$isRunning}
		isCompleted={isModuleCompleted(activeModule.id)}
		onOpenDrawer={() => (isDrawerOpen = true)}
		onPrevModule={handlePrevModule}
		onNextModule={handleNextModule}
		onResetCode={handleResetCode}
		onRunCode={handleRunCode}
		onRunTests={handleRunTests}
	/>

	<!-- Mobile Tab Switcher (visible on small viewports) -->
	<div class="flex border-b border-border bg-secondary text-xs md:hidden">
		<button
			type="button"
			class="flex flex-1 items-center justify-center gap-1.5 py-2 {mobileActiveTab === 'guide'
				? 'border-b-2 border-primary bg-background font-bold text-foreground'
				: 'text-muted-foreground'}"
			onclick={() => (mobileActiveTab = 'guide')}
		>
			<BookOpen class="size-3.5" />
			<span>Guide</span>
		</button>
		<button
			type="button"
			class="flex flex-1 items-center justify-center gap-1.5 py-2 {mobileActiveTab === 'editor'
				? 'border-b-2 border-primary bg-background font-bold text-foreground'
				: 'text-muted-foreground'}"
			onclick={() => (mobileActiveTab = 'editor')}
		>
			<Code2 class="size-3.5" />
			<span>Editor</span>
		</button>
		<button
			type="button"
			class="flex flex-1 items-center justify-center gap-1.5 py-2 {mobileActiveTab === 'output'
				? 'border-b-2 border-primary bg-background font-bold text-foreground'
				: 'text-muted-foreground'}"
			onclick={() => (mobileActiveTab = 'output')}
		>
			<Terminal class="size-3.5" />
			<span>Output</span>
		</button>
	</div>

	<!-- Main Multi-Pane Area -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Left Pane: Guide & Objectives -->
		<div
			class="h-full shrink-0 overflow-hidden border-r border-border md:w-[38%] lg:w-[35%] {mobileActiveTab ===
			'guide'
				? 'block w-full'
				: 'hidden md:block'}"
		>
			<GuidePane module={activeModule} />
		</div>

		<!-- Right Column: Code Editor (Top) + Terminal & Test Suite (Bottom) -->
		<div
			class="flex h-full flex-1 flex-col overflow-hidden {mobileActiveTab === 'guide'
				? 'hidden md:flex'
				: 'flex w-full'}"
		>
			<!-- Top Section: CodeMirror Editor -->
			<div
				class="flex min-h-[40%] flex-1 flex-col overflow-hidden border-b border-border {mobileActiveTab ===
				'output'
					? 'hidden md:flex'
					: 'flex w-full'}"
			>
				<div
					class="flex h-8 items-center justify-between border-b border-border bg-secondary px-3 text-[11px] text-muted-foreground"
				>
					<div class="flex items-center gap-1.5">
						<Code2 class="size-3" />
						<span>{activeModule.id}.py</span>
					</div>
					<div class="text-[10px] text-muted-foreground/70">Python 3.10 • Shift+Enter to run</div>
				</div>
				<div class="flex-1 overflow-hidden">
					<CodeEditor value={userCode} onRun={handleRunCode} onChange={handleCodeChange} />
				</div>
			</div>

			<!-- Bottom Section: Terminal & Test Results -->
			<div
				class="flex h-[42%] min-h-[180px] shrink-0 flex-col overflow-hidden {mobileActiveTab ===
				'editor'
					? 'hidden md:flex'
					: 'flex w-full'}"
			>
				<!-- Tabs Bar -->
				<div class="flex h-8 items-center border-b border-border bg-secondary px-1 text-xs">
					<button
						type="button"
						class="flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors {activeRightTab ===
						'tests'
							? 'border-t-2 border-primary bg-background font-bold text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
						onclick={() => (activeRightTab = 'tests')}
					>
						<ShieldCheck class="size-3" />
						<span>Tests</span>
					</button>
					<button
						type="button"
						class="flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors {activeRightTab ===
						'console'
							? 'border-t-2 border-primary bg-background font-bold text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
						onclick={() => (activeRightTab = 'console')}
					>
						<Terminal class="size-3" />
						<span>Console</span>
					</button>
				</div>

				<!-- Tab Contents -->
				<div class="flex-1 overflow-hidden">
					{#if activeRightTab === 'tests'}
						<TestResultsView results={$testResults} onNextModule={handleNextModule} />
					{:else}
						<OutputConsole
							output={$consoleOutput}
							onClear={() => pyodideService.consoleOutput.set('')}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Module Drawer Modal -->
	<ModuleDrawer
		isOpen={isDrawerOpen}
		activeModuleId={activeModule.id}
		onSelect={(mod) => selectModule(mod)}
		onClose={() => (isDrawerOpen = false)}
	/>
</div>
