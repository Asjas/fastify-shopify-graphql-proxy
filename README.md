# `fastify-shopify-graphql-proxy`

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/fastify-shopify-graphql-proxy.svg)](https://badge.fury.io/js/fastify-shopify-graphql-proxy)
[![codecov](https://codecov.io/gh/Asjas/fastify-shopify-graphql-proxy/branch/master/graph/badge.svg?token=IHWSO9MQ7B)](https://codecov.io/gh/Asjas/fastify-shopify-graphql-proxy)
[![Main WorkFlow](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/main.yml/badge.svg)](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/main.yml)
[![CodeQL WorkFlow](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Asjas/fastify-shopify-graphql-proxy/actions/workflows/codeql-analysis.yml)

`fastify-shopify-graphql-proxy` is a plugin for the [Fastify](https://github.com/fastify/fastify) framework that is
based on [koa-shopify-graphql-proxy](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-graphql-proxy).
It allows for proxying of GraphQL requests from an embedded Shopify app to Shopify's GraphQL API.

Any `POST` request made to `/graphql` will be proxied to Shopify's GraphQL API and the response will be returned.

## Requirements

- Fastify v3.0.0 or later.
- Node.js (12.x, 14.x, 16.x)

## Quick Start

Install the package using `npm`:

```sh
npm i --save-exact fastify-shopify-graphql-proxy
```

or `yarn`:

```sh
yarn add fastify-shopify-graphql-proxy
```

## Code Examples

### Custom App

If you are creating a [Custom Shopify app](https://help.shopify.com/en/manual/apps/custom-apps), you can skip over the
auth step and provide the `shop url` and `password`.

```js
import { shopifyGraphQLProxy, ApiVersion } from "fastify-shopify-graphql-proxy";
import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.register(shopifyGraphQLProxy, {
  shop: "https://my-shopify-store.myshopify.com",
  password: "SHOPIFY_API_ACCESS_TOKEN",
  version: ApiVersion.Stable, // API Version "2022-04"
});

server.listen(3000, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.info(`server listening on ${address}`);
});
```

### Public App (Not currently possible)

This Fastify plugin will get the shop url and AccessToken from the current session of the logged-in store. _Note:_ You
will need to use `fastify-session` for this to work.

```js
import fastifySession from "fastify-session";
import createShopifyAuth from "fastify-shopify-auth";
import { shopifyGraphQLProxy, ApiVersion } from "fastify-shopify-graphql-proxy";
import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.register(fastifySession, { secret: "a secret with a minimum length of 32 characters" });

server.register(
  createShopifyAuth({
    /* your config here */
  }),
);

server.register(shopifyGraphQLProxy, {
  version: ApiVersion.Stable, // API Version "2022-04"
});

server.listen(3000, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.info(`server listening on ${address}`);
});
```

## API

`fastify-shopify-graphql-proxy` accepts the following `options` object:

- `shop` (Default: `undefined`): a string value that is the Shopify URL for your store
- `password` (Default: `undefined`): a string value that is the API Key password
- `version` (Default: `Stable`): Shopify GraphQL version (example: `"2022-04"`).
- `prefix` (Default: `undefined`): You can create a `custom path` for the GraphQL endpoint by specifying a route prefix.

Here are all the Shopify API GraphQL versions that can be imported and used from `ApiVersion`:

```sh
April22 = "2022-04"
January22 = "2022-01"
October21 = "2021-10"
July21 = "2021-07"
April21 = "2021-04"
Stable = "2022-04"
Unstable = 'Unstable'
Unversioned = 'unversioned'
```

## License

[MIT License](LICENSE)
