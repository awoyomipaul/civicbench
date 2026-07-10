import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/providers/api"
import { Button } from "@/components/ui/button"
import { ClipboardList, Wallet, Award, TrendingUp } from "lucide-react"

export function AppDashboard() {
  const { user, isSponsor } = useAuth()
  const [stats, setStats] = useState({ tasks: 0, wallet: 0, completed: 0 })
  const [recentTasks, setRecentTasks] = useState<any[]>([])

  useEffect(() => {
    api.tasks().then((data: any) => {
      setStats({ tasks: data.tasks?.length || 0, wallet: 0, completed: data.tasks?.filter((t: any) => t.status === "completed")?.length || 0 })
      setRecentTasks(data.tasks?.slice(0, 5) || [])
    }).catch(() => {})
    api.wallet().then((data: any) => {
      setStats((s) => ({ ...s, wallet: data.balance || 0 }))
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-civic-slate">Welcome, {user?.name || "User"}!</h1>
        <p className="text-gray-500">Here's what's happening on CivicBench.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Tasks</p>
              <p className="text-2xl font-bold text-civic-slate">{stats.tasks}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-civic-blue opacity-80" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="text-2xl font-bold text-civic-green">N{stats.wallet.toLocaleString()}</p>
            </div>
            <Wallet className="w-8 h-8 text-civic-green opacity-80" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-civic-slate">{stats.completed}</p>
            </div>
            <Award className="w-8 h-8 text-civic-blue opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-civic-slate">Recent Tasks</h2>
          <Link to="/app/tasks" className="text-sm text-civic-blue hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentTasks.length === 0 && <p className="p-5 text-gray-400 text-sm">No tasks yet. {isSponsor && "Create one to get started!"}</p>}
          {recentTasks.map((task: any) => (
            <Link key={task.id} to={`/app/tasks/${task.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-civic-slate">{task.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{task.category} &middot; {task.location}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-civic-green">N{task.reward?.toLocaleString()}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${task.status === "open" ? "bg-green-100 text-green-700" : task.status === "in_review" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{task.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-civic-blue to-civic-blue-light rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-semibold">How CivicBench Works</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 text-sm">
          {["Sponsors post civic tasks with rewards", "Citizens claim and complete tasks", "Partners verify task completion", "Reviewers approve quality work"].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="opacity-90">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
