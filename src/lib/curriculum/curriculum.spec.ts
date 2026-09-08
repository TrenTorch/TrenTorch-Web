import { describe, it, expect } from 'vitest';
import { MODULES, MODULE_PARTS } from './modules';

describe('TrenTorch Curriculum Definition', () => {
	it('should contain exactly 20 modules', () => {
		expect(MODULES).toHaveLength(20);
	});

	it('should have sequential module numbers from 1 to 20', () => {
		MODULES.forEach((mod, index) => {
			expect(mod.number).toBe(index + 1);
		});
	});

	it('should have 4 distinct curriculum parts', () => {
		expect(MODULE_PARTS).toHaveLength(4);
		const partIds = MODULE_PARTS.map((p) => p.id);
		expect(partIds).toEqual(['foundations', 'vision', 'nlp', 'systems']);
	});

	it('should provide starter code, solution code, and test harness for every module', () => {
		MODULES.forEach((mod) => {
			expect(mod.starterCode.length).toBeGreaterThan(20);
			expect(mod.solutionCode.length).toBeGreaterThan(20);
			expect(mod.testHarnessCode.length).toBeGreaterThan(20);
			expect(mod.testCases.length).toBeGreaterThan(0);
			expect(mod.guideMarkdown.length).toBeGreaterThan(50);
		});
	});

	it('should have valid IDs and slugs', () => {
		MODULES.forEach((mod) => {
			expect(mod.id).toMatch(/^\d{2}_[a-z_]+$/);
			expect(mod.slug).toMatch(/^\d{2}-[a-z-]+$/);
		});
	});
});
