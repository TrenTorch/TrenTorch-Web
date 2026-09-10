#!/usr/bin/env node
/**
 * Converts one track's worth of atomized curriculum content
 * (data/<section>/<track>/<NN-question>/{meta.json,statement.md,
 * theory.md,starter.py,solution.py,tests.py}) into ModuleMetadata-shaped
 * objects, and prints the JS source to insert into modules.ts.
 *
 * This is scoped to ONE track deliberately (see data/README.md's own
 * "one track at a time" note): prove the whole pipeline -- schema,
 * starter stub, real pytest execution, cross-question reuse -- works
 * end to end on Linear Regression before running this on anything else.
 * Nothing here is Linear-Regression-specific; point TRACK_PATH at a
 * different track folder to generate the next one once this is proven.
 *
 * Usage: node scripts/generate-ide-modules-from-track.mjs > /tmp/out.txt
 * (manually reviewed and pasted into modules.ts's MODULES array --
 * deliberately not auto-inserted, this output should be read before
 * it lands anywhere near committed code)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

// ---- configure per run ----
const SECTION_ID = 'classical-ml';
const SECTION_TITLE = 'Classical ML';
const TRACK_DIR_NAME = 'linear-regression';
const TRACK_TITLE = 'Linear Regression';
const STARTING_NUMBER = 21; // legacy curriculum ends at 20
// ----------------------------

const TRACK_PATH = join(REPO_ROOT, 'data', SECTION_ID, TRACK_DIR_NAME);

const ESTIMATED_TIME_BY_DIFFICULTY = {
	Beginner: '15 min',
	Intermediate: '25 min',
	Advanced: '35 min',
	Mastery: '45 min'
};

function read(path) {
	// Normalize CRLF -> LF up front: this checkout has core.autocrlf=true,
	// so files on disk have \r\n even though the repo stores \n. Leaving
	// \r in place breaks exact string comparisons downstream (e.g.
	// finding a line that's exactly `"""`) in ways that are easy to miss
	// since .trim() hides it in most other checks.
	return readFileSync(path, 'utf-8').replace(/\r\n/g, '\n');
}

function listQuestionDirs(trackPath) {
	return readdirSync(trackPath)
		.filter((name) => !name.startsWith('_') && !name.startsWith('.'))
		.filter((name) => statSync(join(trackPath, name)).isDirectory())
		.sort();
}

/**
 * Strips the dev-only cross-question loading boilerplate our data/
 * files use for standalone pytest runs (see data/README.md), and
 * collects the names that boilerplate was pulling in, so callers can
 * replace it with a single `from solution import <names>` line -- the
 * shape that actually works once earlier questions' real code has
 * already been concatenated into one solution.py file in the browser.
 */
function stripLoadWiring(pythonSource) {
	// A leading `"""...pytest data/.../tests.py..."""` docstring is the
	// dev-only "how to run this file standalone" note -- irrelevant (and
	// confusing, it names a local file path) once shown to a browser
	// student. Strip the whole block, not line-by-line, since it spans
	// multiple lines.
	let withoutRunNote = pythonSource;
	const runNoteMatch = pythonSource.match(/^"""\s*\npytest data\/.*\n"""\s*\n/);
	if (runNoteMatch) {
		withoutRunNote = pythonSource.slice(runNoteMatch[0].length);
	}

	const lines = withoutRunNote.split('\n');
	const keptLines = [];
	const importedNames = new Set();

	const DROP_EXACT = new Set(['import sys', 'from pathlib import Path']);
	const DROP_PATTERNS = [/^sys\.path\.insert\(/, /^from _load import load_solution/];
	// e.g. `mse_grad = load_solution("classical-ml/linear-regression/03-mse-gradient").mse_grad`
	// or   `linear_forward = load_solution(f"classical-ml/linear-regression/{Path(__file__)...}").linear_forward`
	const ASSIGN_PATTERN = /^(\w+)\s*=\s*load_solution\(.*\)\.(\w+)\s*$/;

	for (const line of lines) {
		const trimmed = line.trim();
		if (DROP_EXACT.has(trimmed)) continue;
		if (DROP_PATTERNS.some((p) => p.test(trimmed))) continue;
		const assignMatch = trimmed.match(ASSIGN_PATTERN);
		if (assignMatch) {
			importedNames.add(assignMatch[2]);
			continue;
		}
		keptLines.push(line);
	}

	// Collapse the now-empty leading blank lines the removed block left behind.
	while (keptLines.length && keptLines[0].trim() === '') keptLines.shift();

	return {
		code: keptLines
			.join('\n')
			.replace(/\n{3,}/g, '\n\n')
			.trim(),
		importedNames
	};
}

/** tests.py needs a `from solution import x, y, z` line for every name it used to pull via load_solution. */
function buildCleanedTests(rawTests) {
	const { code, importedNames } = stripLoadWiring(rawTests);
	if (importedNames.size === 0) return code;
	const importLine = `from solution import ${[...importedNames].sort().join(', ')}`;
	// Insert right after the leading module docstring block, if any, else at the top.
	const lines = code.split('\n');
	let insertAt = 0;
	if (lines[0]?.trim() === '"""') {
		const closingIdx = lines.findIndex((l, idx) => idx > 0 && l.trim() === '"""');
		insertAt = closingIdx === -1 ? 0 : closingIdx + 1;
	}
	lines.splice(insertAt, 0, importLine, '');
	return lines.join('\n').trim();
}

function parseTestCases(cleanedTests) {
	const cases = [];
	const lines = cleanedTests.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const m = lines[i].match(/^def (test_\w+)\(/);
		if (!m) continue;
		// Best-effort description: the nearest preceding comment line, if any.
		let description = m[1].replace(/^test_/, '').replace(/_/g, ' ');
		for (let j = i - 1; j >= 0; j--) {
			const c = lines[j].trim();
			if (c.startsWith('#')) {
				description = c.replace(/^#\s*/, '');
				break;
			}
			if (c === '' || c.startsWith('"""')) continue;
			break;
		}
		cases.push({ name: m[1], description });
	}
	return cases;
}

function firstSentence(markdown) {
	const text = markdown
		.replace(/```[\s\S]*?```/g, '') // drop code fences
		.replace(/[#*`]/g, '')
		.trim();
	const match = text.match(/^[^.!?\n]+[.!?]/);
	return (match ? match[0] : text.split('\n')[0]).trim();
}

function jsStringLiteral(str) {
	// Template literal so multi-line Python/Markdown source stays readable
	// in the generated modules.ts, matching the existing entries' style.
	return '`' + str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
}

function buildQuestionEntry(questionDirName, index, allCleanedSolutions) {
	const dirPath = join(TRACK_PATH, questionDirName);
	const meta = JSON.parse(read(join(dirPath, 'meta.json')));
	const statement = read(join(dirPath, 'statement.md')).trim();
	const theory = read(join(dirPath, 'theory.md')).trim();
	const starter = read(join(dirPath, 'starter.py'));
	const rawSolution = read(join(dirPath, 'solution.py'));
	const rawTests = read(join(dirPath, 'tests.py'));

	const { code: cleanedSolution } = stripLoadWiring(rawSolution);
	const cleanedTests = buildCleanedTests(rawTests);
	const testCases = parseTestCases(cleanedTests);

	// Every earlier question's cleaned solution in this track, in order --
	// this question's own code is NOT included (that's the student's job).
	const priorSolutionsCode = allCleanedSolutions.slice(0, index).join('\n\n');

	const number = STARTING_NUMBER + index;
	const guideMarkdown = `${theory}\n\n## Your Task\n\n${statement}`;

	return {
		js: `	{
		id: ${JSON.stringify(meta.name)},
		slug: ${JSON.stringify(meta.name)},
		number: ${number},
		title: ${JSON.stringify(meta.title)},
		subtitle: ${JSON.stringify(TRACK_TITLE)},
		part: ${JSON.stringify(SECTION_ID)},
		partTitle: ${JSON.stringify(SECTION_TITLE)},
		difficulty: ${JSON.stringify(meta.difficulty)},
		estimatedTime: ${JSON.stringify(ESTIMATED_TIME_BY_DIFFICULTY[meta.difficulty] ?? '20 min')},
		// Theory's opening line, not statement's (statement usually opens
		// with "Implement:" followed by a code block -- not a summary).
		summary: ${JSON.stringify(firstSentence(theory) || meta.title)},
		guideMarkdown: ${jsStringLiteral(guideMarkdown)},
		starterCode: ${jsStringLiteral(starter)},
		solutionCode: ${jsStringLiteral(cleanedSolution)},
		testHarnessCode: ${jsStringLiteral(cleanedTests)},
		${priorSolutionsCode ? `priorSolutionsCode: ${jsStringLiteral(priorSolutionsCode)},\n\t\t` : ''}testCases: ${JSON.stringify(
			testCases,
			null,
			2
		)
			.split('\n')
			.join('\n\t\t')},
		hints: [] // TODO: not authored yet, optional field
	}`,
		cleanedSolution
	};
}

function main() {
	const questionDirs = listQuestionDirs(TRACK_PATH);
	const cleanedSolutions = [];
	const entries = [];

	questionDirs.forEach((dirName, index) => {
		const { js, cleanedSolution } = buildQuestionEntry(dirName, index, cleanedSolutions);
		cleanedSolutions.push(cleanedSolution);
		entries.push(js);
	});

	console.log(`// Generated from data/${SECTION_ID}/${TRACK_DIR_NAME} by`);
	console.log(`// scripts/generate-ide-modules-from-track.mjs -- review before pasting into`);
	console.log(`// modules.ts's MODULES array, right before the closing "];".`);
	console.log('');
	console.log(entries.join(',\n'));
}

main();
