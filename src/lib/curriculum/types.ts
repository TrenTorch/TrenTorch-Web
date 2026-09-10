export type ModulePartId =
	| 'foundations'
	| 'vision'
	| 'nlp'
	| 'systems'
	// New atomized curriculum sections (data/<section>/), appended
	// rather than replacing the legacy four above -- the old 20-module
	// curriculum keeps using those, these are additive.
	| 'classical-ml'
	| 'deep-learning'
	| 'llm'
	| 'vision-transformer'
	| 'systems-optimization';

export interface ModulePart {
	id: ModulePartId;
	title: string;
	description: string;
	moduleRange: string;
}

export interface TestCase {
	name: string;
	description: string;
}

export interface ModuleMetadata {
	id: string; // e.g. "01_tensor"
	slug: string; // e.g. "01-tensor"
	number: number; // 1..20
	title: string;
	subtitle: string;
	part: ModulePartId;
	partTitle: string;
	difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
	estimatedTime: string;
	summary: string;
	guideMarkdown: string;
	starterCode: string;
	solutionCode: string;
	// Real pytest source for the legacy 20 modules AND the new atomized
	// curriculum alike -- pyodideWorker.ts installs pytest via micropip
	// and runs this file directly. No run_tests()-function convention
	// needed; a plain `def test_*():` + `assert` file works as-is.
	testHarnessCode: string;
	// Atomized curriculum only: earlier questions in the same track,
	// cleaned of dev-only cross-question loading, concatenated in
	// order. Written into solution.py ahead of the student's own
	// current-question code so later questions can call earlier ones'
	// functions directly, exactly like a real student session
	// accumulating solved modules. Undefined for the legacy 20 modules
	// (each of those is already self-contained).
	priorSolutionsCode?: string;
	testCases: TestCase[];
	hints: string[];
}

export interface SingleTestResult {
	name: string;
	passed: boolean;
	durationMs: number;
	error?: string;
	expected?: string;
	actual?: string;
	stdout?: string;
}

export interface SubmissionResult {
	moduleId: string;
	totalTests: number;
	passedTests: number;
	failedTests: number;
	allPassed: boolean;
	totalDurationMs: number;
	results: SingleTestResult[];
	rawOutput: string;
	error?: string;
}

export type RuntimeState =
	| 'uninitialized'
	| 'loading_runtime'
	| 'loading_packages'
	| 'ready'
	| 'running'
	| 'testing'
	| 'error';

export interface ExecutionResult {
	success: boolean;
	output: string;
	error?: string;
	durationMs: number;
}
