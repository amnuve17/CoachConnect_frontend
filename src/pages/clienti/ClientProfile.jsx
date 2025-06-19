import React from "react"

export default function ClientProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 rounded-2xl w-full shadow bg-zinc-900">
      <h2 className="text-2xl font-bold mb-6 text-white">Profilo Cliente</h2>
      <ul className="space-y-2 text-zinc-200">
        <li>
          <span className="font-semibold text-white">Nome:</span> {user.name || "-"}
        </li>
        <li>
          <span className="font-semibold text-white">Email:</span> {user.email || "-"}
        </li>
        <li>
          <span className="font-semibold text-white">Telefono:</span> {user.phone_number || "-"}
        </li>
        <li>
          <span className="font-semibold text-white">Genere:</span> {user.gender || "-"}
        </li>
        <li>
          <span className="font-semibold text-white">Data di nascita:</span> {user.birthdate || "-"}
        </li>
      </ul>
    </div>
  )
}
