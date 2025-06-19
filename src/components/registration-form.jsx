import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/api/api"

export function RegistrationForm({ className, ...props }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "client", // o "trainer"
    phone_number: "",
    gender: "male",
    birthdate: "",
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Assumiamo endpoint di registrazione /register
      const response = await api.post("/register/trainer", form)
      // Laravel dovrebbe restituire il token o un messaggio di successo
      const { token } = response.data

      if (token) {
        localStorage.setItem("auth_token", token)
        navigate("/")
      } else {
        // Registrazione riuscita, ma senza login automatico
        navigate("/login")
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registrazione fallita. Controlla i dati inseriti."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Crea il tuo account</h1>
                <p className="text-balance text-muted-foreground">
                  Registrati per usare la piattaforma
                </p>
              </div>
              {error && (
                <div className="text-red-500 text-center text-sm">{error}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Conferma password</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  value={form.password_confirmation}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Telefono</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Genere</Label>
                <select
                  id="gender"
                  name="gender"
                  className="border rounded px-2 py-1 bg-background text-foreground"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="male">Maschio</option>
                  <option value="female">Femmina</option>
                  <option value="other">Altro</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthdate">Data di nascita</Label>
                <Input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrazione..." : "Registrati"}
              </Button>
              <div className="text-center text-sm">
                Hai già un account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Cliccando continua, accetti i nostri <a href="#">Termini di Servizio</a> e <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
