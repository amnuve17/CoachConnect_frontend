import { createBrowserRouter } from "react-router-dom"
import DashboardHome from "@/pages/DashboardHome"
import CreateClient from "./pages/clienti/CreateClient"
import ManageClient from "./pages/clienti/ManageClient"
import CreateWorkout from "./pages/workouts/CreateWorkout"
import ManageWorkouts from "./pages/workouts/ManageWorkout"
import LoginPage from "./pages/auth/LoginPage"
import RegistrationPage from "./pages/auth/RegistrationPage"
import ProtectedRoute from "@/components/ProtectedRoute"
import TrainerDashboardLayout from "@/layouts/TrainerDashboardLayout"
import ClientDashboardLayout from "@/layouts/ClientDashboardLayout"
import ShowWorkout from "./pages/workouts/ShowWorkout"
import ClientProfile from "./pages/clienti/ClientProfile"
import Fallback from "./pages/Fallback"

export const router = createBrowserRouter([
  // Trainer Dashboard
  {
    path: "/dashboard/trainer",
    element: (
      <ProtectedRoute requiredRole="trainer">
        <TrainerDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <DashboardHome /> },
      { path: "crea-cliente", element: <CreateClient /> },
      { path: "gestisci-clienti", element: <ManageClient /> },
      { path: "crea-scheda", element: <CreateWorkout /> },
      { path: "gestisci-schede", element: <ManageWorkouts /> },
    ],
  },
  // Client Dashboard
  {
    path: "/dashboard/client",
    element: (
      <ProtectedRoute requiredRole="client">
        <ClientDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <DashboardHome /> },
      {path: "workouts", element: <ShowWorkout />},
      {path: "client-profile", element: <ClientProfile />}
    ],
  },
  // Login/Register (pubbliche)
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegistrationPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div /> {/* Questo non verrà mai mostrato, serve solo per triggerare il redirect */}
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Fallback /> }
])
