"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import api from "@/lib/axios"
import { cpptService } from "@/services/cppt.service"
import { medicalResumeService } from "@/services/medical-resume.service"
import { initialAssessmentService } from "@/services/initial-assessment.service"
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  FileText,
  Plus,
  Save,
  Clock,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Activity,
  AlertTriangle
} from "lucide-react"

interface Patient {
  id: string
  name: string
  medicalRecordNumber: string
  birthDate: string
  gender: string
  phone: string
  address: string
  visits: any[]
}

interface CpptEntry {
  id: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  instruction?: string
  createdAt: string
  author: {
    id: string
    name: string
    role: string
    specialization?: string
  }
  verifiedBy?: {
    id: string
    name: string
    role: string
  }
  isVerified: boolean
}

interface MedicalResume {
  id: string
  patientId: string
  authorId: string
  diagnosis: string
  mainComplaint?: string
  treatmentPlan?: string
  recommendations?: string
  notes?: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    username: string
    role: string
    specialization?: string
  }
  patient: {
    id: string
    name: string
    medicalRecordNumber: string
  }
}

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [cpptEntries, setCpptEntries] = useState<CpptEntry[]>([])
  const [medicalResumes, setMedicalResumes] = useState<MedicalResume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  // CPPT Form State
  const [showCpptForm, setShowCpptForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cpptForm, setCpptForm] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    instruction: ""
  })

  // Medical Resume Form State
  const [showResumeForm, setShowResumeForm] = useState(false)
  const [isSubmittingResume, setIsSubmittingResume] = useState(false)
  const [resumeForm, setResumeForm] = useState({
    diagnosis: "",
    mainComplaint: "",
    treatmentPlan: "",
    recommendations: "",
    notes: ""
  })

  // Initial Assessment State
  const [initialAssessment, setInitialAssessment] = useState<any>(null)
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false)

  // Tab State
  const [activeTab, setActiveTab] = useState<'assessment' | 'cppt' | 'resume'>('assessment')

  useEffect(() => {
    fetchData()
  }, [patientId])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get user profile
      const userResponse = await api.get("/api/auth/me")
      setUser(userResponse.data)

      // Get patient detail
      const patientResponse = await api.get(`/api/patients/${patientId}`)
      setPatient(patientResponse.data)

      // Get CPPT entries
      const cpptResponse = await cpptService.getPatientCppts(patientId)
      setCpptEntries(cpptResponse)

      // Get Medical Resumes
      const resumeResponse = await medicalResumeService.getPatientResumes(patientId)
      setMedicalResumes(resumeResponse)

      // Get Initial Assessment
      try {
        const assessmentResponse = await initialAssessmentService.getPatientAssessment(patientId)
        setInitialAssessment(assessmentResponse)
      } catch (err: any) {
        // Assessment might not exist yet, that's okay
        if (err.response?.status !== 404) {
          console.error("Error fetching assessment:", err)
        }
        setInitialAssessment(null)
      }

    } catch (err: any) {
      console.error("Error fetching data:", err)
      setError(err.response?.data?.message || err.message || "Failed to load patient data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitCppt = async () => {
    if (!cpptForm.subjective || !cpptForm.objective || !cpptForm.assessment || !cpptForm.plan) {
      setError("Mohon lengkapi semua field CPPT (Subjective, Objective, Assessment, Plan)")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const cpptData = {
        patientId,
        ...cpptForm
      }

      const newCppt = await cpptService.createCppt(cpptData)
      setCpptEntries([newCppt, ...cpptEntries])

      // Reset form
      setCpptForm({
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        instruction: ""
      })
      setShowCpptForm(false)

    } catch (err: any) {
      console.error("Error creating CPPT:", err)
      setError(err.response?.data?.message || err.message || "Failed to create CPPT entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitResume = async () => {
    if (!resumeForm.diagnosis) {
      setError("Mohon lengkapi diagnosis")
      return
    }

    try {
      setIsSubmittingResume(true)
      setError(null)

      const resumeData = {
        patientId,
        ...resumeForm
      }

      const newResume = await medicalResumeService.createMedicalResume(resumeData)
      setMedicalResumes([newResume, ...medicalResumes])

      // Reset form
      setResumeForm({
        diagnosis: "",
        mainComplaint: "",
        treatmentPlan: "",
        recommendations: "",
        notes: ""
      })
      setShowResumeForm(false)

    } catch (err: any) {
      console.error("Error creating medical resume:", err)
      setError(err.response?.data?.message || err.message || "Failed to create medical resume")
    } finally {
      setIsSubmittingResume(false)
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data pasien...</p>
        </div>
      </div>
    )
  }

  if (error && !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Error</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!patient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Detail Pasien</h1>
                <p className="text-slate-600">Rekam Medis & CPPT</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-2xl">
                    {patient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
                  <p className="text-slate-600">{calculateAge(patient.birthDate)} tahun • {patient.gender}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">No. Rekam Medis</p>
                <p className="text-lg font-bold text-slate-900">{patient.medicalRecordNumber}</p>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600">Telepon</p>
                <p className="font-medium text-slate-900">{patient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600">Tanggal Lahir</p>
                <p className="font-medium text-slate-900">
                  {new Date(patient.birthDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600">Alamat</p>
                <p className="font-medium text-slate-900">{patient.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add CPPT Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'assessment'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Asesmen Awal
            </button>
            <button
              onClick={() => setActiveTab('cppt')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'cppt'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              CPPT
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'resume'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Resume Medis
            </button>
          </div>
          {activeTab === 'assessment' ? (
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Asesmen Awal Pasien</h3>
                <p className="text-slate-600 text-sm">Dokumen asesmen awal perawat</p>
              </div>
            </div>
          ) : activeTab === 'cppt' ? (
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Catatan Medis (CPPT)</h3>
                <p className="text-slate-600 text-sm">{cpptEntries.length} catatan</p>
              </div>
              {(user?.role === "DOKTER" || user?.role === "PERAWAT" || user?.role === "BIDAN") && (
                <button
                  onClick={() => setShowCpptForm(!showCpptForm)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  {showCpptForm ? (
                    <>Batal</>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Tambah CPPT
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Resume Medis</h3>
                <p className="text-slate-600 text-sm">{medicalResumes.length} resume</p>
              </div>
              {(user?.role === "DOKTER" || user?.role === "PERAWAT" || user?.role === "BIDAN") && (
                <button
                  onClick={() => setShowResumeForm(!showResumeForm)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  {showResumeForm ? (
                    <>Batal</>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Tambah Resume
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* CPPT Form */}
        {activeTab === 'cppt' && showCpptForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
            <div className="p-6 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-1">Tambah Catatan CPPT Baru</h4>
              <p className="text-slate-600 text-sm">Isi formulir CPPT dengan lengkap dan akurat</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Subjective */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subjective (S) - Keluhan Pasien
                </label>
                <textarea
                  value={cpptForm.subjective}
                  onChange={(e) => setCpptForm({...cpptForm, subjective: e.target.value})}
                  placeholder="Keluhan utama pasien, riwayat penyakit, gejala yang dirasakan..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Objective */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Objective (O) - Hasil Pemeriksaan
                </label>
                <textarea
                  value={cpptForm.objective}
                  onChange={(e) => setCpptForm({...cpptForm, objective: e.target.value})}
                  placeholder="Hasil pemeriksaan fisik, vital signs, hasil lab..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Assessment */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assessment (A) - Diagnosa
                </label>
                <textarea
                  value={cpptForm.assessment}
                  onChange={(e) => setCpptForm({...cpptForm, assessment: e.target.value})}
                  placeholder="Diagnosa kerja, diagnosa banding..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Plan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Plan (P) - Rencana Pengobatan
                </label>
                <textarea
                  value={cpptForm.plan}
                  onChange={(e) => setCpptForm({...cpptForm, plan: e.target.value})}
                  placeholder="Rencana terapi, obat-obatan, tindakan, edukasi..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Instruction */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Instruksi Tambahan (Opsional)
                </label>
                <textarea
                  value={cpptForm.instruction}
                  onChange={(e) => setCpptForm({...cpptForm, instruction: e.target.value})}
                  placeholder="Instruksi khusus untuk pasien atau tim medis lainnya..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitCppt}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan CPPT
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCpptForm(false)
                    setCpptForm({
                      subjective: "",
                      objective: "",
                      assessment: "",
                      plan: "",
                      instruction: ""
                    })
                  }}
                  className="px-6 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Medical Resume Form */}
        {activeTab === 'resume' && showResumeForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
            <div className="p-6 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-1">Buat Resume Medis Baru</h4>
              <p className="text-slate-600 text-sm">Isi ringkasan medis pasien dengan lengkap</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  value={resumeForm.diagnosis}
                  onChange={(e) => setResumeForm({...resumeForm, diagnosis: e.target.value})}
                  placeholder="Diagnosa utama dan diagnosa banding..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Main Complaint */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Keluhan Utama
                </label>
                <textarea
                  value={resumeForm.mainComplaint}
                  onChange={(e) => setResumeForm({...resumeForm, mainComplaint: e.target.value})}
                  placeholder="Keluhan utama pasien saat ini..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Treatment Plan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rencana Pengobatan
                </label>
                <textarea
                  value={resumeForm.treatmentPlan}
                  onChange={(e) => setResumeForm({...resumeForm, treatmentPlan: e.target.value})}
                  placeholder="Rencana pengobatan dan tindakan medis..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Recommendations */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rekomendasi
                </label>
                <textarea
                  value={resumeForm.recommendations}
                  onChange={(e) => setResumeForm({...resumeForm, recommendations: e.target.value})}
                  placeholder="Rekomendasi untuk pasien..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  value={resumeForm.notes}
                  onChange={(e) => setResumeForm({...resumeForm, notes: e.target.value})}
                  placeholder="Catatan tambahan yang perlu diperhatikan..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitResume}
                  disabled={isSubmittingResume}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmittingResume ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Resume
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowResumeForm(false)
                    setResumeForm({
                      diagnosis: "",
                      mainComplaint: "",
                      treatmentPlan: "",
                      recommendations: "",
                      notes: ""
                    })
                  }}
                  className="px-6 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Initial Assessment Display - Show when Assessment tab is active */}
        {activeTab === 'assessment' && (
          <div className="space-y-6">
            {!initialAssessment ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Belum ada asesmen awal</p>
                <p className="text-slate-500 text-sm mt-1">Asesmen awal pasien belum diisi oleh perawat</p>
              </div>
            ) : (
              <>
                {/* Assessment Info Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Dibuat oleh</p>
                      <p className="font-semibold text-slate-900">{initialAssessment.nurse?.name || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Tanggal</p>
                      <p className="font-semibold text-slate-900">{new Date(initialAssessment.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                {/* Anamnesis Section - Blue */}
                <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Anamnesis (Data Subjektif)
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Keluhan Utama</label>
                        <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg">{initialAssessment.chiefComplaint || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Skala Nyeri</label>
                        <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg">{initialAssessment.painScale || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Riwayat Penyakit Sekarang</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.currentIllnessHistory || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Riwayat Penyakit Dahulu</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.pastMedicalHistory || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Alergi</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.allergies || "Tidak ada alergi yang diketahui"}</p>
                    </div>
                  </div>
                </div>

                {/* Physical Exam Section - Green */}
                <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Pemeriksaan Fisik (Data Objektif)
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Tekanan Darah</label>
                        <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg text-center font-semibold">{initialAssessment.bloodPressure || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Suhu</label>
                        <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg text-center font-semibold">{initialAssessment.temperature || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Nadi</label>
                        <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg text-center font-semibold">{initialAssessment.pulse || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Pernapasan</label>
                        <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg text-center font-semibold">{initialAssessment.respiration || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">SpO2</label>
                        <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg text-center font-semibold">{initialAssessment.spO2 || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Pemeriksaan Head to Toe</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.headToToeExam || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Functional Screening Section - Yellow */}
                <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Skrining Fungsional & Risiko
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Risiko Jatuh</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg">{initialAssessment.fallRisk || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Status Nutrisi</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.nutritionalStatus || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Asesmen Fungsional</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.functionalAssessment || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Medical Assessment Section - Purple */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Asesmen Medis & Keperawatan
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Diagnosa Awal</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.initialDiagnosis || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Perencanaan Keperawatan</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.nursingPlanning || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Specifics Section - Orange */}
                <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">Tambahan Spesifik</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Edukasi Pasien</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.patientEducation || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Kebutuhan Komunikasi</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg">{initialAssessment.communicationNeeds || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Riwayat Sosioekonomi</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{initialAssessment.socioeconomicHistory || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Kategori Triage</label>
                      <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg font-semibold">{initialAssessment.triageCategory || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Review Section */}
                {user?.role === 'DOKTER' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <h3 className="text-lg font-bold text-white">Review Dokter</h3>
                    </div>
                    <div className="p-6">
                      {initialAssessment.doctorNotes ? (
                        <div>
                          <label className="text-xs font-semibold text-slate-600 uppercase">Catatan Dokter</label>
                          <p className="text-slate-900 mt-1 bg-blue-50 p-3 rounded-lg border border-blue-200 whitespace-pre-wrap">{initialAssessment.doctorNotes}</p>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">Belum ada catatan review dari dokter</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CPPT History - Show when CPPT tab is active */}
        {activeTab === 'cppt' && (
          <div className="space-y-4">
            {cpptEntries.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Belum ada catatan CPPT</p>
                <p className="text-slate-500 text-sm mt-1">Mulai dengan menambahkan catatan medis pertama</p>
              </div>
            ) : (
              cpptEntries.map((cppt) => (
                <div key={cppt.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* CPPT Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">{cppt.author.name}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              cppt.author.role === "DOKTER" ? 'bg-blue-100 text-blue-700' :
                              cppt.author.role === "PERAWAT" ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {cppt.author.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(cppt.createdAt)}
                          </div>
                        </div>
                      </div>
                      {cppt.isVerified && cppt.verifiedBy && (
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">Terverifikasi oleh {cppt.verifiedBy.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CPPT Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Subjective */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">S</span>
                          <h5 className="font-semibold text-slate-900">Subjective</h5>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{cppt.subjective}</p>
                      </div>

                      {/* Objective */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">O</span>
                          <h5 className="font-semibold text-slate-900">Objective</h5>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{cppt.objective}</p>
                      </div>

                      {/* Assessment */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">A</span>
                          <h5 className="font-semibold text-slate-900">Assessment</h5>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{cppt.assessment}</p>
                      </div>

                      {/* Plan */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">P</span>
                          <h5 className="font-semibold text-slate-900">Plan</h5>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{cppt.plan}</p>
                      </div>
                    </div>

                    {/* Instruction */}
                    {cppt.instruction && (
                      <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <h5 className="font-semibold text-amber-900 mb-2">Instruksi Tambahan</h5>
                        <p className="text-amber-800 text-sm">{cppt.instruction}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Medical Resume History - Show when Resume tab is active */}
        {activeTab === 'resume' && (
          <div className="space-y-4">
            {medicalResumes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Belum ada resume medis</p>
                <p className="text-slate-500 text-sm mt-1">Mulai dengan membuat resume medis pertama</p>
              </div>
            ) : (
              medicalResumes.map((resume) => (
                <div key={resume.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* Resume Header */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                          <ClipboardList className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">{resume.author.name}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              resume.author.role === "DOKTER" ? 'bg-blue-100 text-blue-700' :
                              resume.author.role === "PERAWAT" ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {resume.author.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(resume.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume Content */}
                  <div className="p-6 space-y-4">
                    {/* Diagnosis */}
                    <div>
                      <h5 className="font-semibold text-slate-900 mb-2">Diagnosis</h5>
                      <p className="text-slate-700 text-sm bg-slate-50 p-4 rounded-xl whitespace-pre-wrap">{resume.diagnosis}</p>
                    </div>

                    {/* Main Complaint */}
                    {resume.mainComplaint && (
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2">Keluhan Utama</h5>
                        <p className="text-slate-700 text-sm bg-slate-50 p-4 rounded-xl whitespace-pre-wrap">{resume.mainComplaint}</p>
                      </div>
                    )}

                    {/* Treatment Plan */}
                    {resume.treatmentPlan && (
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2">Rencana Pengobatan</h5>
                        <p className="text-slate-700 text-sm bg-slate-50 p-4 rounded-xl whitespace-pre-wrap">{resume.treatmentPlan}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {resume.recommendations && (
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2">Rekomendasi</h5>
                        <p className="text-slate-700 text-sm bg-blue-50 p-4 rounded-xl border border-blue-200 whitespace-pre-wrap">{resume.recommendations}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {resume.notes && (
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2">Catatan Tambahan</h5>
                        <p className="text-slate-700 text-sm bg-amber-50 p-4 rounded-xl border border-amber-200 whitespace-pre-wrap">{resume.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}