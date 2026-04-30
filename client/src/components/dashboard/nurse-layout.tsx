"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { LogOut, User, LogOutIcon } from "lucide-react"
import { showConfirmAlert } from "@/lib/sweetalert"

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

  const handleLogout = async () => {
    const result = await showConfirmAlert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      'Ya, Keluar',
      'Batal'
    )

    if (result.isConfirmed) {
      localStorage.removeItem("token")
      router.push("/login")
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-600">{user.role} {user.specialization ? `• ${user.specialization}` : ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>

      {children}
    </>
  )
}
