/// <reference types="node" />


declare module "express-serve-static-core" {
  export interface Request<P = any, ResBody = any, ReqBody = any, ReqQuery = any> {
    params: P;
    body: ReqBody;
    query: ReqQuery;
    headers: Record<string, any>;
    method?: string;
    path?: string;
    originalUrl?: string;
    cookies?: Record<string, string> | undefined;
  }

  export interface Response {
    json: (body?: any) => Response;
    status: (code: number) => Response;
    cookie: (name: string, value: string, options?: any) => void;
    clearCookie: (name: string, options?: any) => void;
  }

  export type NextFunction = (err?: any) => void;
  export interface Router {
    use: (...args: any[]) => any;
    get: (...args: any[]) => any;
    post: (...args: any[]) => any;
    put: (...args: any[]) => any;
    delete: (...args: any[]) => any;
    patch: (...args: any[]) => any;
  }
  export interface Express {
    use: (...args: any[]) => any;
    get: (...args: any[]) => any;
    post: (...args: any[]) => any;
    put: (...args: any[]) => any;
    delete: (...args: any[]) => any;
    patch: (...args: any[]) => any;
    listen: (...args: any[]) => any;
  }
}

declare module "express" {
  import type * as core from "express-serve-static-core";
  function express(): core.Express;
  namespace express {
    function json(opts?: any): any;
    function urlencoded(opts?: any): any;
    function Router(): core.Router;
  }
  const e: typeof express;
  export default e;
  export type Request = core.Request;
  export type Response = core.Response;
  export type NextFunction = core.NextFunction;
  export type Router = core.Router;
  export type Application = core.Express;
  export { express as Express };
}

declare module "cookie-parser" {
  const cp: any;
  export default cp;
}

declare module "cors" {
  const c: any;
  export default c;
}

declare module "jsonwebtoken" {
  export function sign(payload: any, secret: string, opts?: any): string;
  export function verify(token: string, secret: string): any;
}
