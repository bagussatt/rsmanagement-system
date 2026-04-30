"use client"

import { useEffect } from "react"
import useAuth from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  // Auto-redirect based on authentication status
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push("/dashboard")
      } else {
        // User is not authenticated, redirect to login
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // This won't be shown due to redirect, but kept as fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Redirecting...</p>
      </div>
    </div>
  )
}
