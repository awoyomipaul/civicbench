import { useState, useEffect } from "react"
import { api } from "@/providers/api"

export interface User {
  id: number
  name: string
  email: string
  role: "citizen" | "sponsor" | "reviewer"
  verifiedPartner?: string | null
  partnerTier?: string | null
  reputationScore?: number
  totalTasksCompleted?: number
  averageGrade?: number | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { setLoading(false); return }
    api.me()
      .then((data: { user: User }) => setUser(data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    api.logout()
    setUser(null)
    window.location.href = "/app/login"
  }

  return { user, loading, isAuthenticated: !!user, logout, isSponsor: user?.role === "sponsor", isPartner: !!user?.verifiedPartner, isReviewer: user?.role === "reviewer" }
}
