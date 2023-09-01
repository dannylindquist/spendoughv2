export const renderView = (view: string, headers?: Record<string, string>) => {
  return new Response(view, {
    status: 200,
    headers: {
      "content-type": "text/html",
      ...headers,
    },
  });
};
