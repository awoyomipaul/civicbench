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

  const load = () => {
    api.submissions().then((data: any) => {
      setSubmissions(Array.isArray(data) ? data : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(load, [])

  const handleGrade = async (id: number, grade: "A" | "B" | "C" | "D" | "F", comment: string) => {
    try {
      await api.grade(String(id), { grade, comment })
      load()
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
          {submissions.map((sub) => {
            let proofUrl = ""
            try { const arr = JSON.parse(sub.file_urls || "[]"); proofUrl = arr[0] || "" } catch { /* ignore */ }
            return (
              <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link to={`/app/tasks/${sub.task_id}`} className="font-semibold text-civic-slate hover:text-civic-blue">{sub.task_title || `Task #${sub.task_id}`}</Link>
                    <p className="text-sm text-gray-400 mt-0.5">By {sub.citizen_name || "Anonymous"} &middot; {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${sub.status === "pending" ? "bg-yellow-100 text-yellow-700" : sub.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{sub.status}</span>
                </div>

                {sub.text_content && <p className="text-sm text-gray-600 mb-3">{sub.text_content}</p>}

                {proofUrl && (
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-civic-blue hover:underline mb-3">
                    <ExternalLink className="w-3 h-3" /> View Proof
                  </a>
                )}

                {isReviewer && sub.status === "pending" && sub.text_content && (
                  <GradeForm submissionId={sub.id} onGrade={handleGrade} />
                )}

                {sub.reviewer_comment && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <span className="font-medium">Feedback:</span> {sub.reviewer_comment}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GradeForm({ submissionId, onGrade }: { submissionId: number; onGrade: (id: number, grade: "A" | "B" | "C" | "D" | "F", comment: string) => void }) {
  const [comment, setComment] = useState("")
  const grades: Array<"A" | "B" | "C" | "D" | "F"> = ["A", "B", "C", "D", "F"]
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <Input placeholder="Review feedback..." value={comment} onChange={(e) => setComment(e.target.value)} className="mb-2" />
      <div className="flex gap-2 flex-wrap">
        {grades.map((g) => (
          <Button key={g} size="sm" variant="outline" onClick={() => onGrade(submissionId, g, comment)} className="text-xs">Grade {g}</Button>
        ))}
      </div>
    </div>
  )
}
