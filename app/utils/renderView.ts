import { renderToString } from "preact-render-to-string";
import { VNode } from "preact";

export const renderView = (view: VNode, headers?: Record<string, string>) => {
  return new Response(renderToString(view), {
    status: 200,
    headers: {
      "content-type": "text/html",
      ...headers,
    },
  });
};
