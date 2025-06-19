import React from 'react'
import { Link } from 'react-router'

const Fallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        La pagina che cerchi non esiste.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
      >
        Torna alla Home
      </Link>
    </div>
  )
}

export default Fallback
