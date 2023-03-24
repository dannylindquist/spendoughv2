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
) => Response | Promise<Response>;

export type MiddleWareFunction = (
  request: Request,
  context: Context
) => void | undefined | Promise<void> | Promise<Response | undefined>;

export class Router {
  middlewares: MiddleWareFunction[] = [];
  routes: RadixRouter<{ handler: Handler }> = createRadixRouter();

  use(middleware: MiddleWareFunction) {
    this.middlewares.push(middleware);
  }

  get(route: string, requestHandler: Handler) {
    this.routes.insert(`GET:${route}`, {
      handler: requestHandler,
    });
  }

  post(route: string, requestHandler: Handler) {
    this.routes.insert(`POST:${route}`, {
      handler: requestHandler,
    });
  }

  put(route: string, requestHandler: Handler) {
    this.routes.insert(`PUT:${route}`, {
      handler: requestHandler,
    });
  }

  del(route: string, requestHandler: Handler) {
    this.routes.insert(`DELETE:${route}`, {
      handler: requestHandler,
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
      return routeHandler.handler(request, context);
    }
    return new Response("Not found", {
      status: 404,
    });
  }
}
