import { createProject, deleteProject, getProjects } from '#functions/deploy';

import { notFound } from '#404';

async function requestHandlerHTTP(request: Request) {
	try {
		if (request.method.toUpperCase() === 'GET') {
			return getProjects();
		}

		if (request.method.toUpperCase() === 'POST') {
			const form = await request.json();
			return createProject(form.name);
		}

		if (request.method.toUpperCase() === 'DELETE') {
			const form = await request.json();
			return deleteProject(form.id);
		}

		throw new Error('Incorrect Method');
	} catch (error: unknown) {
		console.error((error as Error).message || (error as Error).toString());

		return notFound();
	}
}

export { requestHandlerHTTP };

export default {
	fetch: requestHandlerHTTP,
};
