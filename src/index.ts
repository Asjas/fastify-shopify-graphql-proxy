const fp = require('fastify-plugin');
const proxy = require('fastify-reply-from');

const PROXY_BASE_PATH = '/graphql';
const GRAPHQL_PATH_PREFIX = '/admin/api';

export enum ApiVersion {
  July19 = '2019-07',
  October19 = '2019-10',
  January20 = '2020-01',
  April20 = '2020-04',
  July20 = '2020-07',
  Unstable = 'unstable',
  Unversioned = 'unversioned',
}

interface DefaultProxyOptions {
  version: ApiVersion;
}

interface ShopifySession {
  shop?: String;
  accessToken?: String;
}

interface PrivateShopOption extends DefaultProxyOptions {
  password: string;
  shop: string;
}

type ProxyOptions = PrivateShopOption | DefaultProxyOptions;

async function shopifyGraphQLProxy(fastify, proxyOptions: ProxyOptions, done) {
  const session: ShopifySession = { shop: '', accessToken: '' };

  fastify.addHook('onRequest', async (request, _reply, _done) => {
    if (request.url !== '/graphql' && request.method !== 'POST') {
      return;
    }

    session.shop = request.session.shop;
    session.accessToken = request.session.accessToken;
  });

  const shop = 'shop' in proxyOptions ? proxyOptions.shop : session.shop;
  const accessToken = 'password' in proxyOptions ? proxyOptions.password : session.accessToken;
  const version = proxyOptions.version || ApiVersion.Unversioned;

  if (accessToken === null || shop === null) {
    done(new Error('Unauthorized'));
    return;
  }

  fastify.register(proxy, {
    base: shop,
  });

  fastify.post(PROXY_BASE_PATH, function(_request, reply) {
    reply.from(`${shop}${GRAPHQL_PATH_PREFIX}/${version}/graphql.json`, {
      rewriteRequestHeaders(_originalReq, headers) {
        const modifiedHeaders = {
          ...headers,
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        };

        return modifiedHeaders;
      },
    });
  });
}

module.exports = fp(shopifyGraphQLProxy, {
  fastify: '^2.0.0',
  name: 'fastify-shopify-graphql-proxy',
});
