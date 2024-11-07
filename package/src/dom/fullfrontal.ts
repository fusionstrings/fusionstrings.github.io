async function handleCreateProject(event: SubmitEvent) {
	event.preventDefault();

	const currentTarget = event.currentTarget as HTMLFormElement;

	const formData = new FormData(currentTarget);
	const data = Object.fromEntries(formData.entries());

	console.log(data);

	const { action, method } = currentTarget;
	console.log(action);

	const response = await fetch(action, {
		method,
		body: JSON.stringify(data),
	});

	const responseData = await response.json();
	console.log(responseData);

	if (!response.ok) {
		currentTarget.insertAdjacentHTML(
			'beforebegin',
			`<p class="error">${responseData.message}</p>`,
		);
		throw new Error(responseData.message);
	}
	// document.querySelectorAll("fullfrontal-contact-form, fullfrontal-contact-form-submit").forEach(element => {
	// 	element.classList.toggle('hide');
	// });
}

function handleDeleteteProject(event: MouseEvent) {
	event.preventDefault();

	const { value } = event.currentTarget as HTMLButtonElement;

	console.log(value);

	return fetch('/functions/fullfrontal/projects', {
		method: 'DELETE',
		body: JSON.stringify({ id: value }),
	});
}

async function handleDeployProject(event: MouseEvent) {
	event.preventDefault();

	const { value: projectID } = event.currentTarget as HTMLButtonElement;

	const response = await fetch(
		`/functions/fullfrontal/projects/deployments`,
		{
			method: 'POST',
			body: JSON.stringify({ projectID }),
		},
	);

	const deployment = await response.json();
	console.table(deployment);

	console.log(deployment.status);
	console.log(
		'Visit your site here:',
		`https://${'project.name'}-${deployment.id}.deno.dev`,
	);
}

async function main() {
	const createFullfrontalProjectForm = document.getElementById(
		'create-fullfrontal-project',
	);

	if (createFullfrontalProjectForm) {
		createFullfrontalProjectForm.onsubmit = handleCreateProject;
	}

	const url = new URL('/functions/fullfrontal/projects', import.meta.url)
		.toString();

	const { default: projects } = await import(url, {
		with: { type: 'json' },
	});

	const projectsListingElement = document.querySelector(
		'fusionstrings-fullfrontal-projects ul',
	);

	if (projects.length > 0 && projectsListingElement !== null) {
		projects.map((project: { name: string; id: string }) => {
			const li = document.createElement('li');
			li.innerHTML =
				`<div><p class="project-name">${project.name}</p><p class="project-id">${project.id}</p></div><div><button value="${project.id}" name="delete-project">delete</button> <button value="${project.id}" name="deploy-project">deploy</button></div>`;
			projectsListingElement.append(li);

			const projectDeleteButton = li.querySelector(
				`[value="delete-project"]`,
			) as HTMLButtonElement;

			if (projectDeleteButton) {
				projectDeleteButton.onclick = handleDeleteteProject;
			}

			const projectDeployButton = li.querySelector(
				`[name="deploy-project"]`,
			) as HTMLButtonElement;

			if (projectDeployButton) {
				projectDeployButton.onclick = handleDeployProject;
			}
		});
	}
}

export { main };
