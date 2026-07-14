import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, ClipboardList, Wallet, Star, FileCheck, LogOut, Menu, X, Award } from "lucide-react"
import { useState } from "react"

const navItems = [
  { path: "/app", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/tasks", label: "Tasks", icon: ClipboardList },
  { path: "/app/submissions", label: "Submissions", icon: FileCheck },
  { path: "/app/reviews", label: "Reviews", icon: Star },
  { path: "/app/wallet", label: "Wallet", icon: Wallet },
  { path: "/app/profile", label: "Profile & CV", icon: Award },
]

export function AppLayout() {
  const { user, logout, isAuthenticated, loading, isSponsor, isReviewer } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-civic-blue text-lg font-medium">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (location.pathname !== "/app/login" && location.pathname !== "/app/register") {
      navigate("/app/login")
      return null
    }
    return (
      <div className="min-h-screen bg-civic-gray">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-civic-gray">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-4 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="CivicBench" className="h-10 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="text-lg font-bold text-civic-slate">CivicBench</span>
          </Link>
        </div>
        <Separator />
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            if (item.path === "/app/reviews" && !isReviewer) return null
            const Icon = item.icon
            const isActive = location.pathname === item.path || (item.path !== "/app" && location.pathname.startsWith(item.path))
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-civic-blue text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
          {isSponsor && (
            <Link to="/app/tasks/create" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/app/tasks/create" ? "bg-civic-blue text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              <ClipboardList className="w-4 h-4" />
              Create Task
            </Link>
          )}
        </nav>
        <Separator />
        <div className="p-3">
          <div className="px-3 py-2 text-sm text-gray-500">{user?.name}</div>
          <div className="px-3 text-xs text-gray-400 capitalize mb-2">{user?.role}</div>
          <Button variant="ghost" className="w-full justify-start text-gray-600" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-civic-slate">CivicBench</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t border-gray-200 p-3 space-y-1">
            {navItems.map((item) => {
              if (item.path === "/app/reviews" && !isReviewer) return null
              const Icon = item.icon
              const isActive = location.pathname === item.path || (item.path !== "/app" && location.pathname.startsWith(item.path))
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? "bg-civic-blue text-white" : "text-gray-600"}`}>
                  <Icon className="w-4 h-4" /> {item.label}
                </Link>
              )
            })}
            {isSponsor && (
              <Link to="/app/tasks/create" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <ClipboardList className="w-4 h-4" /> Create Task
              </Link>
            )}
            <Separator />
            <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 w-full">
              <LogOut className="w-4 h-4" /> Logout ({user?.name})
            </button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
