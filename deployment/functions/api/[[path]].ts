export async function onRequest(context) {
  const { request, next, env } = context;
  
  // Proxy all /api/* requests to the worker
  const url = new URL(request.url);
  const apiPath = url.pathname;
  
  // Forward the request to the worker
  const workerUrl = `https://cema.piwisuite.cl${apiPath}${url.search}`;
  
  const response = await fetch(workerUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body
  });
  
  // Return the response
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
