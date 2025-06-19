import { useEffect, useState } from "react"
import api from "@/api/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, X } from "lucide-react"

export default function ManageClient() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState("")
  const [editingClient, setEditingClient] = useState(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    gender: "",
    birthdate: "",
    goal: "",
    notes: ""
  })

  // 1. Carica clienti all'avvio
  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const res = await api.get("/clients")
      // res.data è un array di client, ognuno con client.user (vedi backend)
      // Per semplicità, fondi dati user+client
      const flatClients = res.data.map(c => ({
        id: c.id,
        name: c.user.name,
        email: c.user.email,
        phone_number: c.user.phone_number,
        gender: c.user.gender,
        birthdate: c.user.birthdate,
        goal: c.goal,
        notes: c.notes
      }))
      setClients(flatClients)
    } catch (err) {
      console.error(err)
      alert("Errore nel caricamento dei clienti.")
    }
  }

  function handleEditClick(client) {
    setEditingClient(client.id)
    setForm({ ...client, password: "", password_confirmation: "" })
  }

  async function handleSave(id) {
    try {
      // aggiorna solo i dati che possono essere modificati
      const updatePayload = {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number,
        gender: form.gender,
        birthdate: form.birthdate,
        goal: form.goal,
        notes: form.notes,
      }
      // password solo se valorizzata!
      if (form.password) {
        updatePayload.password = form.password
        updatePayload.password_confirmation = form.password_confirmation
      }
      await api.put(`/clients/${id}`, updatePayload)
      // aggiorna la lista
      await fetchClients()
      setEditingClient(null)
    } catch (err) {
      console.error(err)
      alert("Errore durante il salvataggio.")
    }
  }

  async function handleDelete(id) {
    if (!confirm("Sei sicuro di voler eliminare questo cliente?")) return
    try {
      await api.delete(`/clients/${id}`)
      setClients(clients.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
      alert("Errore durante l'eliminazione.")
    }
  }

  // RENDER invariato rispetto a prima
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 pb-2">
        <h2 className="text-2xl font-bold">Gestione Clienti</h2>
        <Input
          placeholder="Cerca per nome o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-80"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {clients
          .filter((client) => {
            const q = search.toLowerCase()
            return (
              (client.name && client.name.toLowerCase().includes(q)) ||
              (client.email && client.email.toLowerCase().includes(q))
            )
          })
          .map((client) => (
            <Card key={client.id}>
              <CardContent className="p-4 space-y-2">
                {editingClient === client.id ? (
                  <>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" />
                    <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                    <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" />
                    <Input value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} placeholder="Conferma Password" type="password" />
                    <Input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} placeholder="Telefono" />
                    <Input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} placeholder="Genere" />
                    <Input value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} placeholder="Data di nascita" type="date" />
                    <Input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Obiettivo" />
                    <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Note" />
                    <Button onClick={() => handleSave(client.id)}>Salva</Button>
                  </>
                ) : (
                  <>
                    <p><strong>Nome:</strong> {client.name}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                    <p><strong>Telefono:</strong> {client.phone_number || "-"}</p>
                    <p><strong>Genere:</strong> {client.gender || "-"}</p>
                    <p><strong>Data di nascita:</strong> {client.birthdate || "-"}</p>
                    <p><strong>Obiettivo:</strong> {client.goal || "-"}</p>
                    <p><strong>Note:</strong> {client.notes || "-"}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleEditClick(client)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(client.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  )
}
