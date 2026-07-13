import { useEffect, useState } from "react"
import { useParams, Link } from "react-router"
import { api } from "@/providers/api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tag, ArrowLeft, User } from "lucide-react"

export function AppTaskDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [task, setTask] = useState<any>(null)
  const [mySubmission, setMySubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [textContent, setTextContent] = useState("")
  const [fileUrls, setFileUrls] = useState("")

  const load = () => {
    if (!id) return
    Promise.all([api.task(id), api.mySubmissions().catch(() => [])]).then(([taskData, subs]: any) => {
      setTask(taskData)
      const mine = Array.isArray(subs) ? subs.find((s: any) => String(s.task_id) === String(id)) : null
      setMySubmission(mine || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(load, [id])

  const handleClaim = async () => {
    if (!id) return
    setClaiming(true)
    try {
      await api.claimTask(id)
      load()
    } catch (e: any) {
      alert(e.message || "Failed to claim task")
    } finally {
      setClaiming(false)
    }
  }

  const handleSubmit = async () => {
    if (!id || !textContent.trim()) return
    setSubmitting(true)
    try {
      await api.submit({ taskId: parseInt(id), textContent: textContent.trim(), fileUrls: fileUrls ? JSON.stringify([fileUrls.trim()]) : "[]" })
      setTextContent("")
      setFileUrls("")
      alert("Submission sent for review!")
      load()
    } catch (e: any) {
      alert(e.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>
  if (!task) return <div className="text-center py-10 text-gray-400">Task not found</div>

  const canClaim = task.status === "open" && user?.role === "citizen"
  const canSubmit = task.status === "claimed" && mySubmission && mySubmission.status === "pending" && !mySubmission.text_content

  return (
    <div className="space-y-4">
      <Link to="/app/tasks" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-civic-blue"><ArrowLeft className="w-4 h-4" /> Back to Tasks</Link>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs rounded-full ${task.status === "open" ? "bg-green-100 text-green-700" : task.status === "claimed" ? "bg-blue-100 text-blue-700" : task.status === "submitted" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{task.status}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Tag className="w-3 h-3" />{task.type}</span>
            </div>
            <h1 className="text-xl font-bold text-civic-slate">{task.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-civic-green">N{task.pay_amount?.toLocaleString()}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{task.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1"><User className="w-4 h-4" />Posted by: {task.sponsor_name || "Anonymous"}</span>
        </div>

        {canClaim && (
          <Button onClick={handleClaim} disabled={claiming} className="bg-civic-green hover:bg-civic-green-dark">
            {claiming ? "Claiming..." : "Claim This Task"}
          </Button>
        )}

        {canSubmit && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-3 font-medium">Submit your work</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Proof URL (photo/document link)</label>
                <input type="url" value={fileUrls} onChange={(e) => setFileUrls(e.target.value)} placeholder="https://..." className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-civic-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea value={textContent} onChange={(e) => setTextContent(e.target.value)} placeholder="Describe what you did..." className="mt-1" />
              </div>
              <Button onClick={handleSubmit} disabled={submitting || !textContent.trim()} className="bg-civic-green hover:bg-civic-green-dark">
                {submitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </div>
        )}

        {task.status === "submitted" && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-700">
            This task is under review. You'll be notified once it's approved.
          </div>
        )}

        {(task.status === "reviewed" || task.status === "paid") && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg text-sm text-green-700">
            This task has been reviewed{task.status === "paid" ? " and payment has been processed." : "."}
          </div>
        )}
      </div>
    </div>
  )
}
