// 1.) Get API access info ready
const accessToken = Deno.env.get('DEPLOY_ACCESS_TOKEN');
const organizationId = Deno.env.get('DEPLOY_ORG_ID');
const API = 'https://api.deno.com/v1';

console.log('accessToken: ', accessToken);
console.log('organizationId: ', organizationId);

const headers = {
	Authorization: `Bearer ${accessToken}`,
	'Content-Type': 'application/json',
};

function createProject({ name } = { name: null }) {
	return fetch(
		`${API}/organizations/${organizationId}/projects`,
		{
			method: 'POST',
			headers,
			body: JSON.stringify({
				name,
			}),
		},
	);
}

function getProjects() {
	return fetch(
		`${API}/organizations/${organizationId}/projects`,
		{
			headers,
		},
	);
}

function deleteProject(projectId: string) {
	return fetch(
		`${API}/projects/${projectId}`,
		{
			method: 'DELETE',
			headers,
		},
	);

	// const project = await response.json();
	// console.table(project);
	// return project;
}

async function createDeployment(project: { id: string; name: string }) {
	const response = await fetch(`${API}/projects/${project.id}/deployments`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			entryPointUrl: 'main.ts',
			assets: {
				'main.ts': {
					'kind': 'file',
					'content':
						`export default { async fetch(req) { return new Response("Hello, World!"); } }`,
					'encoding': 'utf-8',
				},
			},
			envVars: {},
		}),
	});

	const deployment = await response.json();
	console.table(deployment);

	console.log(deployment.status);
	console.log(
		'Visit your site here:',
		`https://${project.name}-${deployment.id}.deno.dev`,
	);
}

export { createProject, deleteProject, getProjects };
