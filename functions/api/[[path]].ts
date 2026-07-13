export async function onRequest(context: any) {
  const WORKER_URL = "https://civicbench-api.akintomiwaposi.workers.dev"
  const url = new URL(context.request.url)
  const target = WORKER_URL + url.pathname + url.search

  const init: RequestInit & { duplex?: string } = {
    method: context.request.method,
    headers: context.request.headers,
  }

  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    init.body = context.request.body
    init.duplex = "half"
  }

  return fetch(target, init)
}
