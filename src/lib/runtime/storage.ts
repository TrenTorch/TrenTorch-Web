// LocalStorage persistence for student code, module progress, and completion status

const CODE_KEY_PREFIX = 'trentorch_code_';
const COMPLETED_KEY = 'trentorch_completed_modules';
const LAST_MODULE_KEY = 'trentorch_last_active_module';

export function saveUserCode(moduleId: string, code: string): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(`${CODE_KEY_PREFIX}${moduleId}`, code);
	} catch (e) {
		console.error('Failed to save code to localStorage', e);
	}
}

export function loadUserCode(moduleId: string, defaultCode: string): string {
	if (typeof window === 'undefined') return defaultCode;
	try {
		const saved = localStorage.getItem(`${CODE_KEY_PREFIX}${moduleId}`);
		return saved !== null ? saved : defaultCode;
	} catch (e) {
		console.error('Failed to load code from localStorage', e);
		return defaultCode;
	}
}

export function resetUserCode(moduleId: string): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.removeItem(`${CODE_KEY_PREFIX}${moduleId}`);
	} catch (e) {
		console.error('Failed to reset code in localStorage', e);
	}
}

export function getCompletedModules(): Set<string> {
	if (typeof window === 'undefined') return new Set();
	try {
		const raw = localStorage.getItem(COMPLETED_KEY);
		if (!raw) return new Set();
		const list: string[] = JSON.parse(raw);
		return new Set(list);
	} catch (e) {
		console.error('Failed to load completed modules', e);
		return new Set();
	}
}

export function markModuleCompleted(moduleId: string): void {
	if (typeof window === 'undefined') return;
	try {
		const completed = getCompletedModules();
		completed.add(moduleId);
		localStorage.setItem(COMPLETED_KEY, JSON.stringify(Array.from(completed)));
	} catch (e) {
		console.error('Failed to mark module completed', e);
	}
}

export function isModuleCompleted(moduleId: string): boolean {
	return getCompletedModules().has(moduleId);
}

export function saveLastActiveModule(moduleId: string): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(LAST_MODULE_KEY, moduleId);
	} catch (e) {
		console.error('Failed to save last active module', e);
	}
}

export function getLastActiveModule(defaultModuleId = '01_tensor'): string {
	if (typeof window === 'undefined') return defaultModuleId;
	try {
		const last = localStorage.getItem(LAST_MODULE_KEY);
		return last || defaultModuleId;
	} catch {
		return defaultModuleId;
	}
}
