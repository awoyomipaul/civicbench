import { useEffect, useState } from "react"
import { api } from "@/providers/api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"
import { ExternalLink, AlertTriangle } from "lucide-react"

export function AppSubmissions() {
  const { isReviewer } = useAuth()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.submissions().then((data: any) => {
      setSubmissions(data.submissions || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(load, [])

  const handleReview = async (id: number, status: "approved" | "rejected", feedback: string, grade?: string) => {
    try {
      await api.review(String(id), { status, feedback, grade: grade as any })
      load()
    } catch (e: any) {
      alert(e.message || "Review failed")
    }
  }

  const handleResolve = async (id: number, resolution: "approved" | "rejected", feedback: string, grade?: string) => {
    try {
      await api.resolve(String(id), { resolution, feedback, grade: grade as any })
      load()
    } catch (e: any) {
      alert(e.message || "Resolution failed")
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-civic-slate">Submissions</h1>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-gray-400">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div key={sub.id} className={`bg-white rounded-xl border shadow-sm p-5 ${sub.status === "disputed" ? "border-orange-300" : "border-gray-100"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/app/tasks/${sub.taskId}`} className="font-semibold text-civic-slate hover:text-civic-blue">{sub.taskTitle || `Task #${sub.taskId}`}</Link>
                  <p className="text-sm text-gray-400 mt-0.5">By {sub.citizenName || "Anonymous"} &middot; {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {sub.grade && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-civic-blue/10 text-civic-blue">Grade {sub.grade}</span>}
                  <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${sub.status === "pending" ? "bg-yellow-100 text-yellow-700" : sub.status === "approved" ? "bg-green-100 text-green-700" : sub.status === "disputed" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>{sub.status}</span>
                </div>
              </div>

              {sub.notes && <p className="text-sm text-gray-600 mb-3">{sub.notes}</p>}

              {sub.proofUrl && (
                <a href={sub.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-civic-blue hover:underline mb-3">
                  <ExternalLink className="w-3 h-3" /> View Proof
                </a>
              )}

              {sub.status === "disputed" && sub.disputeReason && (
                <div className="mb-3 p-2 bg-orange-50 rounded text-sm text-orange-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span><span className="font-medium">Dispute reason:</span> {sub.disputeReason}</span>
                </div>
              )}

              {isReviewer && sub.status === "pending" && (
                <ReviewForm submissionId={sub.id} onReview={handleReview} />
              )}

              {isReviewer && sub.status === "disputed" && (
                <ResolveForm submissionId={sub.id} onResolve={handleResolve} />
              )}

              {sub.feedback && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  <span className="font-medium">Feedback:</span> {sub.feedback}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewForm({ submissionId, onReview }: { submissionId: number; onReview: (id: number, status: "approved" | "rejected", feedback: string, grade?: string) => void }) {
  const [feedback, setFeedback] = useState("")
  const [grade, setGrade] = useState("A")
  const grades = ["A", "B", "C", "D", "F"]
  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
      <Input placeholder="Review feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium">Grade:</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
          {grades.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onReview(submissionId, "approved", feedback, grade)} className="bg-civic-green hover:bg-civic-green-dark text-xs">Approve (Grade {grade})</Button>
        <Button size="sm" variant="outline" onClick={() => onReview(submissionId, "rejected", feedback)} className="text-red-600 border-red-200 hover:bg-red-50 text-xs">Reject</Button>
      </div>
    </div>
  )
}

function ResolveForm({ submissionId, onResolve }: { submissionId: number; onResolve: (id: number, resolution: "approved" | "rejected", feedback: string, grade?: string) => void }) {
  const [feedback, setFeedback] = useState("")
  const [grade, setGrade] = useState("A")
  const grades = ["A", "B", "C", "D", "F"]
  return (
    <div className="mt-3 pt-3 border-t border-orange-100 space-y-2">
      <p className="text-xs font-medium text-orange-700">Dispute resolution — this is the final call.</p>
      <Input placeholder="Resolution notes..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium">Grade (if overturning to approved):</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
          {grades.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onResolve(submissionId, "approved", feedback, grade)} className="bg-civic-green hover:bg-civic-green-dark text-xs">Overturn — Approve (Grade {grade})</Button>
        <Button size="sm" variant="outline" onClick={() => onResolve(submissionId, "rejected", feedback)} className="text-red-600 border-red-200 hover:bg-red-50 text-xs">Uphold Rejection</Button>
      </div>
    </div>
  )
}
