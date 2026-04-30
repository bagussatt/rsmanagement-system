"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image"; // IMPORT INI WAJIB
import {
  Loader2,
  User,
  Lock,
  ArrowRight,
  UserPlus,
  Eye,
  EyeOff
} from "lucide-react";
import useAuth from "@/hooks/use-auth";

export function LoginForm() {
  const [body, setBody] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Login and save token (sweetAlert handled in useAuth hook)
      await login(body.username, body.password);

      // Redirect to dashboard - dashboard will handle role-based routing
      router.push("/dashboard");
    } catch (error: any) {
      // Error is already handled in useAuth hook with sweetAlert
      console.error("Login failed:", error);
    }
  };

  return (
    // DI SINI UKURAN DIPERBESAR: Dari max-w-4xl menjadi max-w-5xl
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-w-5xl w-full animate-in fade-in zoom-in duration-500">
      
      {/* Sisi Kiri: Form (Ukuran padding disesuaikan) */}
      <div className="p-10 md:p-16 w-full md:w-1/2 flex flex-col justify-center">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Selamat Datang</h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">Masuk untuk mengelola data Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                  placeholder="Username Anda"
                  value={body.username}
                  onChange={(e) => setBody({...body, username: e.target.value})}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 ml-1">Kata Sandi</label>
                <Link href="#" className="text-xs text-blue-600 font-bold hover:underline">Lupa sandi?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                  placeholder="••••••••"
                  value={body.password}
                  onChange={(e) => setBody({...body, password: e.target.value})}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-100 text-lg mt-6"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Masuk Sekarang <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <div className="pt-6 text-center border-t border-slate-100">
            <p className="text-base text-slate-600 font-medium">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 font-black hover:underline inline-flex items-center gap-1.5 group">
                Daftar Akun <UserPlus className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Visual Branding dengan Gambar WEPB */}
      <div className="hidden md:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 text-white overflow-hidden">
        {/* DI SINI GAMBAR DITAMPILKAN */}
        <Image 
          src="/login.webp" // Mengambil dari folder public/login.webp
          alt="Login Visual"
          fill // Memenuhi kontainer parent
          className="object-cover opacity-50" // Gambar menutupi area dan dibuat agak transparan
          priority // Prioritas pemuatan gambar
        />
        
        {/* Overlay Gradient agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-indigo-900/80 z-10" />
        
        {/* Konten Teks di Atas Gambar */}
        <div className="relative z-20 text-center space-y-8">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 shadow-xl">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <p className="text-2xl font-light italic leading-relaxed tracking-wide">&quot;Teknologi hanyalah alat. Dalam hal membuat orang bekerja sama, guru adalah yang terpenting.&quot;</p>
          <div className="pt-5 border-t border-white/20 inline-block">
            <p className="text-sm font-black tracking-widest uppercase text-blue-200">— Bill Gates</p>
          </div>
        </div>
      </div>
    </div>
  );
}