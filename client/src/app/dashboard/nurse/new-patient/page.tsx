"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { patientService } from "@/services/patient.service"
import { initialAssessmentService } from "@/services/initial-assessment.service"
import NurseLayout from "@/components/dashboard/nurse-layout"
import api from "@/lib/axios"
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from "@/lib/sweetalert"
import { ArrowLeft, Save, User, Phone, Calendar, MapPin, Stethoscope } from "lucide-react"

export default function NewPatientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [doctors, setDoctors] = useState<any[]>([])

  const [formData, setFormData] = useState({
    // Patient Identity
    medicalRecordNumber: "",
    name: "",
    birthDate: "",
    gender: "",
    phone: "",
    address: "",
    doctorId: "",

    // Anamnesis (Data Subjektif)
    chiefComplaint: "",
    painScale: "",
    currentIllnessHistory: "",
    pastMedicalHistory: "",
    allergies: "",

    // Pemeriksaan Fisik (Data Objektif)
    bloodPressure: "",
    temperature: "",
    pulse: "",
    respiration: "",
    spO2: "",
    headToToeExam: "",

    // Skrining Fungsional & Risiko
    fallRisk: "",
    nutritionalStatus: "",
    functionalAssessment: "",

    // Asesmen Medis & Keperawatan
    initialDiagnosis: "",
    nursingPlanning: "",
    doctorNotes: "",

    // Tambahan Spesifik
    patientEducation: "",
    communicationNeeds: "",
    socioeconomicHistory: "",

    // Triage
    triageCategory: "",
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      // Fetch all doctors directly from user endpoint
      const response = await api.get("/api/auth/users?role=DOKTER")

      // Filter users with role DOKTER
      const doctors = response.data.filter((user: any) => user.role === "DOKTER")

      setDoctors(doctors)
    } catch (err) {
      console.error("Error fetching doctors:", err)
      // If the endpoint doesn't exist, try alternative approach
      try {
        // Fallback: get from patients and extract unique doctors
        const patients = await patientService.getAllPatients()
        const uniqueDoctors = patients
          .map((p: any) => p.doctor)
          .filter(Boolean)
          .filter((doctor: any, index: number, self: any[]) =>
            index === self.findIndex(d => d?.id === doctor?.id)
          )
        setDoctors(uniqueDoctors)
      } catch (fallbackErr) {
        console.error("Error fetching doctors from patients:", fallbackErr)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.medicalRecordNumber || !formData.name || !formData.birthDate || !formData.gender) {
      await showErrorAlert('Validasi Gagal', 'Mohon lengkapi semua field yang wajib diisi')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      showLoadingAlert('Mendaftarkan Pasien...')

      // Step 1: Create patient with basic information only
      const patientData = {
        medicalRecordNumber: formData.medicalRecordNumber,
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone || null,
        address: formData.address || null,
        doctorId: formData.doctorId || null,
      }

      const newPatient = await patientService.createPatient(patientData)

      // Step 2: Create initial assessment separately
      const assessmentData = {
        chiefComplaint: formData.chiefComplaint || null,
        painScale: formData.painScale || null,
        currentIllnessHistory: formData.currentIllnessHistory || null,
        pastMedicalHistory: formData.pastMedicalHistory || null,
        allergies: formData.allergies || null,
        bloodPressure: formData.bloodPressure || null,
        temperature: formData.temperature || null,
        pulse: formData.pulse || null,
        respiration: formData.respiration || null,
        spO2: formData.spO2 || null,
        headToToeExam: formData.headToToeExam || null,
        fallRisk: formData.fallRisk || null,
        nutritionalStatus: formData.nutritionalStatus || null,
        functionalAssessment: formData.functionalAssessment || null,
        initialDiagnosis: formData.initialDiagnosis || null,
        nursingPlanning: formData.nursingPlanning || null,
        patientEducation: formData.patientEducation || null,
        communicationNeeds: formData.communicationNeeds || null,
        socioeconomicHistory: formData.socioeconomicHistory || null,
        triageCategory: formData.triageCategory || null,
      }

      await initialAssessmentService.createInitialAssessment(newPatient.id, assessmentData)

      closeAlert()

      // Show success alert
      await showSuccessAlert('Pasien Berhasil Didaftarkan', 'Data pasien dan asesmen awal telah berhasil disimpan')

      // Redirect to nurse dashboard
      router.push("/dashboard/nurse")

    } catch (err: any) {
      console.error("Error creating patient:", err)
      closeAlert()
      const errorMessage = err.response?.data?.message || err.message || "Failed to create patient"
      await showErrorAlert('Gagal Mendaftarkan Pasien', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <NurseLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/nurse")}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Registrasi Pasien Baru</h1>
                <p className="text-slate-600">Isi data pasien dan assessment awal dengan lengkap</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Data Pasien</h2>
              <p className="text-slate-600 text-sm">Informasi pribadi dan medis pasien</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Medical Record Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  No. Rekam Medis *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.medicalRecordNumber}
                    onChange={(e) => setFormData({...formData, medicalRecordNumber: e.target.value})}
                    placeholder="Contoh: RM-2024-001"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nama lengkap pasien"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Birth Date and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tanggal Lahir *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  No. Telepon
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Contoh: 08123456789"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Alamat
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-start pointer-events-none pt-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Alamat lengkap pasien"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Doctor Assignment */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dokter Penanggung Jawab
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Pilih Dokter (Opsional)</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-500 mt-1">Dokter dapat ditetapkan kemudian jika belum dipilih</p>
              </div>

              {/* Initial Assessment Section */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Asesmen Awal Pasien Lengkap</h3>
                <p className="text-sm text-slate-600 mb-6">Isi semua komponen asesmen awal sesuai standar medis</p>

                <div className="space-y-6">
                  {/* 1. ANAMNESIS (DATA SUBJEKTIF) */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="text-md font-bold text-blue-900 mb-3">1. Anamnesis (Data Subjektif)</h4>

                    {/* Keluhan Utama */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Keluhan Utama *
                      </label>
                      <textarea
                        value={formData.chiefComplaint}
                        onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                        placeholder="Keluhan utama pasien saat datang"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Skala Nyeri */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Skala Nyeri (0-10)
                        </label>
                        <select
                          value={formData.painScale}
                          onChange={(e) => setFormData({...formData, painScale: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Pilih Skala</option>
                          <option value="0">0 - Tidak ada nyeri</option>
                          <option value="1-3">1-3 - Nyeri ringan</option>
                          <option value="4-6">4-6 - Nyeri sedang</option>
                          <option value="7-10">7-10 - Nyeri berat</option>
                        </select>
                      </div>

                      {/* Triage Category */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Kategori Triage *
                        </label>
                        <select
                          value={formData.triageCategory}
                          onChange={(e) => setFormData({...formData, triageCategory: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih Triage</option>
                          <option value="Merah">🔴 Merah - Kritis (Immediate)</option>
                          <option value="Kuning">🟡 Kuning - Urgent (Soon)</option>
                          <option value="Hijau">🟢 Hijau - Routine (Normal)</option>
                          <option value="Biru">🔵 Biru - Non-Urgent (Delay)</option>
                        </select>
                      </div>
                    </div>

                    {/* Riwayat Penyakit Sekarang */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Riwayat Penyakit Sekarang
                      </label>
                      <textarea
                        value={formData.currentIllnessHistory}
                        onChange={(e) => setFormData({...formData, currentIllnessHistory: e.target.value})}
                        placeholder="Sesak, demam, batuk, nyeri, gejala lainnya..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Riwayat Penyakit Dahulu */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Riwayat Penyakit Dahulu
                      </label>
                      <textarea
                        value={formData.pastMedicalHistory}
                        onChange={(e) => setFormData({...formData, pastMedicalHistory: e.target.value})}
                        placeholder="Penyakit bawaan, operasi sebelumnya, penyakit kronis..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Riwayat Alergi */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Riwayat Alergi *
                      </label>
                      <input
                        type="text"
                        value={formData.allergies}
                        onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                        placeholder="Alergi obat, makanan, atau lainnya (ketik 'Tidak ada' jika tidak ada)"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* 2. PEMERIKSAAN FISIK (DATA OBJEKTIF) */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="text-md font-bold text-green-900 mb-3">2. Pemeriksaan Fisik (Data Objektif)</h4>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Tekanan Darah</label>
                        <input
                          type="text"
                          value={formData.bloodPressure}
                          onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
                          placeholder="120/80"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Suhu (°C)</label>
                        <input
                          type="text"
                          value={formData.temperature}
                          onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                          placeholder="36.5"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Nadi (/menit)</label>
                        <input
                          type="text"
                          value={formData.pulse}
                          onChange={(e) => setFormData({...formData, pulse: e.target.value})}
                          placeholder="80"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Pernapasan (/menit)</label>
                        <input
                          type="text"
                          value={formData.respiration}
                          onChange={(e) => setFormData({...formData, respiration: e.target.value})}
                          placeholder="20"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">SpO2 (%)</label>
                        <input
                          type="text"
                          value={formData.spO2}
                          onChange={(e) => setFormData({...formData, spO2: e.target.value})}
                          placeholder="98"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    {/* Head-to-Toe Examination */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Pemeriksaan Head-to-Toe
                      </label>
                      <textarea
                        value={formData.headToToeExam}
                        onChange={(e) => setFormData({...formData, headToToeExam: e.target.value})}
                        placeholder="Keala: Mata, Telinga, Hidung, Tenggorokan~Leher: Kelenjar getah bening~Thorax: Jantung, Paru~Abdomen: Perut, Organ dalam~Ekstremitas: Tangan, Kaki~Kulit: Warna, Turgor"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* 3. SKRINING FUNGSIONAL & RISIKO */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <h4 className="text-md font-bold text-yellow-900 mb-3">3. Skrining Fungsional & Risiko</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Risiko Jatuh */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Skrining Risiko Jatuh
                        </label>
                        <select
                          value={formData.fallRisk}
                          onChange={(e) => setFormData({...formData, fallRisk: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Pilih Risiko</option>
                          <option value="Rendah">Rendah</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Tinggi">Tinggi</option>
                        </select>
                      </div>

                      {/* Status Gizi */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Status Gizi
                        </label>
                        <select
                          value={formData.nutritionalStatus}
                          onChange={(e) => setFormData({...formData, nutritionalStatus: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Pilih Status</option>
                          <option value="Baik">Baik</option>
                          <option value="Kurang">Kurang</option>
                          <option value="Buruk">Buruk</option>
                          <option value="Obesitas">Obesitas</option>
                        </select>
                      </div>

                      {/* Asesmen Fungsional */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Asesmen Fungsional
                        </label>
                        <select
                          value={formData.functionalAssessment}
                          onChange={(e) => setFormData({...formData, functionalAssessment: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Pilih Status</option>
                          <option value="Mandiri">Mandiri</option>
                          <option value="Butuh Bantuan">Butuh Bantuan Sebagian</option>
                          <option value="Tergantung">Tergantung Sepenuhnya</option>
                          <option value="Bedrest">Bedrest</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 4. ASESMEN MEDIS & KEPERAWATAN */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="text-md font-bold text-purple-900 mb-3">4. Asesmen Medis & Keperawatan</h4>

                    {/* Diagnosis Awal */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Diagnosis Awal/Sementara
                      </label>
                      <textarea
                        value={formData.initialDiagnosis}
                        onChange={(e) => setFormData({...formData, initialDiagnosis: e.target.value})}
                        placeholder="Diagnosa kerja atau diagnosa sementara berdasarkan asesmen"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Perencanaan Tindakan */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Perencanaan Tindakan Keperawatan
                      </label>
                      <textarea
                        value={formData.nursingPlanning}
                        onChange={(e) => setFormData({...formData, nursingPlanning: e.target.value})}
                        placeholder="Rencana tindakan keperawatan yang akan dilakukan"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Catatan Dokter */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Catatan Dokter DPJP
                      </label>
                      <textarea
                        value={formData.doctorNotes}
                        onChange={(e) => setFormData({...formData, doctorNotes: e.target.value})}
                        placeholder="Catatan tambahan dari dokter penanggung jawab (opsional)"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* 5. TAMBAHAN SPESIFIK */}
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <h4 className="text-md font-bold text-orange-900 mb-3">5. Tambahan Spesifik</h4>

                    {/* Edukasi Pasien */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Edukasi Pasien
                      </label>
                      <textarea
                        value={formData.patientEducation}
                        onChange={(e) => setFormData({...formData, patientEducation: e.target.value})}
                        placeholder="Edukasi yang diberikan kepada pasien/keluarga"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Kebutuhan Komunikasi */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Kebutuhan Komunikasi
                        </label>
                        <select
                          value={formData.communicationNeeds}
                          onChange={(e) => setFormData({...formData, communicationNeeds: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Pilih Kebutuhan</option>
                          <option value="Baik">Baik</option>
                          <option value="Alat Bantu Dengar">Butuh Alat Bantu Dengar</option>
                          <option value="Bahasa Isyarat">Bahasa Isyarat</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      {/* Riwayat Sosial Ekonomi */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Status Sosial Ekonomi
                        </label>
                        <select
                          value={formData.socioeconomicHistory}
                          onChange={(e) => setFormData({...formData, socioeconomicHistory: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Pilih Status</option>
                          <option value="BPJS">BPJS/KIS</option>
                          <option value="Umum">Umum/Biaya Sendiri</option>
                          <option value="Asuransi">Asuransi Swasta</option>
                          <option value="Jaminan">Jaminan Sosial/ASKESKIN</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Pasien
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/nurse")}
                  className="px-6 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </NurseLayout>
  )
}
