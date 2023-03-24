import { createRouter as createRadixRouter, RadixRouter } from "radix3";

export type Context = {
  params: Record<string, string>;
  queryParams: URLSearchParams;
  url: URL;
  props: Map<string, any>;
};

export type Handler = (
  request: Request,
  context: Context
) => Response | Promise<Response | void> | void;

export class Router {
  middlewares: Handler[] = [];
  routes: RadixRouter<{ handlers: Handler[] }> = createRadixRouter();

  use(middleware: Handler) {
    this.middlewares.push(middleware);
  }

  get(route: string, ...requestHandler: Handler[]) {
    this.routes.insert(`GET:${route}`, {
      handlers: requestHandler,
    });
  }

  post(route: string, ...requestHandler: Handler[]) {
    this.routes.insert(`POST:${route}`, {
      handlers: requestHandler,
    });
  }

  put(route: string, ...requestHandler: Handler[]) {
    this.routes.insert(`PUT:${route}`, {
      handlers: requestHandler,
    });
  }

  del(route: string, ...requestHandler: Handler[]) {
    this.routes.insert(`DELETE:${route}`, {
      handlers: requestHandler,
    });
  }

  async handler(request: Request) {
    const url = new URL(request.url);
    const key = `${request.method}:${url.pathname}`;
    const routeHandler = this.routes.lookup(key);
    const context = {
      params: {},
      queryParams: url.searchParams,
      url,
      props: new Map(),
    };
    for (const middleware of this.middlewares) {
      const middlewareResult = await middleware(request, context);
      if (middlewareResult instanceof Response) {
        return middlewareResult;
      }
    }
    if (routeHandler) {
      context.params = routeHandler.params || {};
      for (const routeFunction of routeHandler.handlers) {
        const middlewareResult = await routeFunction(request, context);
        if (middlewareResult instanceof Response) {
          return middlewareResult;
        }
      }
    }
    return new Response("Not found", {
      status: 404,
    });
  }
}
