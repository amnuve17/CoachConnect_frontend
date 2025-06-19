import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Pencil, X, Save } from "lucide-react"
import api from "@/api/api"

export default function ManageWorkouts() {
  const [workouts, setWorkouts] = useState([])
  const [editMode, setEditMode] = useState({})
  const [editedData, setEditedData] = useState({})
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  async function fetchWorkouts() {
    try {
      // Chiamata GET per prendere tutti i workout del trainer loggato
      const res = await api.get("/workouts")
      // Optional: aggiungi nome cliente se non è già incluso
      setWorkouts(res.data)
    } catch (err) {
      alert("Errore nel caricamento dei workout")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: true }))
    const workout = workouts.find((w) => w.id === id)
    setEditedData((prev) => ({ ...prev, [id]: { ...workout } }))
  }

  const handleCancel = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: false }))
    setEditedData((prev) => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  const handleSave = async (id) => {
    try {
      // Update backend
      await api.put(`/workouts/${id}`, editedData[id])
      // Aggiorna frontend
      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? editedData[id] : w))
      )
      setEditMode((prev) => ({ ...prev, [id]: false }))
    } catch (err) {
      alert("Errore nel salvataggio delle modifiche")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo workout?")) return
    try {
      await api.delete(`/workouts/${id}`)
      setWorkouts((prev) => prev.filter((w) => w.id !== id))
    } catch (err) {
      alert("Errore nell'eliminazione")
    }
  }

  const handleFieldChange = (id, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  if (loading) return <div className="p-6">Caricamento workout...</div>

  return (
    <div className="grid gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Gestione Workout</h2>
        <Input
          placeholder="Cerca per nome workout o cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-80"
        />
      </div>
      <div className="flex flex-wrap justify-between">
        {workouts
          .filter((w) => {
            const q = search.toLowerCase()
            // Per nome client se client_name incluso, oppure client_id
            return (
              w.title?.toLowerCase().includes(q) ||
              w.client_name?.toLowerCase().includes(q) // assicurati che il nome sia nel dato!
            )
          })
          .map((workout) => {
            const isEditing = editMode[workout.id]
            const data = isEditing ? editedData[workout.id] : workout

            return (
              <Card className="lg:w-[49%] w-full mb-5" key={workout.id}>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-xl">
                    {isEditing ? (
                      <Input
                        value={data.title}
                        onChange={(e) =>
                          handleFieldChange(workout.id, "title", e.target.value)
                        }
                      />
                    ) : (
                      data.title
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleSave(workout.id)}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancel(workout.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(workout.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(workout.id)}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>Cliente:</strong>{" "}
                    {isEditing ? (
                      <Input
                        value={data.client_name || ""}
                        onChange={(e) =>
                          handleFieldChange(workout.id, "client_name", e.target.value)
                        }
                      />
                    ) : (
                      data.client_name
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Data:</strong>{" "}
                      {isEditing ? (
                        <Input
                          type="date"
                          value={data.start_date || data.date || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              workout.id,
                              "start_date",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        data.start_date || data.date
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>Note:</strong>{" "}
                    {isEditing ? (
                      <Textarea
                        value={data.notes}
                        onChange={(e) =>
                          handleFieldChange(workout.id, "notes", e.target.value)
                        }
                      />
                    ) : (
                      data.notes
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
