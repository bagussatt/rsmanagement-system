"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { patientService } from "@/services/patient.service"
import NurseLayout from "@/components/dashboard/nurse-layout"
import {
  ArrowRight,
  UserPlus,
  Users,
  Calendar,
  Clock,
  Activity,
  TrendingUp
} from "lucide-react"

interface Patient {
  id: string
  name: string
  medicalRecordNumber: string
  birthDate: string
  gender: string
  phone: string
  address: string
  createdAt: string
  doctor?: {
    id: string
    name: string
    specialization: string
  }
  visits?: any[]
}

export default function NurseDashboardPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get all patients
      const patientsData = await patientService.getAllPatients()
      setPatients(patientsData)

    } catch (err: any) {
      console.error("Error fetching data:", err)
      setError(err.response?.data?.message || err.message || "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  if (isLoading) {
    return (
      <NurseLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Memuat data...</p>
          </div>
        </div>
      </NurseLayout>
    )
  }

  return (
    <NurseLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Perawat</h1>
                <p className="text-slate-600">Kelola data pasien dan catatan medis</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Dashboard Utama
                </button>
                <button
                  onClick={() => router.push("/dashboard/nurse/new-patient")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <UserPlus className="h-5 w-5" />
                  Pasien Baru
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Pasien</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{patients.length}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pasien Hari Ini</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {patients.filter(p => {
                      const today = new Date().toDateString()
                      const createdDate = new Date(p.createdAt).toDateString()
                      return today === createdDate
                    }).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Dokter Aktif</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {new Set(patients.map(p => p.doctor?.id).filter(Boolean)).size}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Kunjungan Aktif</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {patients.filter(p => p.visits && p.visits.length > 0).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Daftar Pasien</h2>
              <p className="text-slate-600 text-sm">Semua pasien yang terdaftar dalam sistem</p>
            </div>

            {patients.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Belum ada data pasien</p>
                <p className="text-slate-500 text-sm mt-1">Mulai dengan menambahkan pasien baru</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">No. RM</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Nama Pasien</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Usia/Gender</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Dokter</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Tanggal Daftar</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-blue-600">{patient.medicalRecordNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{patient.name}</div>
                          {patient.phone && (
                            <div className="text-sm text-slate-600">{patient.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">{calculateAge(patient.birthDate)} tahun</div>
                          <div className="text-sm text-slate-600">{patient.gender}</div>
                        </td>
                        <td className="px-6 py-4">
                          {patient.doctor ? (
                            <div>
                              <div className="text-sm font-medium text-slate-900">{patient.doctor.name}</div>
                              <div className="text-xs text-slate-600">{patient.doctor.specialization || 'Dokter Umum'}</div>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-500">Belum ada dokter</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            {formatDate(patient.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                          >
                            Lihat Detail
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </NurseLayout>
  )
}
