export const redirect = (location: string, code = 302) => {
  return new Response(null, {
    status: code,
    headers: {
      Location: location,
    },
  });
};
