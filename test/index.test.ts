// @ts-ignore
import { test } from "tap";
import fastify from "fastify";
import shopifyGraphQLProxy, { ApiVersion } from "../src";

test("throws error if shop argument is empty", async (t) => {
  t.plan(1);
  try {
    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      accessToken: "SHOPIFY_API_ACCESS_TOKEN",
      version: ApiVersion.Stable,
    });

    t.teardown(server.close.bind(server));
  } catch (err: any) {
    t.equal(err.message, "Unauthorized, Shopify `accessToken` or `shop` arguments are empty.");
  }
});

test("throws error if accessToken argument is empty", async (t) => {
  t.plan(1);
  try {
    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      shop: "https://my-shopify-store.myshopify.com",
      version: ApiVersion.Stable,
    });

    t.teardown(server.close.bind(server));
  } catch (err: any) {
    t.equal(err.message, "Unauthorized, Shopify `accessToken` or `shop` arguments are empty.");
  }
});
