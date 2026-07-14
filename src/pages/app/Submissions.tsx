import { useEffect, useState } from "react"
import { api } from "@/providers/api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"
import { ExternalLink } from "lucide-react"

export function AppSubmissions() {
  const { isReviewer } = useAuth()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.submissions().then((data: any) => {
      setSubmissions(data.submissions || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleReview = async (id: number, status: "approved" | "rejected", feedback: string) => {
    try {
      await api.review(String(id), { status, feedback })
      const data = await api.submissions() as any
      setSubmissions(data.submissions || [])
    } catch (e: any) {
      alert(e.message || "Review failed")
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
            <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/app/tasks/${sub.taskId}`} className="font-semibold text-civic-slate hover:text-civic-blue">{sub.taskTitle || `Task #${sub.taskId}`}</Link>
                  <p className="text-sm text-gray-400 mt-0.5">By {sub.citizenName || "Anonymous"} &middot; {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "N/A"}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${sub.status === "pending" ? "bg-yellow-100 text-yellow-700" : sub.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{sub.status}</span>
              </div>

              {sub.notes && <p className="text-sm text-gray-600 mb-3">{sub.notes}</p>}

              {sub.proofUrl && (
                <a href={sub.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-civic-blue hover:underline mb-3">
                  <ExternalLink className="w-3 h-3" /> View Proof
                </a>
              )}

              {isReviewer && sub.status === "pending" && (
                <ReviewForm submissionId={sub.id} onReview={handleReview} />
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

function ReviewForm({ submissionId, onReview }: { submissionId: number; onReview: (id: number, status: "approved" | "rejected", feedback: string) => void }) {
  const [feedback, setFeedback] = useState("")
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <Input placeholder="Review feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mb-2" />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onReview(submissionId, "approved", feedback)} className="bg-civic-green hover:bg-civic-green-dark text-xs">Approve</Button>
        <Button size="sm" variant="outline" onClick={() => onReview(submissionId, "rejected", feedback)} className="text-red-600 border-red-200 hover:bg-red-50 text-xs">Reject</Button>
      </div>
    </div>
  )
}
