import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildUpstreamRequest, upstreamUrl } from "./api-proxy.js";
import { onRequest } from "./api/[[path]].js";

describe("upstreamUrl", () => {
  it("strips the /api prefix the same way nginx does", () => {
    assert.equal(
      upstreamUrl(
        "https://cookbook.pages.dev/api/v1/dish?limit=10",
        "https://cookbook-api.onrender.com"
      ),
      "https://cookbook-api.onrender.com/v1/dish?limit=10"
    );
    assert.equal(
      upstreamUrl(
        "https://cookbook.pages.dev/api",
        "https://cookbook-api.onrender.com"
      ),
      "https://cookbook-api.onrender.com/"
    );
  });

  it("rejects a missing or path-bearing origin", () => {
    assert.throws(
      () => upstreamUrl("https://cookbook.pages.dev/api/health", ""),
      /API_ORIGIN is not configured/
    );
    assert.throws(
      () =>
        upstreamUrl(
          "https://cookbook.pages.dev/api/v1/dish",
          "https://cookbook-api.onrender.com/v1"
        ),
      /without a path/
    );
  });
});

describe("buildUpstreamRequest", () => {
  it("keeps the auth cookie and the multipart body", () => {
    const file = new Blob(["photo-bytes"], { type: "image/jpeg" });
    const form = new FormData();
    form.set("folderName", "recipes");
    form.set("file", file, "dish.jpg");

    const request = new Request(
      "https://cookbook.pages.dev/api/v1/s3/upload-file",
      {
        method: "POST",
        headers: { cookie: "accessToken=a; refreshToken=b" },
        body: form,
      }
    );

    const upstream = buildUpstreamRequest(
      request.url,
      "https://cookbook-api.onrender.com",
      request.method,
      request.headers,
      request.body
    );

    assert.equal(
      upstream.url,
      "https://cookbook-api.onrender.com/v1/s3/upload-file"
    );
    assert.equal(upstream.init.method, "POST");
    assert.equal(upstream.init.redirect, "manual");
    assert.equal(upstream.init.body, request.body);
    assert.equal(
      upstream.init.headers.get("cookie"),
      "accessToken=a; refreshToken=b"
    );
    assert.match(
      upstream.init.headers.get("content-type"),
      /^multipart\/form-data; boundary=/
    );
    assert.equal(upstream.init.headers.get("x-forwarded-proto"), "https");
    assert.equal(upstream.init.headers.get("host"), null);
  });

  it("does not attach a body to GET or HEAD", () => {
    for (const method of ["GET", "HEAD"]) {
      const upstream = buildUpstreamRequest(
        "https://cookbook.pages.dev/api/v1/auth/refresh",
        "https://cookbook-api.onrender.com",
        method,
        new Headers({ cookie: "refreshToken=b" }),
        "must-not-be-forwarded"
      );
      assert.equal(upstream.init.body, undefined);
      assert.equal(upstream.init.headers.get("cookie"), "refreshToken=b");
    }
  });
});

describe("onRequest", () => {
  it("returns the upstream response without rewriting Set-Cookie", async () => {
    const upstream = new Response(null, { status: 204 });
    upstream.headers.append(
      "set-cookie",
      "accessToken=a; HttpOnly; Secure; SameSite=Strict; Path=/"
    );
    upstream.headers.append(
      "set-cookie",
      "refreshToken=b; HttpOnly; Secure; SameSite=Strict; Path=/"
    );

    const request = new Request(
      "https://cookbook.pages.dev/api/v1/auth/refresh",
      {
        method: "POST",
        headers: {
          cookie: "refreshToken=b",
          "content-type": "application/json",
        },
        body: "token-body",
      }
    );
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://cookbook-api.onrender.com/v1/auth/refresh");
      assert.equal(init.method, "POST");
      assert.equal(init.headers.get("cookie"), "refreshToken=b");
      assert.equal(init.headers.get("content-type"), "application/json");
      assert.equal(init.body, request.body);
      return upstream;
    };

    try {
      const response = await onRequest({
        request,
        env: { API_ORIGIN: "https://cookbook-api.onrender.com" },
      });

      assert.equal(response, upstream);
      assert.deepEqual(response.headers.getSetCookie(), [
        "accessToken=a; HttpOnly; Secure; SameSite=Strict; Path=/",
        "refreshToken=b; HttpOnly; Secure; SameSite=Strict; Path=/",
      ]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
