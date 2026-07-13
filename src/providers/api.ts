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
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  register: (data: unknown) => fetchApi("/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: unknown) => fetchApi("/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => fetchApi("/me"),
  logout: () => { localStorage.removeItem("token") },

  tasks: (status?: string) => fetchApi(status ? `/tasks?status=${status}` : "/tasks"),
  task: (id: string) => fetchApi(`/tasks/${id}`),
  createTask: (data: { title: string; description: string; type: string; budget: number; payAmount: number }) =>
    fetchApi("/tasks", { method: "POST", body: JSON.stringify(data) }),
  claimTask: (id: string) => fetchApi(`/tasks/${id}/claim`, { method: "POST" }),

  submissions: () => fetchApi("/submissions"),
  mySubmissions: () => fetchApi("/submissions/mine"),
  submit: (data: { taskId: number; textContent: string; fileUrls?: string }) =>
    fetchApi("/submissions", { method: "POST", body: JSON.stringify(data) }),
  grade: (id: string, data: { grade: "A" | "B" | "C" | "D" | "F"; comment: string }) =>
    fetchApi(`/submissions/${id}/grade`, { method: "POST", body: JSON.stringify(data) }),

  walletBalance: () => fetchApi("/wallet/balance"),
  walletHistory: () => fetchApi("/wallet/history"),
  payWorker: (submissionId: string) => fetchApi(`/wallet/pay/${submissionId}`, { method: "POST" }),

  seed: () => fetchApi("/seed", { method: "POST" }),
}
