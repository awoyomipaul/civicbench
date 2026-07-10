const API_BASE = "/api"

async function fetchApi(path: string, options?: RequestInit) {
  const token = localStorage.getItem("token")
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  register: (data: unknown) => fetchApi("/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: unknown) => fetchApi("/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => fetchApi("/me"),
  logout: () => { localStorage.removeItem("token") },

  tasks: () => fetchApi("/tasks"),
  task: (id: string) => fetchApi(`/tasks/${id}`),
  createTask: (data: unknown) => fetchApi("/tasks", { method: "POST", body: JSON.stringify(data) }),
  claimTask: (id: string) => fetchApi(`/tasks/${id}/claim`, { method: "POST" }),

  submissions: () => fetchApi("/submissions"),
  submit: (data: unknown) => fetchApi("/submissions", { method: "POST", body: JSON.stringify(data) }),
  review: (id: string, data: unknown) => fetchApi(`/submissions/${id}/review`, { method: "POST", body: JSON.stringify(data) }),

  wallet: () => fetchApi("/wallet"),
  seed: () => fetchApi("/seed"),
}
