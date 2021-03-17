import proxy from 'fastify-reply-from';
import type { FastifyInstance } from 'fastify';
import { ApiVersion, ShopifySession, ProxyOptions } from './types';
import { IncomingHttpHeaders } from 'http';

export default async function shopifyGraphQLProxy(fastify: FastifyInstance, proxyOptions: ProxyOptions) {
  const session: ShopifySession = { shop: '', accessToken: '' };

  fastify.addHook('onRequest', async (request) => {
    session.shop = request?.session?.shop;
    session.accessToken = request?.session?.accessToken;
  });

  const shop = 'shop' in proxyOptions ? proxyOptions.shop : session.shop;
  const accessToken = 'password' in proxyOptions ? proxyOptions.password : session.accessToken;
  const version = proxyOptions.version || ApiVersion.Stable;

  if (accessToken === undefined || shop === undefined) {
    throw new Error('Unauthorized');
  }

  fastify.register(proxy, {
    base: shop,
  });

  fastify.post('/graphql', function(_request, reply) {
    reply.from(`${shop}/admin/api/${version}/graphql.json`, {
      rewriteRequestHeaders(_originalReq, headers) {
        const modifiedHeaders = {
          ...headers,
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        } as IncomingHttpHeaders;

        return modifiedHeaders;
      },
    });
  });
}

export { ApiVersion };
