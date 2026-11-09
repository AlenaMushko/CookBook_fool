import { buildUpstreamRequest } from "../api-proxy.js";

export async function onRequest(context) {
  let upstream;
  try {
    upstream = buildUpstreamRequest(
      context.request.url,
      context.env.API_ORIGIN,
      context.request.method,
      context.request.headers,
      context.request.body
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bad API proxy configuration";
    return new Response(message, {
      status: 500,
      headers: { "cache-control": "no-store" },
    });
  }

  // Returned as-is so every Set-Cookie header reaches the browser.
  return fetch(upstream.url, upstream.init);
}
