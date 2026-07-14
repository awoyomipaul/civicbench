import { useEffect, useState } from "react"
import { useParams, Link } from "react-router"
import { api } from "@/providers/api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Tag, Calendar, ArrowLeft, User } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  claimed: "bg-blue-100 text-blue-700",
  in_progress: "bg-blue-100 text-blue-700",
  submitted: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  disputed: "bg-orange-100 text-orange-700",
}

export function AppTaskDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [task, setTask] = useState<any>(null)
  const [mySubmission, setMySubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [starting, setStarting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [disputing, setDisputing] = useState(false)
  const [proofUrl, setProofUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [disputeReason, setDisputeReason] = useState("")

  const load = () => {
    if (!id) return
    Promise.all([api.task(id), api.submissions().catch(() => ({ submissions: [] }))]).then(([taskData, subsData]: any) => {
      setTask(taskData.task || null)
      const subs = subsData.submissions || []
      const mine = subs.filter((s: any) => String(s.taskId) === String(id) && s.citizenId === user?.id).sort((a: any, b: any) => b.id - a.id)[0]
      setMySubmission(mine || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(load, [id, user?.id])

  const handleClaim = async () => {
    if (!id) return
    setClaiming(true)
    try { await api.claimTask(id); load() } catch (e: any) { alert(e.message || "Failed to claim task") } finally { setClaiming(false) }
  }

  const handleStart = async () => {
    if (!id) return
    setStarting(true)
    try { await api.startTask(id); load() } catch (e: any) { alert(e.message || "Failed to start task") } finally { setStarting(false) }
  }

  const handleSubmit = async () => {
    if (!id || !proofUrl.trim()) return
    setSubmitting(true)
    try {
      await api.submit({ taskId: parseInt(id), proofUrl: proofUrl.trim(), notes })
      setProofUrl(""); setNotes("")
      alert("Submission sent for review!")
      load()
    } catch (e: any) {
      alert(e.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDispute = async () => {
    if (!mySubmission || !disputeReason.trim()) return
    setDisputing(true)
    try {
      await api.dispute(String(mySubmission.id), disputeReason.trim())
      setDisputeReason("")
      alert("Dispute filed. A reviewer will take a second look.")
      load()
    } catch (e: any) {
      alert(e.message || "Failed to file dispute")
    } finally {
      setDisputing(false)
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>
  if (!task) return <div className="text-center py-10 text-gray-400">Task not found</div>

  const isClaimedByMe = task.claimedBy === user?.id
  const canClaim = task.status === "open" && user?.role === "citizen"
  const canStart = isClaimedByMe && task.status === "claimed"
  const canSubmit = isClaimedByMe && ["claimed", "in_progress", "rejected"].includes(task.status)
  const canDispute = isClaimedByMe && task.status === "rejected" && mySubmission?.status === "rejected"

  return (
    <div className="space-y-4">
      <Link to="/app/tasks" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-civic-blue"><ArrowLeft className="w-4 h-4" /> Back to Tasks</Link>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${STATUS_COLOR[task.status] || "bg-gray-100 text-gray-600"}`}>{task.status.replace("_", " ")}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Tag className="w-3 h-3" />{task.category}</span>
            </div>
            <h1 className="text-xl font-bold text-civic-slate">{task.title}</h1>
            {task.verifiedPartner && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-xs font-medium rounded-full bg-civic-green/10 text-civic-green">
                ✓ Backed by {task.verifiedPartner} {task.partnerTier ? `(${task.partnerTier})` : ""}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-civic-green">N{task.reward?.toLocaleString()}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{task.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{task.location}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}</span>
          <span className="flex items-center gap-1"><User className="w-4 h-4" />Posted by: {task.sponsorName || "Anonymous"}</span>
        </div>

        {canClaim && (
          <Button onClick={handleClaim} disabled={claiming} className="bg-civic-green hover:bg-civic-green-dark">
            {claiming ? "Claiming..." : "Claim This Task"}
          </Button>
        )}

        {canStart && (
          <div className="mt-2">
            <Button onClick={handleStart} disabled={starting} variant="outline">
              {starting ? "Starting..." : "Start Work"}
            </Button>
            <p className="text-xs text-gray-400 mt-1">Mark this task as in progress once you begin — or submit directly whenever you're ready.</p>
          </div>
        )}

        {mySubmission?.status === "rejected" && task.status === "rejected" && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg text-sm text-red-700">
            <p className="font-medium mb-1">Your last submission was rejected.</p>
            {mySubmission.feedback && <p>Feedback: {mySubmission.feedback}</p>}
          </div>
        )}

        {canSubmit && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-3 font-medium">{task.status === "rejected" ? "Resubmit your work" : "Submit your work"}</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Proof URL (photo/document link)</label>
                <input type="url" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-civic-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe what you did..." className="mt-1" />
              </div>
              <Button onClick={handleSubmit} disabled={submitting || !proofUrl.trim()} className="bg-civic-green hover:bg-civic-green-dark">
                {submitting ? "Submitting..." : task.status === "rejected" ? "Resubmit for Review" : "Submit for Review"}
              </Button>
            </div>
          </div>
        )}

        {canDispute && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700 mb-2 font-medium">Disagree with the rejection? File a dispute instead of resubmitting.</p>
            <Textarea value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} placeholder="Explain why you believe this should be reconsidered..." className="mb-2" />
            <Button onClick={handleDispute} disabled={disputing || !disputeReason.trim()} variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              {disputing ? "Filing..." : "File Dispute"}
            </Button>
          </div>
        )}

        {task.status === "disputed" && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg text-sm text-orange-700">
            <p className="font-medium mb-1">This submission is under dispute.</p>
            {mySubmission?.disputeReason && <p>Your reason: {mySubmission.disputeReason}</p>}
            <p className="mt-1">A reviewer will make a final call.</p>
          </div>
        )}

        {task.status === "submitted" && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-700">
            This task is under review. You'll be notified once it's approved.
          </div>
        )}

        {(task.status === "approved" || task.status === "paid") && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg text-sm text-green-700">
            This task has been approved{task.status === "paid" ? " and payment has been processed." : "."}
          </div>
        )}
      </div>
    </div>
  )
}
