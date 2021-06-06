export enum ApiVersion {
  October19 = "2019-10",
  January20 = "2020-01",
  April20 = "2020-04",
  July20 = "2020-07",
  October20 = "2020-10",
  January21 = "2021-01",
  Stable = "2021-01",
  Unstable = "Unstable",
  Unversioned = "unversioned",
}

export interface ShopifySession {
  shop?: string;
  accessToken?: string;
}

export interface DefaultProxyOptions {
  version: ApiVersion;
}

export interface PrivateShopOption extends DefaultProxyOptions {
  shop: string;
  password: string;
}

export type ProxyOptions = PrivateShopOption | DefaultProxyOptions;

declare module "fastify" {
  interface FastifyRequest {
    session: {
      shop: string;
      accessToken: string;
    };
  }
}
