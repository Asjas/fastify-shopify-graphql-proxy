import { IncomingHttpHeaders } from "http";

export enum ApiVersion {
  April22 = "2022-04",
  January22 = "2022-01",
  October21 = "2021-10",
  July21 = "2021-07",
  April21 = "2021-04",
  Stable = "2022-04",
  Unstable = "Unstable",
  Unversioned = "unversioned",
}

export interface ShopifySession {
  shop?: string;
  accessToken?: string;
}

export interface ShopifyIncomingHTTPHeaders extends IncomingHttpHeaders {
  "X-Shopify-Access-Token": string;
}

export interface ProxyOptions {
  shop?: string;
  accessToken?: string;
  version?: ApiVersion;
}

declare module "fastify" {
  interface FastifyRequest {
    session: {
      shop?: string;
      accessToken?: string;
    };
  }
}
