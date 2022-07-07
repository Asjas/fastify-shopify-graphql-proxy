import type { IncomingHttpHeaders } from "http";

export enum ApiVersion {
  July22 = "2022-07",
  April22 = "2022-04",
  January22 = "2022-01",
  October21 = "2021-10",
  July21 = "2021-07",
  Stable = "2022-07",
  Unstable = "Unstable",
  Unversioned = "unversioned",
}

export interface ShopifySession {
  shop?: string;
  accessToken?: string;
}

export interface ShopifyHTTPHeaders extends IncomingHttpHeaders {
  "X-Shopify-Access-Token": string;
}

export interface ProxyOptions {
  shop?: string;
  accessToken?: string;
  version?: ApiVersion;
  undici?: any;
}

declare module "fastify" {
  interface FastifyRequest {
    session: {
      shop?: string;
      accessToken?: string;
    };
  }
}
