export function upstreamUrl(requestUrl, apiOrigin) {
  if (typeof apiOrigin !== "string" || apiOrigin.trim() === "") {
    throw new Error("API_ORIGIN is not configured");
  }

  const origin = new URL(apiOrigin);
  if (origin.pathname !== "/" || origin.search || origin.hash) {
    throw new Error(
      "API_ORIGIN must be an origin without a path, query, or hash"
    );
  }

  const incoming = new URL(requestUrl);
  const upstream = new URL(origin.origin);
  const suffix = incoming.pathname.replace(/^\/api/, "");
  upstream.pathname = suffix === "" ? "/" : suffix;
  upstream.search = incoming.search;
  return upstream.toString();
}

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
]);

export function buildUpstreamRequest(requestUrl, apiOrigin, method, headers, body) {
  const url = upstreamUrl(requestUrl, apiOrigin);
  const outgoing = new Headers();

  headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) outgoing.append(key, value);
  });

  const cookie = headers.get("cookie");
  if (cookie && outgoing.get("cookie") == null) outgoing.set("cookie", cookie);

  outgoing.set("x-forwarded-proto", "https");

  const init = { method, headers: outgoing, redirect: "manual" };
  if (method !== "GET" && method !== "HEAD") init.body = body ?? null;
  return { url, init };
}
