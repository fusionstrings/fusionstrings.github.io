import { deployProject } from '#functions/deploy';

import { notFound } from '#404';

async function requestHandlerHTTP(request: Request) {
	try {
		switch (request.method.toUpperCase()) {
			case 'POST': {
				const formPost = await request.json();
				console.log(formPost)
				return deployProject(formPost.projectID);
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
