"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SimpleDashboard() {
  const router = useRouter()
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log("Token:", token ? "exists" : "missing")

    if (!token) {
      setMessage("No token found, redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    } else {
      setMessage("Token found! Dashboard loaded successfully.")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Simple Dashboard Test</h1>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="space-y-2">
          <button
            onClick={() => console.log("User data:", localStorage.getItem("token"))}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            Log User Data to Console
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}