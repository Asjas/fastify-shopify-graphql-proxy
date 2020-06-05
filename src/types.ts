export enum ApiVersion {
  July19 = '2019-07',
  October19 = '2019-10',
  January20 = '2020-01',
  April20 = '2020-04',
  July20 = '2020-07',
  Stable = '2020-04',
  Unstable = 'Unstable',
}

export interface ShopifySession {
  shop?: String;
  accessToken?: String;
}

export interface DefaultProxyOptions {
  version: ApiVersion;
}

export interface PrivateShopOption extends DefaultProxyOptions {
  shop: string;
  password: string;
}

export type ProxyOptions = PrivateShopOption | DefaultProxyOptions;
