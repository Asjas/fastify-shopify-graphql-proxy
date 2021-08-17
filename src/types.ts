export enum ApiVersion {
  January21 = "2021-01",
  April21 = "2021-04",
  July21 = "2021-07",
  October21 = "2021-10",
  Stable = "2021-10",
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
