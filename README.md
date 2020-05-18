# fastify-shopify-graphql-proxy

`fastify-shopify-graphql-proxy` is a plugin for the [Fastify](https://github.com/fastify/fastify) framework that is based on [koa-shopify-graphql-proxy](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-graphql-proxy).

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

```js
const shopifyGraphQLProxy = require('fastify-shopify-graphql-proxy');
const fastify = require('fastify')({
  logger: true,
});

fastify.register(shopifyGraphQLProxy, {
  shop: 'https://my-shopify-store.myshopify.com',
  password: 'PRIVATE_APP_API_KEY_PASSWORD',
  version: '2020-04',
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
  password: "value"
  version: "2020-04"
}
```

- `shop` (Default: `undefined`): a string value that is the Shopify URL for your store
- `password` (Default: `undefined`): a string value that is the API Key password
- `version` (Default: `latest`): Shopify GraphQL version (example: `2020-04`, `latest`).

## License

[MIT License](LICENSE)
