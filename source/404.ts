async function notFound() {
	const templateURL = new URL('./templates/404.html', import.meta.url)
		.toString();
	const notFound = await fetch(templateURL);

	return new Response(notFound.body, { status: 404 });
}

export { notFound };
