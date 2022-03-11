import { test } from "tap";
import fastify from "fastify";
import shopifyGraphQLProxy, { ApiVersion } from "../src";

test("expect request failure due to using test `shop` and `password` options", async (t) => {
  t.plan(1);
  const server = fastify({ logger: false });

  await server.register(shopifyGraphQLProxy, {
    shop: "https://my-shopify-store.myshopify.com",
    password: "SHOPIFY_API_ACCESS_TOKEN",
    version: ApiVersion.Stable,
  });

  t.teardown(server.close.bind(server));

  const response = await server.inject({
    method: "POST",
    url: "/graphql",
  });

  t.same(JSON.parse(response.body), { errors: { query: "Required parameter missing or invalid" } });
});

test("throws error if `shop` option isn't passed to plugin", async (t) => {
  t.plan(1);
  try {
    const server = fastify({ logger: false });

    await server.register(shopifyGraphQLProxy, {
      password: "SHOPIFY_API_ACCESS_TOKEN",
      version: ApiVersion.Stable,
    });

    t.teardown(server.close.bind(server));
  } catch (err: any) {
    t.equal(err.message, "Unauthorized, Shopify `accessToken` or `shop` arguments are empty.");
  }
});

test("throws error if `password` option isn't passed to plugin", async (t) => {
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
