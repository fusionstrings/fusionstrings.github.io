/**
 * @param {Request} request
 * @returns Response
 */
function requestHandlerHTTP() {
  const templateURL = new URL('./index.html', import.meta.url).toString();
  return fetch(templateURL);
}

export { requestHandlerHTTP };
