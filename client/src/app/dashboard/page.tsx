"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Users, Activity } from "lucide-react"

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No token found")
        router.push("/login")
        return
      }

      // Get user profile
      const userResponse = await api.get("/api/auth/me")
      console.log("User profile:", userResponse.data)
      const userData = userResponse.data
      setUser(userData)

      // Redirect based on role
      if (userData.role === "PERAWAT") {
        router.push("/dashboard/nurse")
        return
      } else if (userData.role === "ADMIN") {
        // Admin can stay on main dashboard or redirect to admin dashboard
        // For now, let admin access the main dashboard
      } else if (userData.role !== "DOKTER") {
        setError(`Access denied. Role: ${userData.role}`)
        setTimeout(() => router.push("/login"), 3000)
        return
      }

      // Get patients (for DOKTER and ADMIN)
      const patientsResponse = await api.get("/api/patients")
      console.log("Patients:", patientsResponse.data)
      setPatients(patientsResponse.data)

    } catch (err: any) {
      console.error("Error:", err)
      // Handle JSON parsing errors or other API errors
      if (err.message.includes("Unexpected token")) {
        setError("API Error: Unable to connect to server")
      } else {
        setError(err.response?.data?.message || err.message || "Unknown error")
      }
      // Don't immediately redirect on error, let user see the error message
      setTimeout(() => router.push("/login"), 5000)
    } finally {
      setIsLoading(false)
    }
  }

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Error</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Unified Header */}
      <DashboardHeader
        title={user?.role === "ADMIN" ? "Dashboard Admin" : "Dashboard Dokter"}
        subtitle={`Welcome, ${user?.name || user?.username}! ${user?.role === "DOKTER" ? "(Pasien Anda Sendiri)" : "(Semua Pasien)"}`}
        user={user}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Pasien</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{patients.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pasien Aktif</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {patients.filter(p => p.visits && p.visits.length > 0).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rawat Inap</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {patients.filter(p => p.visits && p.visits.some((v: any) => v.status === "RAWAT_INAP")).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Daftar Pasien</h2>
            <p className="text-slate-600 text-sm mt-1">
              Menampilkan {patients.length} pasien
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No. RM</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Telepon</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {patient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-blue-600 hover:text-blue-800">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{patient.medicalRecordNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{patient.gender}</td>
                    <td className="px-6 py-4 text-slate-600">{patient.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.visits && patient.visits.some((v: any) => v.status === "RAWAT_INAP")
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {patient.visits && patient.visits.some((v: any) => v.status === "RAWAT_INAP") ? 'Rawat Inap' : 'Sehat'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}