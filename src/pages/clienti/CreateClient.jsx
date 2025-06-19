import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import api from "@/api/api"

const formSchema = z
  .object({
    name: z.string().min(1, "Il nome è obbligatorio").max(255, "Massimo 255 caratteri"),
    email: z.string().email("Email non valida"),
    password: z.string().min(6, "Minimo 6 caratteri"),
    password_confirmation: z.string(),
    phone_number: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    birthdate: z.string().optional(), // possiamo validare ulteriormente se vuoi
    goal: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Le password non coincidono",
    path: ["password_confirmation"],
  })

export default function CreateClient() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_number: "",
      gender: "",
      birthdate: "",
      goal: "",
      notes: "",
    },
  })

  const onSubmit = async (values) => {
    try {
      // Invia direttamente tutti i dati a /clients
      await api.post("/clients", values);
  
      alert("Cliente creato con successo!");
      form.reset();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Errore durante la creazione del cliente."
      );
    }
  }


  return (
    <Card className="max-w-5xl mx-auto w-full">
      <CardHeader>
        <CardTitle>Crea un nuovo cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@esempio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Minimo 6 caratteri" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conferma password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Ripeti la password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero di telefono</FormLabel>
                  <FormControl>
                    <Input placeholder="+39 333..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genere</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona il genere" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Maschio</SelectItem>
                      <SelectItem value="female">Femmina</SelectItem>
                      <SelectItem value="other">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di nascita</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obiettivo</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dimagrimento, forza, tono muscolare..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note aggiuntive</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note mediche o altre info" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Salva cliente
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
