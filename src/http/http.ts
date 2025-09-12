import type { HttpClientBase, Url } from '../http-client/index';

type httpURLFn = (...args: any[]) => Url;

export type EndpointsBase = {
  [key: string]: string | httpURLFn | EndpointsBase;
};
// TODO added url schema
// export interface Http<Endpoints extends EndpointsBase = EndpointsBase> {
//   client: HttpClientBase;
//   url: Endpoints;
// }

export interface Http {
  client: HttpClientBase;
}
