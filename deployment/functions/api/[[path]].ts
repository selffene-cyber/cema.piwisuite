export async function onRequest(context) {
  const { request, next, env } = context;
  
  // Proxy all /api/* requests to the worker
  const url = new URL(request.url);
  const apiPath = url.pathname;
  
  // Forward the request to the worker's default subdomain
  // Using Workers.dev subdomain to avoid domain conflict
  const workerUrl = `https://cema-worker.jeans.workers.dev${apiPath}${url.search}`;
  
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
