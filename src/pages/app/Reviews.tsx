import { useEffect, useState } from "react"
import { api } from "@/providers/api"
import { Star } from "lucide-react"

export function AppReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.submissions().then((data: any) => {
      const list = Array.isArray(data) ? data : []
      setReviews(list.filter((s: any) => s.status !== "pending"))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-civic-blue" />
        <h1 className="text-2xl font-bold text-civic-slate">Reviewed Submissions</h1>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-gray-400">No reviewed submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-civic-slate">{sub.task_title || `Task #${sub.task_id}`}</p>
                  <p className="text-sm text-gray-400">By {sub.citizen_name || "Anonymous"}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${sub.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{sub.grade ? `Grade ${sub.grade}` : sub.status}</span>
              </div>
              {sub.reviewer_comment && <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Feedback:</span> {sub.reviewer_comment}</p>}
              <p className="text-xs text-gray-400 mt-2">Reviewed on {sub.reviewed_at ? new Date(sub.reviewed_at).toLocaleDateString() : "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
