export type ModulePartId = 'foundations' | 'vision' | 'nlp' | 'systems';

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
	testHarnessCode: string;
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
