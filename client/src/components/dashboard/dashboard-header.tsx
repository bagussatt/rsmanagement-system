"use client"

import { useRouter } from "next/navigation"
import { User, LogOut, Menu, Home } from "lucide-react"
import { showConfirmAlert } from "@/lib/sweetalert"

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  user?: {
    name: string
    role: string
    specialization?: string
  }
}

export default function DashboardHeader({
  title,
  subtitle,
  showBackButton = false,
  backUrl,
  user
}: DashboardHeaderProps) {
  const router = useRouter()

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

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  return (
    <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Back Button + Title */}
          <div className="flex items-center gap-4 flex-1">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Kembali"
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </button>
            )}
            <div>
              {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
              {subtitle && <p className="text-slate-600">{subtitle}</p>}
            </div>
          </div>

          {/* Right Section: User Info + Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-right">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-600">
                  {user.role} {user.specialization ? `• ${user.specialization}` : ''}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
