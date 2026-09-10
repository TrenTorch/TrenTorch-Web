// Web Worker for Pyodide execution in TrenTorch-Web
/* eslint-disable @typescript-eslint/no-explicit-any */

let pyodide: any = null;
let initPromise: Promise<any> | null = null;

async function initializePyodide(): Promise<any> {
	if (pyodide) return pyodide;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		self.postMessage({ type: 'status', status: 'loading_runtime' });

		// Import Pyodide as ESM module (works natively in browser/Vite module workers)
		const pyodideUrl = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs';
		const pyodideModule: any = await new Function('url', 'return import(url)')(pyodideUrl);
		const loadPyodide = pyodideModule.loadPyodide;

		pyodide = await loadPyodide({
			indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/'
		});

		self.postMessage({ type: 'status', status: 'loading_packages' });
		// Pre-load numpy for TrenTorch
		await pyodide.loadPackage(['numpy']);

		// pytest itself and its dependencies (pluggy, iniconfig, packaging)
		// are pure Python, so a real pytest install works fine under
		// Pyodide via micropip -- verified directly: installs cleanly and
		// pytest.main() reports real per-test pass/fail with real
		// tracebacks. New (atomized) testHarnessCode is a plain pytest
		// file; the original 20 modules' run_tests()-function harnesses
		// still work too (see isLegacyHarness below) -- this is additive.
		await pyodide.loadPackage(['micropip']);
		const micropip = pyodide.pyimport('micropip');
		await micropip.install('pytest');

		// Setup standard capture harness in python
		await pyodide.runPythonAsync(`
import sys
import io
import traceback
import json
import base64
import numpy as np
import pytest

class OutputCapture:
    def __init__(self):
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
        self._old_stdout = None
        self._old_stderr = None

    def __enter__(self):
        self._old_stdout = sys.stdout
        self._old_stderr = sys.stderr
        sys.stdout = self.stdout
        sys.stderr = self.stderr
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.stdout = self._old_stdout
        sys.stderr = self._old_stderr

    def get_stdout(self):
        return self.stdout.getvalue()

    def get_stderr(self):
        return self.stderr.getvalue()


class _PytestResultCollector:
    """Collects per-test pass/fail into the same {name, passed, error}
    shape the app already expects, instead of pytest's own CLI report."""
    def __init__(self):
        self.results = []

    def pytest_runtest_logreport(self, report):
        if report.when == 'call':
            self.results.append({
                "name": report.nodeid,
                "passed": bool(report.passed),
                "error": str(report.longrepr) if report.failed else None,
            })
`);

		self.postMessage({ type: 'status', status: 'ready' });
		return pyodide;
	})();

	return initPromise;
}

function toBase64(str: string): string {
	try {
		return btoa(unescape(encodeURIComponent(str)));
	} catch {
		return Buffer.from(str, 'utf-8').toString('base64');
	}
}

self.onmessage = async (e: MessageEvent) => {
	// Origin verification — only trust messages from the same origin as this worker.
	// `'null'` covers blob: and data: URLs that some bundlers use in development.
	const trustedOrigins = new Set([self.location.origin, 'null']);
	const messageOrigin = typeof e.origin === 'string' ? e.origin : '';
	if (messageOrigin && !trustedOrigins.has(messageOrigin)) {
		self.postMessage({ type: 'error', error: `Untrusted message origin: ${messageOrigin}` });
		return;
	}

	const { id, action, code, testHarnessCode, priorSolutionsCode, moduleId } = e.data;

	try {
		const py = await initializePyodide();

		if (action === 'init') {
			self.postMessage({ id, type: 'init_complete', success: true });
			return;
		}

		if (action === 'run') {
			self.postMessage({ type: 'status', status: 'running' });
			const startTime = performance.now();
			const codeB64 = toBase64(code || '');

			// Prepare Python runner script with base64 decode and output capture
			const pythonScript = `
def __run_user_code():
    with OutputCapture() as cap:
        exec_globals = {"__name__": "__main__"}
        try:
            raw_code = base64.b64decode("${codeB64}").decode("utf-8")
            exec(raw_code, exec_globals)
            err = None
        except Exception as e:
            err = traceback.format_exc()
        return {
            "stdout": cap.get_stdout(),
            "stderr": cap.get_stderr(),
            "error": err
        }

json.dumps(__run_user_code())
`;
			const rawResult = await py.runPythonAsync(pythonScript);
			const parsed = JSON.parse(rawResult);
			const durationMs = Math.round(performance.now() - startTime);

			self.postMessage({
				id,
				type: 'run_result',
				success: !parsed.error,
				output: parsed.stdout + (parsed.stderr ? '\n[STDERR]\n' + parsed.stderr : ''),
				error: parsed.error,
				durationMs
			});
			self.postMessage({ type: 'status', status: 'ready' });
			return;
		}

		if (action === 'test') {
			self.postMessage({ type: 'status', status: 'testing' });
			const startTime = performance.now();
			// Prior questions in the same track (real oracle solutions,
			// already cleaned of dev-only cross-question loading) go
			// ahead of the student's own current-question code, so
			// solution.py ends up with everything this question's tests
			// might need to import -- same idea as a real student session
			// that already solved the earlier questions. Undefined/empty
			// for the legacy 20 modules and for a track's first question.
			const solutionSource = (priorSolutionsCode ? priorSolutionsCode + '\n\n' : '') + (code || '');
			const solutionB64 = toBase64(solutionSource);
			const testB64 = toBase64(testHarnessCode || '');

			// The original 20 modules' testHarnessCode predates this change
			// and defines its own run_tests() returning a plain list --
			// no `def test_*():` functions, so pytest would collect zero
			// tests from them and silently report every one as failing.
			// Detecting the old convention by content (rather than
			// touching all 20 modules' harness strings) keeps this
			// backward compatible: legacy modules keep working exactly
			// as before, new atomized questions run through real pytest.
			const isLegacyHarness = /^def run_tests\(/m.test(testHarnessCode || '');

			const testRunnerScript = isLegacyHarness
				? `
def __run_module_tests():
    with OutputCapture() as cap:
        exec_globals = {"__name__": "__main__"}
        results = []
        raw_error = None
        try:
            raw_code = base64.b64decode("${solutionB64}").decode("utf-8")
            exec(raw_code, exec_globals)

            raw_test = base64.b64decode("${testB64}").decode("utf-8")
            exec(raw_test, exec_globals)

            if "run_tests" in exec_globals and callable(exec_globals["run_tests"]):
                results = exec_globals["run_tests"]()
            else:
                raw_error = "Test harness does not contain a run_tests() function."
        except Exception as e:
            raw_error = traceback.format_exc()

        return {
            "stdout": cap.get_stdout(),
            "stderr": cap.get_stderr(),
            "error": raw_error,
            "results": results
        }

json.dumps(__run_module_tests())
`
				: `
def __run_module_tests():
    with OutputCapture() as cap:
        results = []
        raw_error = None
        try:
            # Fresh files every run, and drop any cached import of a
            # previous run's "solution"/"tests" modules -- Python's
            # import cache would otherwise silently keep serving a
            # prior question's (or a prior attempt's) stale code.
            sys.modules.pop("solution", None)
            sys.modules.pop("tests", None)

            with open("solution.py", "w") as f:
                f.write(base64.b64decode("${solutionB64}").decode("utf-8"))
            with open("tests.py", "w") as f:
                f.write(base64.b64decode("${testB64}").decode("utf-8"))

            collector = _PytestResultCollector()
            pytest.main(["tests.py", "-q"], plugins=[collector])
            results = collector.results
        except Exception as e:
            raw_error = traceback.format_exc()

        return {
            "stdout": cap.get_stdout(),
            "stderr": cap.get_stderr(),
            "error": raw_error,
            "results": results
        }

json.dumps(__run_module_tests())
`;

			const rawResult = await py.runPythonAsync(testRunnerScript);
			const parsed = JSON.parse(rawResult);
			const durationMs = Math.round(performance.now() - startTime);

			const testResults = (parsed.results || []).map((t: any) => ({
				name: t.name,
				passed: Boolean(t.passed),
				durationMs: t.durationMs || 1,
				error: t.error || undefined
			}));

			const passedCount = testResults.filter((t: any) => t.passed).length;
			const totalCount = testResults.length;
			const allPassed = !parsed.error && totalCount > 0 && passedCount === totalCount;

			self.postMessage({
				id,
				type: 'test_result',
				moduleId,
				allPassed,
				totalTests: totalCount,
				passedTests: passedCount,
				failedTests: totalCount - passedCount,
				totalDurationMs: durationMs,
				results: testResults,
				rawOutput: parsed.stdout + (parsed.stderr ? '\n' + parsed.stderr : ''),
				error: parsed.error
			});
			self.postMessage({ type: 'status', status: 'ready' });
			return;
		}
	} catch (err: any) {
		self.postMessage({
			id,
			type: 'error',
			error: err?.message || String(err)
		});
		self.postMessage({ type: 'status', status: 'ready' });
	}
};

export {};
