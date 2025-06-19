import React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState } from "react"
import api from "@/api/api"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Trash } from "lucide-react"

const exerciseSchema = z.object({
  name: z.string().min(1, "Inserisci il nome dell'esercizio"),
  sets: z.coerce.number().min(1, "Minimo 1 set"),
  reps: z.coerce.number().min(1, "Minimo 1 ripetizione"),
  rest_seconds: z.coerce.number().min(0, "Recupero in secondi"),
  notes: z.string().optional(),
})

const formSchema = z.object({
  title: z.string().min(1, "Titolo richiesto"),
  client_id: z.string().min(1, "Cliente richiesto"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, "Aggiungi almeno un esercizio"),
})

export default function CreateWorkout() {

  const [clients, setClients] = useState([])

  useEffect(() => {
    api.get("/clients").then(res => {
      setClients(res.data)
    })
  }, [])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      client_id: "",
      start_date: "",
      end_date: "",
      notes: "",
      exercises: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  })

  const onSubmit = async (values) => {
    try {
      await api.post(`/workouts/`, {
        client_id: values.client_id,
        date: values.start_date,
        title: values.title,
        notes: values.notes,
        exercises: values.exercises
      })
      alert("Workout creato con successo!")
      form.reset()
    } catch (err) {
      alert(err.response?.data?.message || "Errore nella creazione del workout")
    }
  }

  return (
    <Card className="max-w-5xl mx-auto w-full">
      <CardHeader>
        <CardTitle>Crea un nuovo workout</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome workout</FormLabel>
                    <FormControl>
                      <Input placeholder="Upper body split" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((c) =>
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.user.name}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Workout</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note generali per questo workout" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Esercizi</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      name: "",
                      sets: 3,
                      reps: 10,
                      rest_seconds: 60,
                      notes: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi esercizio
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome esercizio</FormLabel>
                          <FormControl>
                            <Input placeholder="Panca piana" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.sets`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Set</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.reps`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reps</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.rest_seconds`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recupero (secondi)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`exercises.${index}.notes`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Esegui lentamente..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Rimuovi
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full mt-6">
              Salva workout
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
