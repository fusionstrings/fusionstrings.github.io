import { serveFile } from '@std/http';

import { notFound } from '#404';

import browserImportmap from '#browser-importmap' with { type: 'json' };

type BrowserAssets = keyof typeof browserImportmap['imports'];

/**
 * Asynchronous request handler function that processes incoming HTTP requests.
 *
 * @param request - The incoming HTTP request.
 * @returns A Promise that resolves to the HTTP response.
 *
 * @statechart
 * ```mermaid
 * stateDiagram-v2
 *     [*] --> AwaitingRequest
 *     AwaitingRequest --> CheckImportMap : RequestReceived
 *     CheckImportMap --> ServeFile : PathInImportMap & relativePath
 *     CheckImportMap --> FetchResource : PathInImportMap & absolutePath
 *     CheckImportMap --> DynamicImport : PathNotInImportMap
 *     ServeFile --> AwaitingRequest : FileServed
 *     FetchResource --> AwaitingRequest : ResourceFetched
 *     DynamicImport --> AwaitingRequest : ModuleImported
 *     AwaitingRequest --> Error : Error
 *     Error --> AwaitingRequest : ErrorHandled
 *
 *     style AwaitingRequest fill:#f9f,stroke:#333,stroke-width:2px
 *     style Error fill:#faa,stroke:#333,stroke-width:2px
 * ```
 *
 * @sequenceDiagram
 * ```mermaid
 * sequenceDiagram
 *     participant Client
 *     participant Server
 *
 *     Client->>Server: HTTP Request
 *     activate Server
 *     Server->>Server: Extract Pathname
 *     Server->>Server: Check Import Map
 *     alt Path found in Import Map
 *         alt Relative Path
 *             Server->>Server: serveFile
 *             Server-->>Client: File Response
 *         else Absolute Path
 *             Server->>Server: fetch
 *             Server-->>Client: Fetched Resource Response
 *         end
 *     else Path not found in Import Map
 *         Server->>Server: Dynamic Import
 *         Server->>Server: Execute Imported Handler
 *         Server-->>Client: Handler Response
 *     end
 *     alt Error
 *         Server->>Server: Log Error
 *         Server-->>Client: 404 Response
 *     end
 *     deactivate Server
 * ```
 */
async function requestHandler(request: Request): Promise<Response> {
	try {
		const { pathname } = new URL(request.url);

		const requestHandler = pathname.replace('/', '#');

		if (requestHandler in browserImportmap.imports) {
			const resourcePath =
				browserImportmap.imports[requestHandler as BrowserAssets];

			if (resourcePath.startsWith('./')) {
				return serveFile(request, resourcePath);
			}

			return fetch(resourcePath);
		}

		const { requestHandlerHTTP } = await import(requestHandler);
		return requestHandlerHTTP(request);
	} catch (error: unknown) {
		console.error((error as Error).message || (error as Error).toString());

		return notFound();
	}
}

export { requestHandler };

export default {
	fetch: requestHandler,
} satisfies Deno.ServeDefaultExport;
