import { useState } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/providers/api"

export function AppLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.login({ email, password }) as { token: string }
      localStorage.setItem("token", data.token)
      window.location.href = "/app"
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-civic-gray px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="" className="h-10 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="text-xl font-bold text-civic-slate">CivicBench</span>
          </Link>
          <h1 className="text-2xl font-bold text-civic-slate">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Demo Accounts</span></div></div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { email: "citizen@demo.com", pass: "demo123" },
              { email: "sponsor@demo.com", pass: "demo123" },
              { email: "partner@demo.com", pass: "demo123" },
              { email: "reviewer@demo.com", pass: "demo123" },
            ].map((demo) => (
              <button key={demo.email} type="button" onClick={() => { setEmail(demo.email); setPassword(demo.pass); }} className="p-2 border rounded hover:bg-gray-50 text-left">
                <div className="font-medium">{demo.email.split("@")[0]}</div>
                <div className="text-gray-400">{demo.pass}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/app/register" className="text-civic-blue hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
