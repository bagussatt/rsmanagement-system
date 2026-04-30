"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import DashboardHeader from "./dashboard-header"

interface NurseLayoutProps {
  children: React.ReactNode
}

export default function NurseLayout({ children }: NurseLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await api.get("/api/auth/me")
      const userData = response.data

      if (userData.role !== "PERAWAT") {
        router.push("/login")
        return
      }

      setUser(userData)
    } catch (err) {
      console.error("Auth check failed:", err)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <DashboardHeader user={user} />
      {children}
    </>
  )
}
