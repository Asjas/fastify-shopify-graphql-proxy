# `fastify-shopify-graphql-proxy`

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/fastify-shopify-graphql-proxy.svg)](https://badge.fury.io/js/fastify-shopify-graphql-proxy)
[![codecov](https://codecov.io/gh/Asjas/fastify-shopify-graphql-proxy/branch/master/graph/badge.svg?token=IHWSO9MQ7B)](https://codecov.io/gh/Asjas/fastify-shopify-graphql-proxy)
[![Main WorkFlow](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/main.yml/badge.svg)](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/main.yml)
[![CodeQL](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/codeql-analysis.yml)

`fastify-shopify-graphql-proxy` is a plugin for the [Fastify](https://github.com/fastify/fastify) framework that is
based on [koa-shopify-graphql-proxy](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-graphql-proxy).
It allows for proxying of GraphQL requests from an embedded shopify app to Shopify's GraphQL API.

Any `POST` request made to `/graphql` will be proxied to Shopify's GraphQL API and the response will be returned.

## Requirements

Node.js v10 or later. Fastify v3.0.0 or later.

## Installation

```sh
npm install fastify-shopify-graphql-proxy
yarn add fastify-shopify-graphql-proxy
```

## Example

### Auth Based App (Not currently possible)

This Fastify plugin will get the shop url and AccessToken from the current session of the logged-in store. _*Note:*_ You
will need to use `fastify-session` for this to work.

```js
const fastifySession = require("fastify-session");
const createShopifyAuth = require("fastify-shopify-auth");
const { shopifyGraphQLProxy, ApiVersion } = require("fastify-shopify-graphql-proxy");
const fastify = require("fastify")({
  logger: true,
});

app.register(fastifySession, { secret: "a secret with minimum length of 32 characters" });

fastify.register(
  createShopifyAuth({
    /* your config here */
  }),
);

fastify.register(shopifyGraphQLProxy, {
  version: ApiVersion.Stable,
});

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`server listening on ${address}`);
});
```

### Private App

If you are creating a [private shopify app](https://help.shopify.com/en/manual/apps/private-apps), you can skip over the
auth step and provide the shop url and password of the private Shopify app.

```js
const { shopifyGraphQLProxy, ApiVersion } = require("fastify-shopify-graphql-proxy");
const fastify = require("fastify")({
  logger: true,
});

fastify.register(shopifyGraphQLProxy, {
  shop: "https://my-shopify-store.myshopify.com",
  password: "PRIVATE_APP_API_KEY_PASSWORD",
  version: ApiVersion.Stable,
});

fastify.listen(3000, function (err, address) {
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
  version: ApiVersion.Stable,
  prefix: "/shopify",  // results in /shopify/graphql
}
```

- `shop` (Default: `undefined`): a string value that is the Shopify URL for your store
- `password` (Default: `undefined`): a string value that is the API Key password
- `version` (Default: `Stable`): Shopify GraphQL version (example: `2020-04`, `Unstable`).
- `prefix` (Default: `undefined`): You can create a custom GraphQL path by specifying a route prefix.

Here are all the Shopify GraphQL versions available to use:

```sh
January21 = "2021-01"
April21 = "2021-04"
July21 = "2021-07"
October21 = "2021-10"
Stable = "2021-10"
Unstable = 'Unstable'
Unversioned = 'unversioned'
```

## License

[MIT License](LICENSE)
