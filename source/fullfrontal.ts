import { getProjects } from '#functions/deploy';

async function requestHandlerHTTP() {
	try {
		const templateURL = new URL(
			'./templates/fullfrontal.html',
			import.meta.url,
		)
			.toString();

		return fetch(templateURL);
		// const html = await template.text()

		// const projects = await getProjects();

		// const projectsListingElement = document.querySelector("fusionstrings-fullfrontal-projects ul")

		// if (projects.length > 0 && projectsListingElement !== null) {
		//     projects.map((project) => {
		//         const li = document.createElement('li')
		//         li.innerHTML = `<p>${project.name}</p><p>${project.id}</p>`
		//         projectsListingElement.append(li)
		//     })
		// }
		// const response = document.toString();

		// return new Response(response, {
		//     headers: { "content-type": "text/html" },
		// });
	} catch (error) {
		console.error((error as Error).message || (error as Error).toString());

		return new Response('404', {
			headers: { 'content-type': 'text/html' },
		});
	}
}

export { requestHandlerHTTP };

export default {
	fetch: requestHandlerHTTP,
};
