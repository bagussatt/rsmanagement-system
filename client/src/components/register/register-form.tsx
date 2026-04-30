"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  User, Lock, Phone, Stethoscope, FileBadge, 
  ArrowRight, Loader2, Eye, EyeOff, CircleAlert, IdCard 
} from "lucide-react";
import useAuth from "@/hooks/use-auth";

export function RegisterForm() {
  // Inisialisasi sesuai model User Prisma Anda
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "DOKTER",
    specialization: "",
    sip: "",
    phone: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, setError } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi khusus untuk role DOKTER
    if (formData.role === "DOKTER" && (!formData.specialization || !formData.sip)) {
      setError("Untuk role DOKTER, spesialisasi dan nomor SIP wajib diisi");
      return;
    }

    // DEBUG: Melihat data yang dikirim dari FE ke BE di Console Browser
    console.log("Payload FE yang dikirim:", JSON.stringify(formData, null, 2));

    try {
      await register(formData);
      alert("Registrasi Berhasil! Silakan login dengan akun Anda.");
      router.push("/login");
    } catch (err) {
      console.error("Gagal mengirim data:", err);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-w-5xl w-full">
      
      {/* Visual Samping */}
      <div className="hidden md:flex w-2/5 bg-slate-900 relative items-center justify-center p-12 text-white">
        <Image src="/login.webp" alt="Visual" fill className="object-cover opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 to-indigo-900/90 z-10" />
        <div className="relative z-20 text-center space-y-6">
          <IdCard className="h-12 w-12 mx-auto opacity-80" />
          <h2 className="text-3xl font-black">Pendaftaran Akun</h2>
          <p className="text-blue-100 font-light">Sistem manajemen medis terintegrasi.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8 md:p-14 w-full md:w-3/5 flex flex-col justify-center bg-slate-50/30">
        <div className="space-y-6">
          <h1 className="text-3xl font-black text-slate-900">Buat Akun</h1>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm">
              <CircleAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Nama Lengkap</label>
              <InputGroup icon={IdCard} name="name" placeholder="Nama Lengkap" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Username</label>
              <InputGroup icon={User} name="username" placeholder="username" value={formData.username} onChange={handleInputChange} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-11 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 text-sm"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-2.5 text-slate-400">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Role</label>
              <select name="role" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm text-slate-900" onChange={handleInputChange}>
                <option value="DOKTER">DOKTER</option>
                <option value="PERAWAT">PERAWAT</option>
                <option value="BIDAN">BIDAN</option>
                <option value="AHLI_GIZI">AHLI_GIZI</option>
                <option value="APOTEKER">APOTEKER</option>
                <option value="FISIOTERAPIS">FISIOTERAPIS</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase">No. Telepon</label>
              <InputGroup icon={Phone} name="phone" placeholder="08..." value={formData.phone} onChange={handleInputChange} />
            </div>

            {/* Field Dokter (Hanya relevant untuk role DOKTER) */}
            {formData.role === "DOKTER" && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Spesialisasi</label>
                  <InputGroup icon={Stethoscope} name="specialization" placeholder="Spesialis..." value={formData.specialization} onChange={handleInputChange} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Nomor SIP</label>
                  <InputGroup icon={FileBadge} name="sip" placeholder="SIP-123" value={formData.sip} onChange={handleInputChange} />
                </div>
              </>
            )}

            <button type="submit" disabled={isLoading} className="md:col-span-2 mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Daftar Sekarang <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ icon: Icon, name, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
      <input name={name} className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm" {...props} />
    </div>
  );
}