// @ts-check
/** @jsx h */

import { h, renderSSR } from "nano-jsx";
import { contentType } from "https://deno.land/std@0.153.0/media_types/mod.ts";
import { extname } from "https://deno.land/std@0.153.0/path/mod.ts";

function Home() {
  return "Hi";
}

function NotFound() {
  return 404;
}

async function requestHandlerHome() {
  const templateURL = new URL("./public/index.html", import.meta.url);
  const templateFileResponse = await fetch(templateURL);

  const response = templateFileResponse.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(
      new TransformStream({
        transform: (chunk, controller) => {
          const PLACEHOLDER = "<!-- __CONTENT__ -->";

          if (chunk.includes(PLACEHOLDER)) {
            const content = renderSSR(<Home />);
            controller.enqueue(chunk.replace(PLACEHOLDER, content));
          } else {
            controller.enqueue(chunk);
          }
        },
      }),
    )
    .pipeThrough(new TextEncoderStream());

  return new Response(response, {
    status: templateFileResponse.status,
    headers: templateFileResponse.headers,
  });
}

/**
 * @param {Request} request
 * @returns Response
 */
async function requestHandlerStaticResource(request) {
  try {
    const { pathname } = new URL(request.url);
    const resourcePath = `./public${pathname}`;
    const resourceURL = new URL(resourcePath, import.meta.url);
    const response =  await fetch(resourceURL.href);
    //const response = await Deno.readFile(`./public${pathname}`);

    return new Response(response.body, {
      headers: { ...response.headers, "content-type": contentType(extname(pathname)) },
    });
  } catch (error) {
    return new Response(error.message || error.toString(), { status: 500 });
  }
}

/**
 * @type {{[key: string]: (request: Request) => Promise<Response> | Response}}
 */
const register = {
  "/": requestHandlerHome,
  "/css/default.css": requestHandlerStaticResource,
  "/css/style.css": requestHandlerStaticResource,
  "/css/min-width-900px.css": requestHandlerStaticResource,
  "/favicon.ico": requestHandlerStaticResource,
  "/favicon-16x16.png": requestHandlerStaticResource,
  "/favicon-32x32.png": requestHandlerStaticResource,
  "/images/fusionstrings-logo-alt-optimized.svg": requestHandlerStaticResource,
  "/images/iceberg-transparent-optimized.svg": requestHandlerStaticResource,
  "/site.webmanifest": requestHandlerStaticResource,
};

/**
 * @param {Request} request
 * @returns Response
 */
function requestHandler(request) {
  const { pathname } = new URL(request.url);

  if (pathname in register) {
    return register[pathname](request);
  }

  return new Response(renderSSR(<NotFound />), { status: 404 });
}

export { requestHandler };
