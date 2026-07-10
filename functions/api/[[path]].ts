export async function onRequest(context: any) {
  const WORKER_URL = "https://civicbench-api.akintomiwaposi.workers.dev"
  const url = new URL(context.request.url)
  const target = WORKER_URL + url.pathname + url.search

  return fetch(target, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
  })
}
