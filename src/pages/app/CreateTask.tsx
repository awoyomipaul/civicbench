import { useState } from "react"
import { useNavigate } from "react-router"
import { api } from "@/providers/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AppCreateTask() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Documentation")
  const [location, setLocation] = useState("")
  const [reward, setReward] = useState("")
  const [deadline, setDeadline] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.createTask({
        title,
        description,
        category,
        location,
        reward: parseInt(reward),
        deadline: deadline || null,
      })
      navigate("/app/tasks")
    } catch (err: any) {
      setError(err.message || "Failed to create task")
      setLoading(false)
    }
  }

  const categories = ["Documentation", "Verification", "Clean-up", "Survey", "Community Support", "Data Collection", "Other"]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-civic-slate mb-6">Create New Task</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Verify Polling Unit Results" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe what needs to be done..." className="mt-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-civic-blue">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g., Lagos, Ikeja" className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reward">Reward (N)</Label>
            <Input id="reward" type="number" min="100" value={reward} onChange={(e) => setReward(e.target.value)} required placeholder="5000" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1" />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-civic-blue hover:bg-civic-blue-dark">
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </div>
  )
}
