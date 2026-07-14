import { useState } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/providers/api"

export function AppRegister() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"citizen" | "sponsor" | "reviewer">("citizen")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.register({ name, email, password, role }) as { token: string }
      localStorage.setItem("token", data.token)
      window.location.href = "/app"
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const roles: Array<{ value: "citizen" | "sponsor" | "reviewer"; label: string }> = [
    { value: "citizen", label: "Citizen - Complete civic tasks" },
    { value: "sponsor", label: "Sponsor - Fund civic projects (incl. institutional partners)" },
    { value: "reviewer", label: "Reviewer - Review submissions" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-civic-gray px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="" className="h-10 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="text-xl font-bold text-civic-slate">CivicBench</span>
          </Link>
          <h1 className="text-2xl font-bold text-civic-slate">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join CivicBench today</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
          </div>
          <div>
            <Label>I am a...</Label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {roles.map((r) => (
                <label key={r.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${role === r.value ? "border-civic-blue bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={(e) => setRole(e.target.value as typeof role)} className="mr-3" />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/app/login" className="text-civic-blue hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
