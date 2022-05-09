import proxy from "@fastify/reply-from";
import { FastifyInstance } from "fastify";
import { ShopifySession, ProxyOptions, ApiVersion, ShopifyHTTPHeaders } from "./types";

export default async function shopifyGraphQLProxy(fastify: FastifyInstance, proxyOptions: ProxyOptions) {
  const session: ShopifySession = { shop: undefined, accessToken: undefined };

  fastify.addHook("onRequest", (request, _reply, done) => {
    session.shop = request?.session?.shop;
    session.accessToken = request?.session?.accessToken;

    done();
  });

  await fastify.register(proxy, {
    undici: proxyOptions.undici || {},
  });

  fastify.post("/graphql", (_request, reply) => {
    const shop = "shop" in proxyOptions ? proxyOptions.shop : session.shop;
    const accessToken = "accessToken" in proxyOptions ? proxyOptions.accessToken : session.accessToken;
    const version = "version" in proxyOptions ? proxyOptions.version : ApiVersion.Stable;

    if (accessToken == null || shop == null) {
      throw new Error("Unauthorized, shopifyGraphQLProxy `shop` or `accessToken` arguments are empty.");
    }

    reply.from(`${shop}/admin/api/${version}/graphql.json`, {
      rewriteRequestHeaders(_originalReq, headers) {
        const modifiedHeaders: ShopifyHTTPHeaders = {
          ...headers,
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        };

        return modifiedHeaders;
      },
    });
  });
}
