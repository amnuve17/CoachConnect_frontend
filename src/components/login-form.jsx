import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/api/api"

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Chiamata alla login API
      const response = await api.post("/login", {
        email,
        password
      })
  
      const { token, user } = response.data
  
      // Salva token e utente in localStorage
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))
  
      // Redirect alla dashboard in base al ruolo
      if (user.role === "trainer") {
        navigate("/dashboard/trainer")
      } else if (user.role === "client") {
        navigate("/dashboard/client")
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login fallita. Controlla le credenziali."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bentornato!</h1>
                <p className="text-balance text-muted-foreground">
                  Accedi al tuo account CoachConnect
                </p>
              </div>
              {error && (
                <div className="text-red-500 text-center text-sm">{error}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Login..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Vuoi diventare un trainer?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Registrati
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="coachconnect_logo.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      Cliccando su continua, accetti i nostri <a href="#">Termini di Servizio</a> e la nostra <a href="#">Informativa sulla Privacy</a>.
      </div>
    </div>
  )
}
