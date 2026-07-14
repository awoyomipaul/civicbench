import { useEffect, useState } from "react"
import { Link } from "react-router"
import { api } from "@/providers/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Tag } from "lucide-react"

export function AppTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.tasks().then((data: any) => {
      setTasks(data.tasks || [])
      setFiltered(data.tasks || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let f = tasks
    if (search) f = f.filter((t) => t.title?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))
    if (category !== "all") f = f.filter((t) => t.category === category)
    setFiltered(f)
  }, [search, category, tasks])

  const categories = ["all", ...Array.from(new Set(tasks.map((t) => t.category).filter(Boolean)))]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-civic-slate">Available Tasks</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
          {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading tasks...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No tasks found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((task) => (
            <Link key={task.id} to={`/app/tasks/${task.id}`} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-civic-blue/30 transition-all">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-civic-slate line-clamp-1">{task.title}</h3>
                <span className="text-civic-green font-bold whitespace-nowrap ml-2">N{task.reward?.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
              {task.verifiedPartner && (
                <span className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 text-xs font-medium rounded-full bg-civic-green/10 text-civic-green">
                  ✓ Backed by {task.verifiedPartner}
                </span>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{task.category}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{task.location}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-block px-2 py-0.5 text-xs rounded-full capitalize ${task.status === "open" ? "bg-green-100 text-green-700" : ["claimed", "in_progress"].includes(task.status) ? "bg-blue-100 text-blue-700" : task.status === "submitted" ? "bg-yellow-100 text-yellow-700" : ["approved", "paid"].includes(task.status) ? "bg-green-100 text-green-700" : task.status === "disputed" ? "bg-orange-100 text-orange-700" : task.status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{task.status.replace("_", " ")}</span>
                <span className="text-xs text-gray-400">Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
