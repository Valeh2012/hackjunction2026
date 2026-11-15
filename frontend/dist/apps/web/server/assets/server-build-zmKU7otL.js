import { a as logger, i as rateLimitHeaders, n as clientIdentifier, r as consumeRateLimit } from "./rate-limit.server-Fj3JAPgs.js";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, data, isRouteErrorResponse } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Eraser, LoaderCircle, TriangleAlert } from "lucide-react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/entry.server.tsx
var entry_server_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function appendComponentStack(error, errorInfo) {
	const componentStack = errorInfo?.componentStack;
	if (!(error instanceof Error) || !componentStack || error.stack?.includes(componentStack)) return;
	const separator = componentStack.startsWith("\n") ? "" : "\n";
	try {
		error.stack = `${error.stack ?? `${error.name}: ${error.message}`}${separator}${componentStack}`;
	} catch {}
}
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const userAgent = request.headers.get("user-agent");
		const readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error, errorInfo) {
				appendComponentStack(error, errorInfo);
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region src/index.css?url
var src_default = "/assets/index-OFwimHIi.css";
//#endregion
//#region src/lib/site-origin.server.ts
var LOCAL_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"0.0.0.0",
	"[::1]"
]);
/**
* The public origin of this site, e.g. `https://example.com`. Use it for
* absolute URLs that leave the app — sitemap `<loc>`, canonical links, `og:url`.
*
* The scheme comes from the hostname because the request cannot report it: TLS
* terminates at the proxy, so `request.url` and `X-Forwarded-Proto` both say
* `http` even for a visitor who arrived over HTTPS. Trusting either publishes
* `http://` URLs that only redirect, which search engines index as a second,
* duplicate site. Every host this app is reachable on serves HTTPS except a
* local `npm run start`, which is where the `curl` checks in the SEO skill run.
*
* `Host` carries the public domain, and only the origin is read, so the `.data`
* suffix React Router adds to `request.url` on client navigations does not
* matter.
*/
var siteOrigin = (request) => {
	const { host, hostname } = new URL(request.url);
	return `${LOCAL_HOSTNAMES.has(hostname) ? "http" : "https"}://${host}`;
};
function HorizonsPreviewScripts() {
	useEffect(() => {
		window.__horizonsHydrated = true;
		window.dispatchEvent(new Event("horizons:hydrated"));
		import("./_virtual_horizons-runtime-DfRWcvOR.js");
	}, []);
	return null;
}
//#endregion
//#region src/components/site-footer.tsx
function SiteFooter() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "site-footer",
		children: [/* @__PURE__ */ jsx("span", { children: "Propaganda Technique Highlighter" }), /* @__PURE__ */ jsx("span", { children: "Built for a more thoughtful reading." })]
	});
}
//#endregion
//#region src/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	headers: () => headers,
	links: () => links,
	loader: () => loader$7
});
var links = () => [
	{
		rel: "stylesheet",
		href: src_default,
		precedence: "default"
	},
	{
		rel: "icon",
		href: "/favicon.png",
		type: "image/png"
	},
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;450;500;550;600;650;700&family=Source+Serif+4:ital,wght@1,400&display=swap"
	}
];
/**
* Publishes the site's public origin, which `seo()` reads to build canonical and
* `og:url` tags, and advertises the sitemap to crawlers that read response
* headers rather than HTML.
*
* A `meta` export can only reach server data through `matches`, and the `headers`
* export cannot see loader data at all, so both have to travel this way.
*/
function loader$7({ request }) {
	const origin = siteOrigin(request);
	return data({ origin }, { headers: { Link: `<${origin}/sitemap.xml>; rel="sitemap"; type="application/xml"` } });
}
/**
* A page route that exports `headers` replaces this one, so merge `parentHeaders`
* there rather than returning only that route's own headers.
*/
function headers({ loaderHeaders }) {
	return loaderHeaders;
}
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {}),
			/* @__PURE__ */ jsx(HorizonsPreviewScripts, {})
		] }), /* @__PURE__ */ jsxs("body", {
			suppressHydrationWarning: true,
			children: [
				/* @__PURE__ */ jsx("div", {
					id: "root",
					children
				}),
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("a", {
			className: "skip-link",
			href: "#main-content",
			children: "Skip to text analysis"
		}),
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsx(SiteFooter, {})
	] });
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	isRouteErrorResponse(error) && error.status;
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", { children: [/* @__PURE__ */ jsx("h1", { children: message }), /* @__PURE__ */ jsx("p", { children: details })] });
});
//#endregion
//#region src/lib/seo.ts
var ROOT_ROUTE_ID = "root";
/** The site's public origin, as published by the root loader. */
var siteOriginFrom = (matches) => {
	return (matches.find((match) => match?.id === ROOT_ROUTE_ID)?.loaderData)?.origin ?? "";
};
var absoluteUrl = (origin, target) => {
	if (/^https?:\/\//.test(target)) return target;
	return `${origin}${target.startsWith("/") ? target : `/${target}`}`;
};
function seo({ matches, location }, input) {
	const origin = siteOriginFrom(matches);
	const canonical = absoluteUrl(origin, input.path ?? location.pathname);
	const imageUrl = input.image ? absoluteUrl(origin, input.image) : "";
	const tags = [
		{ title: input.title },
		{
			name: "description",
			content: input.description
		},
		{
			property: "og:title",
			content: input.title
		},
		{
			property: "og:description",
			content: input.description
		},
		{
			property: "og:type",
			content: input.type ?? "website"
		},
		{
			name: "twitter:card",
			content: imageUrl ? "summary_large_image" : "summary"
		},
		{
			name: "twitter:title",
			content: input.title
		},
		{
			name: "twitter:description",
			content: input.description
		}
	];
	if (origin) tags.push({
		tagName: "link",
		rel: "canonical",
		href: canonical
	}, {
		property: "og:url",
		content: canonical
	});
	if (imageUrl) tags.push({
		property: "og:image",
		content: imageUrl
	}, {
		name: "twitter:image",
		content: imageUrl
	});
	if (input.noindex) tags.push({
		name: "robots",
		content: "noindex"
	});
	for (const block of [input.jsonLd ?? []].flat()) tags.push({ "script:ld+json": block });
	return tags;
}
/**
* Applied to API responses only. Page responses must stay untouched, because
* framing and CSP headers break embedding the site in a preview iframe.
* Transport security (HSTS) belongs to the proxy in front of this server.
*
* `Cache-Control: no-store` is defence in depth, not a guarantee: the platform
* edge cache rewrites this header on published domains and caches `/api/*` GET
* responses by URL for all visitors. Per-user or authenticated endpoints must
* therefore be actions (POST) — never GET. Handlers returning public,
* cache-friendly data may override by setting their own Cache-Control
* (existing headers are never overwritten here).
*/
var SECURITY_HEADERS = {
	"Cache-Control": "no-store",
	"Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
	"Cross-Origin-Resource-Policy": "same-origin",
	"Referrer-Policy": "no-referrer",
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-Permitted-Cross-Domain-Policies": "none"
};
var withExtraHeaders = (response, extra) => {
	const headers = new Headers(response.headers);
	for (const [name, value] of Object.entries(extra)) if (!headers.has(name)) headers.set(name, value);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};
/** JSON response carrying the API security headers. */
var json = (value, init = {}) => withExtraHeaders(Response.json(value, init), SECURITY_HEADERS);
/** Client-error response — use for input validation, never for server failures. */
var apiError = (status, message) => json({ error: message }, { status });
var serverError = (error) => {
	const isProduction = process.env.NODE_ENV === "production";
	const cause = error instanceof Error ? error : new Error(String(error));
	return json({
		message: "Something went wrong!",
		...!isProduction && { error: {
			name: cause.name,
			message: cause.message,
			stack: cause.stack
		} }
	}, { status: 500 });
};
var runHandler = async (handler, args) => {
	const verdict = await consumeRateLimit(clientIdentifier(args.request));
	if (verdict.isLimited) return withExtraHeaders(apiError(429, "Too many requests, please try again later"), rateLimitHeaders(verdict));
	const extraHeaders = rateLimitHeaders(verdict);
	try {
		const result = await handler(args);
		return withExtraHeaders(result instanceof Response ? withExtraHeaders(result, SECURITY_HEADERS) : json(result ?? null), extraHeaders);
	} catch (error) {
		if (error instanceof Response) return withExtraHeaders(error, extraHeaders);
		logger.error(error instanceof Error ? error.message : error, error instanceof Error ? error.stack : void 0);
		return withExtraHeaders(serverError(error), extraHeaders);
	}
};
/**
* Wraps a resource route `loader` / `action`. Rate limits the caller, adds
* security headers, logs the request, and turns any thrown error into the shared
* 500 shape — so handlers can `throw new Error(...)` instead of building error
* responses.
*/
var withApi = (handler) => {
	return async (args) => {
		const startedAt = Date.now();
		const response = await runHandler(handler, args);
		const { pathname } = new URL(args.request.url);
		logger.info(`${args.request.method} ${pathname} ${response.status} ${Date.now() - startedAt}ms`);
		return response;
	};
};
/**
* Reads the body while enforcing `BODY_LIMIT_BYTES`.
*
* `content-length` alone is not a limit: it is absent on chunked/streamed
* requests, so a client can omit it and send unbounded data. Counting bytes as
* they arrive and aborting mid-stream is what actually caps memory, so both
* readers below go through here.
*/
var readBodyWithinLimit = async (request) => {
	const declaredLength = Number(request.headers.get("content-length"));
	if (Number.isFinite(declaredLength) && declaredLength > 20971520) throw apiError(413, "Request body too large");
	if (!request.body) return Buffer.alloc(0);
	const reader = request.body.getReader();
	const chunks = [];
	let receivedBytes = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			if (!value) continue;
			receivedBytes += value.byteLength;
			if (receivedBytes > 20971520) {
				await reader.cancel();
				throw apiError(413, "Request body too large");
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	return Buffer.concat(chunks);
};
/** `request.json()` with a 20MB cap — nothing else limits how much a client can send. */
var readJsonBody = async (request) => {
	const body = (await readBodyWithinLimit(request)).toString("utf8");
	try {
		return JSON.parse(body);
	} catch {
		throw apiError(400, "Invalid JSON body");
	}
};
//#endregion
//#region src/lib/analyze-backend.server.ts
var BACKEND_API_URL = "https://api.propagandadetector.tech";
var BACKEND_TIMEOUT_MS = 25e3;
var TECHNIQUES_TIMEOUT_MS = 5e3;
/**
* The backend counts Unicode code points; the reader slices with UTF-16 indices.
* Entry `i` is the UTF-16 index of code point `i`, with one extra entry for the end of the text.
*/
function utf16Offsets(text) {
	const offsets = [];
	let index = 0;
	for (const character of text) {
		offsets.push(index);
		index += character.length;
	}
	offsets.push(index);
	return offsets;
}
/** FastAPI reports rejected input as `{ detail: [{ msg }] }`. */
function validationMessage(body) {
	const detail = body && typeof body === "object" && "detail" in body ? body.detail : void 0;
	const first = Array.isArray(detail) ? detail[0] : void 0;
	if (first && typeof first === "object" && "msg" in first && typeof first.msg === "string") return `The text could not be analyzed: ${first.msg}.`;
	return "The text could not be analyzed. Please check your input and try again.";
}
function toSpans(text, body) {
	if (!body || typeof body !== "object" || !("text" in body) || !("spans" in body) || !Array.isArray(body.spans)) throw new Error("Analysis backend returned an unexpected response");
	if (body.text !== text) throw new Error("Analysis backend analyzed a different text than the one submitted");
	const offsets = utf16Offsets(text);
	const mapped = body.spans.map((span) => {
		if (!span || typeof span !== "object" || !("start" in span) || !("end" in span) || !("technique_id" in span) || !("technique" in span)) throw new Error("Analysis backend returned a malformed span");
		const { start, end, technique_id: techniqueId, technique: techniqueName } = span;
		if (typeof start !== "number" || typeof end !== "number" || !Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end >= offsets.length) throw new Error("Analysis backend returned a span outside the submitted text");
		if (typeof techniqueId !== "string" || !techniqueId || typeof techniqueName !== "string" || !techniqueName) throw new Error("Analysis backend returned a span without a technique");
		return {
			start: offsets[start],
			end: offsets[end],
			techniqueId,
			techniqueName
		};
	});
	mapped.sort((a, b) => a.start - b.start || a.end - b.end);
	const spans = [];
	let previousEnd = 0;
	for (const span of mapped) {
		if (span.start < previousEnd) continue;
		spans.push(span);
		previousEnd = span.end;
	}
	if (spans.length < mapped.length) logger.warn(`Analysis backend returned ${mapped.length - spans.length} overlapping span(s); only the first of each overlap is shown`);
	return spans;
}
/**
* Sends the text to the backend's `POST /api/analyze` as JSON and returns its
* spans in the shape the reader expects.
*/
async function analyzeWithBackend(text) {
	const url = new URL("/api/analyze", BACKEND_API_URL);
	let response;
	try {
		response = await fetch(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ text }),
			signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS)
		});
	} catch (cause) {
		throw new Error(`Analysis backend is unreachable at ${url.origin}`, { cause });
	}
	const body = await response.json().catch(() => null);
	if (response.status === 422) throw apiError(422, validationMessage(body));
	if (!response.ok) throw new Error(`Analysis backend responded with status ${response.status}`);
	return {
		text,
		spans: toSpans(text, body),
		method: "pattern-based",
		language: "en"
	};
}
/**
* Sends the text to the backend's `POST /api/analyze/stream` and returns
* the streaming response as SSE.
*/
async function analyzeWithBackendStream(text) {
	const url = new URL("/api/analyze/stream", BACKEND_API_URL);
	let response;
	try {
		response = await fetch(url, {
			method: "POST",
			headers: {
				Accept: "text/event-stream",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ text }),
			signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS)
		});
	} catch (cause) {
		throw new Error(`Analysis backend is unreachable at ${url.origin}`, { cause });
	}
	if (response.status === 422) throw apiError(422, validationMessage(await response.json().catch(() => null)));
	if (!response.ok) throw new Error(`Analysis backend responded with status ${response.status}`);
	return new Response(response.body, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	} });
}
function isTechnique(value) {
	return !!value && typeof value === "object" && "id" in value && typeof value.id === "string" && "name" in value && typeof value.name === "string" && "description" in value && typeof value.description === "string";
}
/** Reads the technique classes from the backend's `GET /api/techniques`; this app keeps no list of its own. */
async function loadTechniques() {
	const url = new URL("/api/techniques", BACKEND_API_URL);
	let response;
	try {
		response = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(TECHNIQUES_TIMEOUT_MS)
		});
	} catch (cause) {
		throw new Error(`Analysis backend is unreachable at ${url.origin}`, { cause });
	}
	if (!response.ok) throw new Error(`Analysis backend responded with status ${response.status} for the technique list`);
	const body = await response.json().catch(() => null);
	if (!Array.isArray(body) || !body.every(isTechnique)) throw new Error("Analysis backend returned an unexpected technique list");
	return body.map(({ id, name, description }) => ({
		id,
		name,
		description
	}));
}
//#endregion
//#region src/components/home/introduction.tsx
function Introduction() {
	return /* @__PURE__ */ jsxs("header", {
		className: "introduction",
		children: [/* @__PURE__ */ jsxs("h1", { children: ["Propaganda Technique Highlighter", /* @__PURE__ */ jsx("span", {
			className: "title-period",
			children: "."
		})] }), /* @__PURE__ */ jsx("p", { className: "subtitle" })]
	});
}
//#endregion
//#region src/data/techniques.ts
var CHARACTER_LIMIT = 1e4;
//#endregion
//#region src/components/home/text-editor.tsx
function TextEditor({ text, running, error, onTextChange, onDetect, onClear }) {
	const exceeded = text.length > CHARACTER_LIMIT;
	const count = new Intl.NumberFormat("en-US").format(text.length);
	return /* @__PURE__ */ jsx("section", {
		className: "editor-section",
		"aria-labelledby": "editor-title",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: (event) => {
				event.preventDefault();
				onDetect();
			},
			children: [
				/* @__PURE__ */ jsx("label", {
					id: "editor-title",
					htmlFor: "source-text",
					className: "sr-only",
					children: "Your text"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: `textarea-frame${exceeded ? " invalid" : ""}`,
					children: [/* @__PURE__ */ jsx("textarea", {
						id: "source-text",
						name: "text",
						placeholder: "Paste an article or paragraph here…",
						value: text,
						readOnly: running,
						onChange: (event) => onTextChange(event.target.value),
						"aria-invalid": exceeded,
						"aria-describedby": `character-count text-privacy${exceeded ? " limit-warning" : ""}`,
						spellCheck: false
					}), running && /* @__PURE__ */ jsx("div", {
						className: "textarea-overlay",
						children: /* @__PURE__ */ jsx(LoaderCircle, {
							size: 32,
							className: "spinner-large"
						})
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "editor-meta",
					children: /* @__PURE__ */ jsxs("span", {
						id: "character-count",
						className: exceeded ? "counter exceeded" : "counter",
						children: [count, /* @__PURE__ */ jsx("span", { children: " / 10,000 characters" })]
					})
				}),
				exceeded && /* @__PURE__ */ jsxs("p", {
					id: "limit-warning",
					role: "alert",
					className: "error-message",
					children: [
						/* @__PURE__ */ jsx(TriangleAlert, { size: 16 }),
						" The limit is 10,000 characters. Remove ",
						new Intl.NumberFormat("en-US").format(text.length - 1e4),
						" characters to continue."
					]
				}),
				error && /* @__PURE__ */ jsxs("p", {
					role: "alert",
					className: "error-message",
					children: [/* @__PURE__ */ jsx(TriangleAlert, { size: 16 }), error]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "editor-actions",
					children: [/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "detect-button",
						disabled: !text.trim() || exceeded || running,
						children: running ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(LoaderCircle, {
							size: 17,
							className: "spinner"
						}) }) : /* @__PURE__ */ jsxs(Fragment, { children: ["Detect ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })] })
					}), /* @__PURE__ */ jsx("button", {
						className: "clear-link",
						type: "button",
						onClick: onClear,
						children: "Clear"
					})]
				}),
				/* @__PURE__ */ jsx("span", {
					className: "sr-only",
					role: "status",
					children: running ? "Analyzing…" : ""
				}),
				/* @__PURE__ */ jsx("p", {
					id: "text-privacy",
					className: "privacy-note",
					children: "Text is sent for analysis and not stored."
				})
			]
		})
	});
}
//#endregion
//#region src/components/home/analysis-results.tsx
/** Each span carries its technique's name; `techniques` only adds the descriptions and may be missing. */
function AnalysisResults({ result, techniques, onClear }) {
	const count = result.spans.length;
	const classifiedCount = result.spans.filter((s) => s.techniqueId !== "pending").length;
	const [animatedUpTo, setAnimatedUpTo] = useState(0);
	const spanRefs = useRef(/* @__PURE__ */ new Map());
	const animatedRef = useRef(0);
	useEffect(() => {
		const newlyClassified = classifiedCount - animatedRef.current;
		if (newlyClassified <= 0) return;
		for (let i = 0; i < newlyClassified; i++) {
			const spanIndex = animatedRef.current + i;
			setTimeout(() => {
				setAnimatedUpTo((prev) => Math.max(prev, spanIndex + 1));
				animatedRef.current = spanIndex + 1;
				setTimeout(() => {
					const el = spanRefs.current.get(spanIndex);
					if (el) el.scrollIntoView({
						behavior: "smooth",
						block: "center"
					});
				}, 50);
			}, i * 400);
		}
		setTimeout(() => {
			setAnimatedUpTo(classifiedCount);
			animatedRef.current = classifiedCount;
		}, newlyClassified * 400 + 100);
	}, [classifiedCount]);
	useEffect(() => {
		animatedRef.current = 0;
		setAnimatedUpTo(0);
	}, [result.text]);
	const fragments = [];
	let cursor = 0;
	for (const [index, span] of result.spans.entries()) {
		fragments.push(result.text.slice(cursor, span.start));
		const label = span.techniqueId === "pending" ? "Classifying…" : span.techniqueName;
		const isAnimated = index < animatedUpTo;
		fragments.push(/* @__PURE__ */ jsx("span", {
			className: `annotated-span${isAnimated ? " animate" : ""}`,
			ref: (el) => {
				if (el) spanRefs.current.set(index, el);
				else spanRefs.current.delete(index);
			},
			children: /* @__PURE__ */ jsxs("mark", {
				title: `${String(index + 1).padStart(2, "0")} · ${label}`,
				children: [/* @__PURE__ */ jsx("span", {
					className: "annotation-marker",
					"aria-hidden": "true",
					children: String(index + 1).padStart(2, "0")
				}), /* @__PURE__ */ jsx("span", {
					className: "highlighted-text",
					children: result.text.slice(span.start, span.end)
				})]
			})
		}, `${span.start}-${span.end}`));
		cursor = span.end;
	}
	fragments.push(result.text.slice(cursor));
	return /* @__PURE__ */ jsxs("section", {
		className: "results-section",
		"aria-labelledby": "results-title",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "results-header",
			children: [/* @__PURE__ */ jsx("p", {
				role: "status",
				className: "result-summary",
				children: count ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("strong", { children: [
					count,
					" suspected ",
					count === 1 ? "span" : "spans"
				] }), " detected."] }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("strong", { children: "No suspected patterns found." }) })
			}), /* @__PURE__ */ jsxs("button", {
				className: "clear-button-top",
				type: "button",
				onClick: onClear,
				children: [/* @__PURE__ */ jsx(Eraser, { size: 15 }), " Clear"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "text-reading",
			"aria-label": "Submitted text with suspected techniques highlighted",
			children: fragments
		})]
	});
}
//#endregion
//#region src/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	default: () => home_default,
	loader: () => loader$6,
	meta: () => meta
});
function meta({ matches, location }) {
	return seo({
		matches,
		location
	}, {
		title: "Propaganda Technique Highlighter",
		description: "Examine suspected rhetorical techniques in your text with labelled highlights. A transparent English-language pattern scan, not a judgment of truth.",
		image: "https://images.hostinger.com/8202ab4b-dea1-4d1e-be90-27165bce01b8/cee2e3d1-a1bb-48bd-ae21-65bde41573fc.png",
		jsonLd: [{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Propaganda Technique Highlighter",
			description: "A transparent tool for examining suspected rhetorical techniques, not assessing truth."
		}, {
			"@context": "https://schema.org",
			"@type": "WebApplication",
			name: "Propaganda Technique Highlighter",
			applicationCategory: "EducationalApplication",
			operatingSystem: "Any",
			browserRequirements: "Requires JavaScript",
			isAccessibleForFree: true
		}]
	});
}
/**
* The technique list lives in the backend. If it cannot be read the page still
* renders, without the definitions.
*/
async function loader$6() {
	try {
		return {
			techniques: await loadTechniques(),
			cacheControl: "public, max-age=3600"
		};
	} catch (error) {
		logger.error(error instanceof Error ? error.message : error);
		return { techniques: null };
	}
}
var home_default = UNSAFE_withComponentProps(function HomePage({ loaderData }) {
	const { techniques } = loaderData;
	const [text, setText] = useState("");
	const [running, setRunning] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);
	const requestRef = useRef(null);
	function clear() {
		requestRef.current?.abort();
		requestRef.current = null;
		setText("");
		setRunning(false);
		setResult(null);
		setError(null);
	}
	async function detect() {
		if (!text.trim() || text.length > 1e4 || running) return;
		const submitted = text;
		const controller = new AbortController();
		requestRef.current = controller;
		setRunning(true);
		setError(null);
		setResult(null);
		const timeout = setTimeout(() => controller.abort(), 6e4);
		try {
			const response = await fetch("/api/analyze/stream", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "text/event-stream"
				},
				body: JSON.stringify({ text: submitted }),
				signal: controller.signal
			});
			if (requestRef.current !== controller) return;
			if (!response.ok) {
				if (response.status === 429) throw new Error("Too many requests. Please wait a few minutes and try again.");
				if (response.status >= 500) throw new Error("Analysis is temporarily unavailable. Your text is still here; please try again.");
				throw new Error("The text could not be analyzed. Please check your input and try again.");
			}
			const reader = response.body?.getReader();
			if (!reader) throw new Error("Streaming not supported");
			const decoder = new TextDecoder();
			let buffer = "";
			let currentSpans = [];
			let spinnerStopped = false;
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				for (const line of lines) {
					if (!line.startsWith("data: ")) continue;
					try {
						const event = JSON.parse(line.slice(6));
						if (event.type === "spans_detected") {
							currentSpans = event.spans;
							setResult({
								text: submitted,
								spans: currentSpans,
								method: "pattern-based",
								language: "en"
							});
							if (!spinnerStopped) {
								spinnerStopped = true;
								setRunning(false);
							}
						} else if (event.type === "span_classified") {
							currentSpans[event.index] = event.span;
							setResult({
								text: submitted,
								spans: [...currentSpans],
								method: "pattern-based",
								language: "en"
							});
						} else if (event.type === "error") throw new Error(event.error);
					} catch (e) {
						if (e instanceof Error && e.message !== "The user aborted a request.") throw e;
					}
				}
			}
		} catch (cause) {
			if (requestRef.current !== controller) return;
			setError(controller.signal.aborted ? "Analysis timed out. Your text is still here; please try again." : cause instanceof TypeError ? "Could not connect to the server. Check your connection and try again." : cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
		} finally {
			clearTimeout(timeout);
			if (requestRef.current === controller) {
				requestRef.current = null;
				setRunning(false);
			}
		}
	}
	const spanNumbersByTechnique = /* @__PURE__ */ new Map();
	if (result) for (const [index, span] of result.spans.entries()) {
		if (span.techniqueId === "pending") continue;
		const existing = spanNumbersByTechnique.get(span.techniqueId) ?? [];
		existing.push(index + 1);
		spanNumbersByTechnique.set(span.techniqueId, existing);
	}
	const hasPending = result?.spans.some((s) => s.techniqueId === "pending") ?? false;
	return /* @__PURE__ */ jsxs("main", {
		id: "main-content",
		className: "app-main",
		children: [/* @__PURE__ */ jsx(Introduction, {}), /* @__PURE__ */ jsxs("div", {
			className: "editor-with-techniques",
			children: [
				techniques && /* @__PURE__ */ jsx("div", {
					className: "techniques-sidebar left",
					children: /* @__PURE__ */ jsx("div", {
						className: "technique-definitions",
						children: techniques.slice(0, Math.ceil(techniques.length / 2)).map((technique) => {
							const numbers = spanNumbersByTechnique.get(technique.id);
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", { children: [technique.name, numbers && numbers.length > 0 && /* @__PURE__ */ jsx("span", {
								className: "technique-span-numbers",
								children: numbers.map((n) => /* @__PURE__ */ jsx("span", {
									className: "span-number",
									children: String(n).padStart(2, "0")
								}, n))
							})] }), /* @__PURE__ */ jsx("p", { children: technique.description })] }, technique.id);
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "editor-center",
					children: result ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AnalysisResults, {
						result,
						techniques,
						onClear: clear
					}), hasPending && /* @__PURE__ */ jsx("div", {
						className: "classification-progress",
						children: /* @__PURE__ */ jsx("p", { children: "Classifying techniques…" })
					})] }) : /* @__PURE__ */ jsx(TextEditor, {
						text,
						running,
						error,
						onTextChange: (value) => {
							setText(value);
							setResult(null);
							setError(null);
						},
						onDetect: detect,
						onClear: clear
					})
				}),
				techniques && /* @__PURE__ */ jsx("div", {
					className: "techniques-sidebar right",
					children: /* @__PURE__ */ jsx("div", {
						className: "technique-definitions",
						children: techniques.slice(Math.ceil(techniques.length / 2)).map((technique) => {
							const numbers = spanNumbersByTechnique.get(technique.id);
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", { children: [technique.name, numbers && numbers.length > 0 && /* @__PURE__ */ jsx("span", {
								className: "technique-span-numbers",
								children: numbers.map((n) => /* @__PURE__ */ jsx("span", {
									className: "span-number",
									children: String(n).padStart(2, "0")
								}, n))
							})] }), /* @__PURE__ */ jsx("p", { children: technique.description })] }, technique.id);
						})
					})
				})
			]
		})]
	});
});
//#endregion
//#region src/routes/sitemap.xml.ts
var sitemap_xml_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$5 });
var STATIC_PATHS = ["/"];
function escapeXml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function toLoc(origin, path) {
	return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
function serializeSitemap(origin, entries) {
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((entry) => {
		return `\t<url>\n\t\t<loc>${escapeXml(toLoc(origin, entry.path))}</loc>${entry.lastmod ? `\n\t\t<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""}\n\t</url>`;
	}).join("\n")}\n</urlset>\n`;
}
/**
* Public dynamic URLs (blog posts, PDPs, articles).
* Return `{ path, lastmod }` in the same change that adds a collection.
* Return `[]` only while the site has no public records; clear those URLs
* again in the same change that removes the collection.
*/
async function getDynamicEntries() {
	return [];
}
async function loader$5({ request }) {
	const origin = siteOrigin(request);
	const entries = [...STATIC_PATHS.map((path) => ({ path })), ...await getDynamicEntries()];
	return new Response(serializeSitemap(origin, entries), { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600"
	} });
}
//#endregion
//#region src/routes/robots.txt.ts
var robots_txt_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$4 });
/**
* Hostinger-provided hosts: the editor sandbox preview, and the domain a site is
* published on before its owner connects one of their own. Neither should reach a
* search index — the site is not on its final URL yet.
*/
var UNPUBLISHED_HOST_SUFFIXES = [
	".app-preview.com",
	".app-preview.io",
	".hostingersite.com",
	".hostingersite.dev"
];
/**
* The assistants and answer engines that fetch a page to answer someone's
* question and cite the site back. They are listed by name, rather than left to
* the wildcard group, so the site's stance on AI access is explicit to anyone —
* or anything — reading the file.
*
* Each vendor splits the work the same way: one crawler builds the index the
* answers are drawn from, another fetches the single page a person just asked
* about. Meta and Amazon both document that second kind as free to skip
* robots.txt, since a human asked for the page — naming them records the site's
* answer, it does not enforce it.
*/
var AI_ANSWER_AGENTS = [
	"OAI-SearchBot",
	"ChatGPT-User",
	"Claude-SearchBot",
	"Claude-User",
	"PerplexityBot",
	"Perplexity-User",
	"DuckAssistBot",
	"MistralAI-User",
	"meta-webindexer",
	"meta-externalfetcher",
	"Amzn-SearchBot",
	"Amzn-User"
];
/**
* Tokens whose meaning is permission to train generative models on the content.
* `Google-Extended` and `Applebot-Extended` are not crawlers and never fetch
* anything — they read robots.txt as a usage licence, so `Disallow: /` is the
* only way to express `ai-train=no` to them. The rest are the crawlers that
* collect training corpora. Most have an answer-engine counterpart above that
* keeps the site citable in exchange; `Bytespider` is last because ByteDance
* runs no answer engine to trade the access for.
*
* Blocking `Google-Extended` also gives up grounding in the Gemini app. Google
* Search, and the AI Overviews built from its index, are unaffected, and
* `Applebot-Extended` works the same way for Siri and Spotlight. `Googlebot`
* and `Applebot` themselves keep their access through the wildcard group, which
* is why neither is named above.
*/
var AI_TRAINING_AGENTS = [
	"GPTBot",
	"ClaudeBot",
	"Google-Extended",
	"Applebot-Extended",
	"meta-externalagent",
	"Amazonbot",
	"Bytespider"
];
/**
* Content signals (contentsignals.org) state what crawlers may do with the
* content once fetched: appear in search results, ground an AI answer, or train
* a model. Search and AI answers are allowed because they bring readers back;
* training is not, which is the default every publisher starts from.
*
* A named group replaces the wildcard group for that agent rather than adding
* to it, so the signal is repeated inside each one — otherwise the agents it is
* aimed at are the only ones that never read it.
*/
var CONTENT_SIGNAL = "Content-Signal: search=yes, ai-input=yes, ai-train=no";
function publishedRules(origin) {
	return [
		"User-agent: *",
		CONTENT_SIGNAL,
		"Allow: /",
		"",
		...AI_ANSWER_AGENTS.flatMap((agent) => [
			`User-agent: ${agent}`,
			CONTENT_SIGNAL,
			"Allow: /",
			""
		]),
		...AI_TRAINING_AGENTS.flatMap((agent) => [
			`User-agent: ${agent}`,
			"Disallow: /",
			""
		]),
		`Sitemap: ${origin}/sitemap.xml`
	];
}
function loader$4({ request }) {
	const origin = siteOrigin(request);
	const { hostname } = new URL(origin);
	const lines = UNPUBLISHED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix)) ? ["User-agent: *", "Disallow: /"] : publishedRules(origin);
	return new Response(`${lines.join("\n")}\n`, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "public, max-age=3600"
	} });
}
//#endregion
//#region src/routes/api.health.ts
var api_health_exports = /* @__PURE__ */ __exportAll({
	action: () => action$3,
	loader: () => loader$3
});
var health = withApi(async () => json({ ok: true }));
var loader$3 = health;
var action$3 = health;
//#endregion
//#region src/routes/api.analyze.ts
var api_analyze_exports = /* @__PURE__ */ __exportAll({
	action: () => action$2,
	loader: () => loader$2
});
var loader$2 = withApi(() => apiError(405, "Use a POST request with JSON containing a text field."));
var action$2 = withApi(async ({ request }) => {
	if (request.method !== "POST") return apiError(405, "Use a POST request.");
	if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return apiError(415, "Send the text as application/json.");
	const body = await readJsonBody(request);
	if (!body || typeof body !== "object" || !("text" in body) || typeof body.text !== "string") return apiError(422, "Please provide a text field containing a string.");
	if (!body.text.trim()) return apiError(422, "Paste some text before analyzing.");
	if (body.text.length > 1e4) return apiError(422, "Text must be 10,000 characters or fewer.");
	return analyzeWithBackend(body.text);
});
//#endregion
//#region src/routes/api.analyze.stream.ts
var api_analyze_stream_exports = /* @__PURE__ */ __exportAll({
	action: () => action$1,
	loader: () => loader$1
});
var loader$1 = () => apiError(405, "Use a POST request with JSON containing a text field.");
var action$1 = async ({ request }) => {
	if (request.method !== "POST") return apiError(405, "Use a POST request.");
	if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return apiError(415, "Send the text as application/json.");
	const body = await readJsonBody(request);
	if (!body || typeof body !== "object" || !("text" in body) || typeof body.text !== "string") return apiError(422, "Please provide a text field containing a string.");
	if (!body.text.trim()) return apiError(422, "Paste some text before analyzing.");
	if (body.text.length > 1e4) return apiError(422, "Text must be 10,000 characters or fewer.");
	return analyzeWithBackendStream(body.text);
};
//#endregion
//#region src/routes/api.$.ts
var api_$_exports = /* @__PURE__ */ __exportAll({
	action: () => action,
	loader: () => loader
});
/**
* Unmatched `/api/*` paths answer with JSON instead of React Router's HTML
* error document. More specific `/api/...` routes always win over this one.
*/
var notFound = withApi(async () => apiError(404, "Route not found"));
var loader = notFound;
var action = notFound;
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-C_LB9vgy.js",
		"imports": [
			"/assets/jsx-runtime-BlrG3Y9p.js",
			"/assets/errorBoundaries-DQRoWv1J.js",
			"/assets/_virtual_horizons-runtime-huBsKPSF.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-CK2COEg_.js",
			"imports": [
				"/assets/jsx-runtime-BlrG3Y9p.js",
				"/assets/errorBoundaries-DQRoWv1J.js",
				"/assets/_virtual_horizons-runtime-huBsKPSF.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-gkqUrcBg.js",
			"imports": ["/assets/jsx-runtime-BlrG3Y9p.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/sitemap.xml": {
			"id": "routes/sitemap.xml",
			"parentId": "root",
			"path": "sitemap.xml",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/sitemap.xml-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/robots.txt": {
			"id": "routes/robots.txt",
			"parentId": "root",
			"path": "robots.txt",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/robots.txt-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/api.health": {
			"id": "routes/api.health",
			"parentId": "root",
			"path": "api/health",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/api.health-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/api.analyze": {
			"id": "routes/api.analyze",
			"parentId": "root",
			"path": "api/analyze",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/api.analyze-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/api.analyze.stream": {
			"id": "routes/api.analyze.stream",
			"parentId": "root",
			"path": "api/analyze/stream",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/api.analyze.stream-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/api.$": {
			"id": "routes/api.$",
			"parentId": "root",
			"path": "api/*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/api._-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-f1b61778.js",
	"version": "f1b61778",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "../../dist/apps/web/client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/sitemap.xml": {
		id: "routes/sitemap.xml",
		parentId: "root",
		path: "sitemap.xml",
		index: void 0,
		caseSensitive: void 0,
		module: sitemap_xml_exports
	},
	"routes/robots.txt": {
		id: "routes/robots.txt",
		parentId: "root",
		path: "robots.txt",
		index: void 0,
		caseSensitive: void 0,
		module: robots_txt_exports
	},
	"routes/api.health": {
		id: "routes/api.health",
		parentId: "root",
		path: "api/health",
		index: void 0,
		caseSensitive: void 0,
		module: api_health_exports
	},
	"routes/api.analyze": {
		id: "routes/api.analyze",
		parentId: "root",
		path: "api/analyze",
		index: void 0,
		caseSensitive: void 0,
		module: api_analyze_exports
	},
	"routes/api.analyze.stream": {
		id: "routes/api.analyze.stream",
		parentId: "root",
		path: "api/analyze/stream",
		index: void 0,
		caseSensitive: void 0,
		module: api_analyze_stream_exports
	},
	"routes/api.$": {
		id: "routes/api.$",
		parentId: "root",
		path: "api/*",
		index: void 0,
		caseSensitive: void 0,
		module: api_$_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
