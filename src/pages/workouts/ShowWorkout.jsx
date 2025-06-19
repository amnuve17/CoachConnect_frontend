import React, { useEffect, useState } from "react"
import api from "@/api/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const ShowWorkout = () => {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/workouts")
      .then(res => setWorkouts(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Caricamento workout...</div>

  if (workouts.length === 0)
    return <div className="p-6">Nessun workout disponibile.</div>

  return (
    <div className="grid gap-6 max-w-4xl mx-auto w-full">
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <CardHeader>
            <CardTitle>{workout.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {workout.date} — {workout.client_name}
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <strong>Note:</strong> {workout.notes || "-"}
            </div>
            <div className="mt-2">
              <strong>Esercizi:</strong>
              {workout.exercises && workout.exercises.length > 0 ? (
                <ul className="list-disc ml-6 mt-2">
                  {workout.exercises.map((ex) => (
                    <li key={ex.id}>
                      <div>
                        <span className="font-medium">{ex.name}</span> — {ex.sets}x{ex.reps}{" "}
                        {ex.rest_seconds ? `— Recupero: ${ex.rest_seconds}s` : ""}
                        {ex.notes ? <div className="text-xs italic">Note: {ex.notes}</div> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground">Nessun esercizio.</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ShowWorkout
