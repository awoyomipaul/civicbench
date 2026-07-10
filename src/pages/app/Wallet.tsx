import { useEffect, useState } from "react"
import { api } from "@/providers/api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowDownLeft, ArrowUpRight, AlertCircle } from "lucide-react"

export function AppWallet() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.wallet().then((data: any) => {
      setBalance(data.balance || 0)
      setTransactions(data.transactions || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSeed = async () => {
    try {
      await api.seed()
      const data = await api.wallet() as any
      setBalance(data.balance || 0)
      setTransactions(data.transactions || [])
      alert("Demo wallet funded with N10,000!")
    } catch (e: any) {
      alert(e.message || "Failed to seed wallet")
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-civic-slate">My Wallet</h1>

      <div className="bg-gradient-to-r from-civic-blue to-civic-blue-light rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-3xl font-bold mt-1">N{balance.toLocaleString()}</p>
          </div>
          <Wallet className="w-10 h-10 opacity-50" />
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Withdraw</Button>
          {user?.role === "sponsor" && (
            <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">Fund Wallet</Button>
          )}
          <Button size="sm" onClick={handleSeed} className="bg-civic-green hover:bg-civic-green-dark text-white border-0 ml-auto">+ Seed Demo Funds</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-civic-slate">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No transactions yet.</p>
              <Button size="sm" onClick={handleSeed} className="mt-3 bg-civic-green hover:bg-civic-green-dark">Seed Demo Funds</Button>
            </div>
          ) : (
            transactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "credit" || tx.type === "reward" ? "bg-green-100" : "bg-red-100"}`}>
                    {tx.type === "credit" || tx.type === "reward" ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-civic-slate capitalize">{tx.description || tx.type}</p>
                    <p className="text-xs text-gray-400">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${tx.type === "credit" || tx.type === "reward" ? "text-civic-green" : "text-red-600"}`}>
                  {tx.type === "credit" || tx.type === "reward" ? "+" : "-"}N{tx.amount?.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
