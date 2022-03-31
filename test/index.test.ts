import { describe, test, assert, expect } from "vitest";
import { MockAgent, setGlobalDispatcher } from "undici";
import fastify from "fastify";
import shopifyGraphQLProxy from "../src";
import { ApiVersion } from "../src/types";

const mockAgent = new MockAgent({ connections: 1 });

setGlobalDispatcher(mockAgent);

describe("shopifyGraphQLProxy", () => {
  test("should throw error if shop argument is empty", async () => {
    try {
      const server = fastify({ logger: false });

      await server.register(shopifyGraphQLProxy, {
        accessToken: "SHOPIFY_API_ACCESS_TOKEN",
        version: ApiVersion.Stable,
      });
    } catch (err: any) {
      assert.equal(err.message, "Unauthorized, shopifyGraphQLProxy `shop` or `accessToken` arguments are empty.");
    }
  });

  test("should throw error if accessToken argument is empty", async () => {
    try {
      const server = fastify({ logger: false });

      await server.register(shopifyGraphQLProxy, {
        shop: "https://my-shopify-store.myshopify.com",
        version: ApiVersion.Stable,
      });
    } catch (err: any) {
      assert.equal(err.message, "Unauthorized, shopifyGraphQLProxy `shop` or `accessToken` arguments are empty.");
    }
  });

  test("should send query to custom shopifyGraphQLProxy prefix", async () => {
    const mockPool = mockAgent.get("http://127.0.0.1:3001");

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

    await server.listen(3001);

    const response = await server.inject({ method: "POST", url: "/shopify/graphql", payload: { some: "data" } });

    assert.equal(response.statusCode, 200);
    expect(response.json()).toMatchObject({
      data: { shopify: "data" },
    });

    await server.close();
  });

  test("should send query to Shopify GraphQL API", async () => {
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
      version: ApiVersion.Stable,
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
});
