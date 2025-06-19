import { useEffect, useState } from "react"

export default function DashboardHome() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  )

  useEffect(() => {
    function handleStorage() {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"))
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full py-10 gap-6">
      <img
        src="/coachconnect_logo.webp"
        alt="Logo App"
        className="w-24 h-24 mb-2"
      />
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">
          Benvenuto, {user.name || "Utente"}!
        </h1>
        <p className="text-muted-foreground">
          <span className="font-semibold">{user.email}</span>
        </p>
      </div>
    </div>
  )
}
