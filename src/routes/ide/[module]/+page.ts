import { error } from '@sveltejs/kit';
import { MODULES } from '$lib/curriculum/modules';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const moduleId = params.module;
	const mod = MODULES.find(
		(m) => m.id === moduleId || m.slug === moduleId || m.number.toString() === moduleId
	);

	if (!mod) {
		throw error(404, `Module '${moduleId}' not found in TrenTorch curriculum`);
	}

	return {
		module: mod
	};
};
