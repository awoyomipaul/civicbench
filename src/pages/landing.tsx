import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ClipboardList, Users, Wallet, Shield, ArrowRight, MapPin, CheckCircle, TrendingUp, Star, FileCheck, Award } from "lucide-react"

export default function LandingPage() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="CivicBench" className="h-10 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="text-xl font-bold text-civic-slate">CivicBench</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={() => scrollTo("how-it-works")} className="hover:text-civic-blue transition-colors">How it Works</button>
            <button onClick={() => scrollTo("features")} className="hover:text-civic-blue transition-colors">Features</button>
            <button onClick={() => scrollTo("roles")} className="hover:text-civic-blue transition-colors">Roles</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/app/register"><Button size="sm" className="bg-civic-blue hover:bg-civic-blue-dark">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-civic-blue rounded-full text-xs font-medium mb-6">
              <Star className="w-3 h-3" /> Nigeria's Civic Gig Protocol
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-civic-slate leading-tight">
              Turn Civic Work Into <span className="text-civic-blue">Meaningful Income</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              CivicBench connects citizens, sponsors, and reviewers to complete civic tasks — from polling unit verification to community documentation — with transparent rewards.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/app/register"><Button size="lg" className="bg-civic-blue hover:bg-civic-blue-dark">Join as Citizen</Button></Link>
              <Link to="/app/register"><Button size="lg" variant="outline">Sponsor a Task</Button></Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-civic-green" /> Instant payouts</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-civic-green" /> Verified tasks</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-civic-green" /> Transparent reviews</span>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Institutional Trust Strip */}
      <section className="py-10 px-4 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400 font-medium mb-6">Backed by leading civic & data organizations</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["BudgIT Nigeria", "Stears", "EiE Nigeria", "CODE"].map((name) => (
              <span key={name} className="text-lg font-semibold text-gray-400 hover:text-civic-slate transition-colors">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-civic-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-civic-slate text-center mb-12">How CivicBench Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: ClipboardList, title: "Task Posted", desc: "Sponsors create civic tasks with clear requirements and rewards", color: "bg-blue-50 text-civic-blue" },
              { icon: Users, title: "Citizen Claims", desc: "Verified citizens claim tasks they're qualified to complete", color: "bg-green-50 text-civic-green" },
              { icon: FileCheck, title: "Work Reviewed", desc: "Independent reviewers verify proof and grade the work", color: "bg-purple-50 text-purple-600" },
              { icon: Wallet, title: "Instant Payout", desc: "Approved work gets rewarded directly to citizen wallets", color: "bg-orange-50 text-orange-600" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-civic-slate text-white text-xs flex items-center justify-center font-bold">{i + 1}</div>
                </div>
                <h3 className="font-semibold text-civic-slate mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-civic-slate text-center mb-4">Built for Civic Impact</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Every feature designed to make civic participation rewarding, transparent, and scalable across Nigeria.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Geo-Tagged Verification", desc: "All tasks include location data for ground-truth verification" },
              { icon: Shield, title: "Multi-Party Review", desc: "Independent reviewers ensure quality before payment" },
              { icon: TrendingUp, title: "Transparent Tracking", desc: "Real-time task status and payment visibility" },
              { icon: Wallet, title: "Direct Wallet Payouts", desc: "No intermediaries — citizens get paid directly" },
              { icon: Users, title: "Role-Based Access", desc: "Citizens, sponsors, and reviewers each have clear roles" },
              { icon: CheckCircle, title: "Quality Assurance", desc: "Three-step review process ensures accuracy" },
              { icon: Award, title: "Reputation & Badges", desc: "Every graded task builds a verifiable track record citizens can show off" },
              { icon: FileCheck, title: "Auto-Generated CV", desc: "One-click, downloadable proof of civic work — skills, categories, grades" },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-civic-blue/10 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-civic-blue" />
                </div>
                <h3 className="font-semibold text-civic-slate mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Roles */}
      <section id="roles" className="py-16 px-4 bg-civic-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-civic-slate text-center mb-12">Choose Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: "Citizen", desc: "Complete civic tasks and earn rewards", color: "bg-civic-blue", icon: Users },
              { role: "Sponsor", desc: "Fund civic projects you care about — institutions welcome", color: "bg-civic-green", icon: Wallet },
              { role: "Reviewer", desc: "Ensure quality, grade submissions, and earn a review fee", color: "bg-purple-600", icon: Star },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center border border-gray-100">
                <div className={`w-12 h-12 ${r.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-civic-slate mb-1">{r.role}</h3>
                <p className="text-sm text-gray-500 mb-4">{r.desc}</p>
                <Link to="/app/register">
                  <Button variant="outline" size="sm" className="w-full">Join as {r.role}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-civic-slate mb-4">Ready to Make an Impact?</h2>
          <p className="text-gray-500 mb-8">Join thousands of Nigerians turning civic participation into meaningful rewards.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/app/register"><Button size="lg" className="bg-civic-blue hover:bg-civic-blue-dark">Create Account <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            <Link to="/app/login"><Button size="lg" variant="outline">Sign In</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-civic-slate text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="" className="h-8 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <span className="font-bold text-lg">CivicBench</span>
            </div>
            <p className="text-sm text-gray-400">Nigeria's Civic Gig Protocol. Built for impact.</p>
          </div>
          <Separator className="my-6 bg-gray-700" />
          <p className="text-xs text-gray-500 text-center">&copy; 2026 CivicBench. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
