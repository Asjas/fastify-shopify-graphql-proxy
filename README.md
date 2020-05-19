# `fastify-shopify-graphql-proxy`

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/fastify-shopify-graphql-proxy.svg)](https://badge.fury.io/js/fastify-shopify-graphql-proxy)

`fastify-shopify-graphql-proxy` is a plugin for the [Fastify](https://github.com/fastify/fastify) framework that is based on [koa-shopify-graphql-proxy](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-graphql-proxy). It allows for proxying of GraphQL requests from an embedded shopify app to Shopify's GraphQL API.

Any `POST` request made to `/graphql` will be proxied to Shopify's GraphQL API and the response will be returned.

## Requirements

Node.js v10 or later.
Fastify v2.0.0 or later.

## Installation

```sh
npm install fastify-shopify-graphql-proxy
yarn add fastify-shopify-graphql-proxy
```

## Example

### Auth Based App

This Fastify plugin will get the shop url and AccessToken from the current session of the logged-in store. _Note:_ You will need to use `fastify-session` for this to work.

```js
const fastify = require('fastify')({
  logger: true,
});
const fastifySession = require('fastify-session');
const createShopifyAuth = require('fastify-koa-shopify-auth');
const shopifyGraphQLProxy = require('fastify-shopify-graphql-proxy');

app.register(fastifySession, { secret: 'a secret with minimum length of 32 characters' });

fastify.register(
  createShopifyAuth({
    /* your config here */
  })
);

fastify.register(shopifyGraphQLProxy, {
  version: 'Stable',
});

fastify.listen(3000, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`server listening on ${address}`);
});
```

### Private App

If you are creating a [private shopify app](https://help.shopify.com/en/manual/apps/private-apps), you can skip over the auth step and provide the shop url and password of the private Shopify app.

```js
const fastify = require('fastify')({
  logger: true,
});
const shopifyGraphQLProxy = require('fastify-shopify-graphql-proxy');

fastify.register(shopifyGraphQLProxy, {
  shop: 'https://my-shopify-store.myshopify.com',
  password: 'PRIVATE_APP_API_KEY_PASSWORD',
  version: 'Stable',
});

fastify.listen(3000, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`server listening on ${address}`);
});
```

## API

`fastify-shopify-graphql-proxy` accepts the following options object:

```js
{
  shop: "https://my-shopify-store.myshopify.com",
  password: "value",
  version: "2020-04"
}
```

- `shop` (Default: `undefined`): a string value that is the Shopify URL for your store
- `password` (Default: `undefined`): a string value that is the API Key password
- `version` (Default: `Stable`): Shopify GraphQL version (example: `2020-04`, `Stable`).

## License

[MIT License](LICENSE)
