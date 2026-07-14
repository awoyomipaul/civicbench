import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { api } from "@/providers/api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Award, TrendingUp, Briefcase, Download } from "lucide-react"

const GRADE_COLOR: Record<string, string> = {
  A: "bg-green-100 text-green-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-red-100 text-red-700",
}

export function AppProfile() {
  const params = useParams<{ id: string }>()
  const { user } = useAuth()
  const targetId = params.id || String(user?.id || "")
  const [cv, setCv] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!targetId) return
    api.cv(targetId).then((data: any) => {
      setCv(data.cv)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [targetId])

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>
  if (!cv) return <div className="text-center py-10 text-gray-400">Profile not found</div>

  const { profile, totalEarned, categoryBreakdown, completedTasks } = cv
  const isOwnProfile = user?.id === profile.id

  return (
    <div className="max-w-3xl mx-auto space-y-6 print:max-w-full">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-civic-slate">{isOwnProfile ? "My Profile & CV" : `${profile.name}'s Profile`}</h1>
        <Button onClick={() => window.print()} className="bg-civic-blue hover:bg-civic-blue-dark">
          <Download className="w-4 h-4 mr-2" /> Download CV (PDF)
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 print:shadow-none print:border-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-civic-slate">{profile.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{profile.role} on CivicBench</p>
            {profile.verifiedPartner && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-civic-green/10 text-civic-green">
                ✓ {profile.verifiedPartner} — {profile.partnerTier}
              </span>
            )}
          </div>
          <Award className="w-10 h-10 text-civic-blue opacity-70" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-civic-gray rounded-lg">
            <p className="text-2xl font-bold text-civic-blue">{profile.reputationScore}</p>
            <p className="text-xs text-gray-500 mt-0.5">Reputation Points</p>
          </div>
          <div className="text-center p-3 bg-civic-gray rounded-lg">
            <p className="text-2xl font-bold text-civic-slate">{profile.totalTasksCompleted}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tasks Completed</p>
          </div>
          <div className="text-center p-3 bg-civic-gray rounded-lg">
            <p className="text-2xl font-bold text-civic-green">{profile.averageGrade != null ? profile.averageGrade.toFixed(1) + "/4.0" : "—"}</p>
            <p className="text-xs text-gray-500 mt-0.5">Avg Quality Score</p>
          </div>
        </div>

        {profile.badges?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.badges.map((b: string) => (
              <span key={b} className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 print:shadow-none print:border-2">
          <h3 className="font-semibold text-civic-slate mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Skills & Categories</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <span key={cat} className="px-3 py-1 text-sm rounded-full bg-civic-blue/10 text-civic-blue">{cat} ({count as number})</span>
            ))}
          </div>
          {isOwnProfile && <p className="text-sm text-gray-500 mt-4">Total earned from completed work: <span className="font-semibold text-civic-green">N{totalEarned.toLocaleString()}</span></p>}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 print:shadow-none print:border-2">
        <h3 className="font-semibold text-civic-slate mb-3">Work History</h3>
        {completedTasks.length === 0 ? (
          <p className="text-sm text-gray-400">No completed tasks yet.</p>
        ) : (
          <div className="space-y-3">
            {completedTasks.map((t: any, i: number) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-civic-slate text-sm">{t.taskTitle}</p>
                  <p className="text-xs text-gray-400">{t.category} &middot; {t.completedAt ? new Date(t.completedAt).toLocaleDateString() : "N/A"}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${GRADE_COLOR[t.grade] || "bg-gray-100 text-gray-600"}`}>Grade {t.grade}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center print:hidden">Sponsor endorsements are not yet available — this feature is planned for a future phase.</p>
    </div>
  )
}
