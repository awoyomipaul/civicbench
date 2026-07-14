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
  startTask: (id: string) => fetchApi(`/tasks/${id}/start`, { method: "POST" }),

  submissions: () => fetchApi("/submissions"),
  submit: (data: unknown) => fetchApi("/submissions", { method: "POST", body: JSON.stringify(data) }),
  review: (id: string, data: { status: "approved" | "rejected"; feedback: string; grade?: "A" | "B" | "C" | "D" | "F" }) => fetchApi(`/submissions/${id}/review`, { method: "POST", body: JSON.stringify(data) }),
  dispute: (id: string, reason: string) => fetchApi(`/submissions/${id}/dispute`, { method: "POST", body: JSON.stringify({ reason }) }),
  resolve: (id: string, data: { resolution: "approved" | "rejected"; feedback: string; grade?: "A" | "B" | "C" | "D" | "F" }) => fetchApi(`/submissions/${id}/resolve`, { method: "POST", body: JSON.stringify(data) }),

  profile: (userId: number | string) => fetchApi(`/users/${userId}/profile`),
  cv: (userId: number | string) => fetchApi(`/users/${userId}/cv`),

  wallet: () => fetchApi("/wallet"),
  seed: () => fetchApi("/seed"),
}
