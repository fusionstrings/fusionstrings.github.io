import { serveDir } from "http/file_server";

async function requestHandler(request) {
  try {
    const { pathname } = new URL(request.url);

    if (pathname === '/' || pathname === '/site.webmanifest' || pathname.startsWith("/js") || pathname.startsWith("/styles") || pathname.startsWith("/css") || pathname.startsWith("/images") || pathname.startsWith("/docs") || pathname.startsWith("/favicon.ico")) {
      return serveDir(request, {
        fsRoot: "public",
      });
    }

    const pathnameHandlerID = pathname.replace('/', '#');
    const pathnameHandler = pathnameHandlerID === '#' ? "#home" : pathnameHandlerID;

    const { requestHandlerHTTP } = await import(pathnameHandler);
    return requestHandlerHTTP(request);
  } catch (error) {
    console.error(error.message || error.toString());
    const templateURL = new URL('./404.html', import.meta.url).toString();

    const notFound = await fetch(templateURL);
    const body = await notFound.text();
    return new Response(body, {
      headers: { "content-type": "text/html" }, status: 404
    });
  }
}

if (import.meta.main) {
  const timestamp = Date.now();
  const humanReadableDateTime = new Intl.DateTimeFormat("default", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(timestamp);

  console.log("Current Date: ", humanReadableDateTime);
  console.info(`Server Listening on http://localhost:8000`);

  Deno.serve(requestHandler);
}

export { requestHandler }
