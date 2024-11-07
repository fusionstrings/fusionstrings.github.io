import { createProject, deleteProject, getProjects } from '#functions/deploy';

import { notFound } from '#404';

async function requestHandlerHTTP(request: Request) {
	try {
		switch (request.method.toUpperCase()) {
			case 'GET':
				return getProjects();

			case 'POST': {
				const formPost = await request.json();
				return createProject(formPost);
			}
			case 'DELETE': {
				const formDelete = await request.json();
				return deleteProject(formDelete.id);
			}
			default:
				throw new Error('Incorrect Method');
		}
	} catch (error: unknown) {
		console.error((error as Error).message || (error as Error).toString());

		return notFound();
	}
}

export { requestHandlerHTTP };

export default {
	fetch: requestHandlerHTTP,
};
