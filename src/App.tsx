import { Routes, Route } from "react-router"
import LandingPage from "./pages/landing"
import { AppLayout } from "./pages/app/AppLayout"
import { AppDashboard } from "./pages/app/Dashboard"
import { AppLogin } from "./pages/app/Login"
import { AppRegister } from "./pages/app/Register"
import { AppTasks } from "./pages/app/Tasks"
import { AppTaskDetail } from "./pages/app/TaskDetail"
import { AppCreateTask } from "./pages/app/CreateTask"
import { AppSubmissions } from "./pages/app/Submissions"
import { AppReviews } from "./pages/app/Reviews"
import { AppWallet } from "./pages/app/Wallet"
import { AppProfile } from "./pages/app/Profile"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<AppDashboard />} />
        <Route path="login" element={<AppLogin />} />
        <Route path="register" element={<AppRegister />} />
        <Route path="tasks" element={<AppTasks />} />
        <Route path="tasks/:id" element={<AppTaskDetail />} />
        <Route path="tasks/create" element={<AppCreateTask />} />
        <Route path="submissions" element={<AppSubmissions />} />
        <Route path="reviews" element={<AppReviews />} />
        <Route path="wallet" element={<AppWallet />} />
        <Route path="profile" element={<AppProfile />} />
        <Route path="profile/:id" element={<AppProfile />} />
      </Route>
    </Routes>
  )
}
