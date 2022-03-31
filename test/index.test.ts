import { describe, test, assert, expect } from "vitest";
import { MockAgent, setGlobalDispatcher } from "undici";
import fastify from "fastify";
import fastifySession from "@fastify/session";
import fastifyCookie from "fastify-cookie";
import shopifyGraphQLProxy from "../src";
import { ApiVersion } from "../src/types";

declare module "fastify" {
  interface Session {
    shop?: string;
    accessToken?: string;
  }
}

const mockAgent = new MockAgent({ connections: 1 });

setGlobalDispatcher(mockAgent);

describe("shopifyGraphQLProxy", () => {
  test("should throw error if shop argument is missing in plugin registration", async () => {
    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      accessToken: "SHOPIFY_API_ACCESS_TOKEN",
      version: ApiVersion.Stable,
    });

    await server.inject({ method: "POST", url: "/graphql", payload: { some: "data" } });

    const response = await server.inject({ method: "POST", url: "/graphql", payload: { some: "data" } });

    assert.equal(response.json().statusCode, 500);
    assert.equal(
      response.json().message,
      "Unauthorized, shopifyGraphQLProxy `shop` or `accessToken` arguments are empty.",
    );
  });

  test("should throw error if accessToken argument is missing in plugin registration", async () => {
    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      shop: "https://my-shopify-store.myshopify.com",
      version: ApiVersion.Stable,
    });

    const response = await server.inject({ method: "POST", url: "/graphql", payload: { some: "data" } });

    assert.equal(response.json().statusCode, 500);
    assert.equal(
      response.json().message,
      "Unauthorized, shopifyGraphQLProxy `shop` or `accessToken` arguments are empty.",
    );
  });

  test("should use Stable API version as fallback if missing in plugin registration", async () => {
    const mockPool = mockAgent.get("http://127.0.0.1:3000");

    mockPool.intercept({ path: `/admin/api/${ApiVersion.Stable}/graphql.json`, method: "POST" }).reply(
      200,
      {
        data: { shopify: "data" },
      },
      { headers: { "content-type": "application/json" } },
    );

    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      shop: "https://my-shopify-store.myshopify.com",
      accessToken: "SOME_FAKE_TOKEN",
      undici: mockPool,
    });

    await server.listen(3000);

    const response = await server.inject({ method: "POST", url: "/graphql", payload: { some: "data" } });

    assert.equal(response.statusCode, 200);
    expect(response.json()).toMatchObject({
      data: { shopify: "data" },
    });

    await server.close();
  });

  test("should use `shop` and `accessToken` if available on session", async () => {
    const mockPool = mockAgent.get("http://127.0.0.1:3001");

    mockPool.intercept({ path: `/admin/api/${ApiVersion.Stable}/graphql.json`, method: "POST" }).reply(
      200,
      {
        data: { shopify: "data" },
      },
      { headers: { "content-type": "application/json" } },
    );

    const server = fastify({ logger: false });

    await server.register(fastifyCookie);
    await server.register(fastifySession, { secret: "a secret with minimum length of 32 characters" });

    server.addHook("onRequest", (request, reply, done) => {
      request.session.shop = "https://my-shopify-store.myshopify.com";
      request.session.accessToken = "SHOPIFY_API_ACCESS_TOKEN";

      done();
    });

    await server.register(shopifyGraphQLProxy, {
      version: ApiVersion.Stable,
      undici: mockPool,
    });

    await server.listen(3001);

    const response = await server.inject({ method: "POST", url: "/graphql", payload: { some: "data" } });

    assert.equal(response.statusCode, 200);
    expect(response.json()).toMatchObject({
      data: { shopify: "data" },
    });

    await server.close();
  });

  test("should send query to Shopify GraphQL API", async () => {
    const mockPool = mockAgent.get("http://127.0.0.1:3003");

    mockPool.intercept({ path: `/admin/api/${ApiVersion.Stable}/graphql.json`, method: "POST" }).reply(
      200,
      {
        data: { shopify: "data" },
      },
      { headers: { "content-type": "application/json" } },
    );

    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      shop: "https://my-shopify-store.myshopify.com",
      accessToken: "SOME_FAKE_TOKEN",
      version: ApiVersion.Stable,
      undici: mockPool,
    });

    await server.listen(3003);

    const response = await server.inject({ method: "POST", url: "/graphql", payload: { some: "data" } });

    assert.equal(response.statusCode, 200);
    expect(response.json()).toMatchObject({
      data: { shopify: "data" },
    });

    await server.close();
  });

  test("should send query to custom shopifyGraphQLProxy prefix", async () => {
    const mockPool = mockAgent.get("http://127.0.0.1:3002");

    mockPool.intercept({ path: `/admin/api/${ApiVersion.Stable}/graphql.json`, method: "POST" }).reply(
      200,
      {
        data: { shopify: "data" },
      },
      { headers: { "content-type": "application/json" } },
    );

    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      shop: "https://my-shopify-store.myshopify.com",
      accessToken: "SHOPIFY_API_ACCESS_TOKEN",
      version: ApiVersion.Stable,
      prefix: "/shopify",
      undici: mockPool,
    });

    await server.listen(3002);

    const response = await server.inject({ method: "POST", url: "/shopify/graphql", payload: { some: "data" } });

    assert.equal(response.statusCode, 200);
    expect(response.json()).toMatchObject({
      data: { shopify: "data" },
    });

    await server.close();
  });
});
