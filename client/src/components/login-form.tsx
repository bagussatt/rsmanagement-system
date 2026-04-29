"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuth from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { CircleAlert, Loader2 } from "lucide-react" // Tambah Loader2
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [body, updateBody] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false) // State loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const query = useSearchParams()
  const msg = query.get("msg")
  const { login } = useAuth()
  const router = useRouter()

  const setBody = (value: Partial<typeof body>) => {
    updateBody((prev) => ({ ...prev, ...value }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true) // Mulai loading
    try {
      await login(body.username, body.password)
      setErrorMessage(null)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage("Username atau password salah")
    } finally {
      setIsLoading(false) // Selesai loading
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-none shadow-xl ring-1 ring-slate-200">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang</h1>
                <p className="text-muted-foreground mt-2">
                  Silakan masuk ke akun Anda
                </p>
              </div>

              {errorMessage && (
                <Alert variant="destructive" className="animate-in fade-in zoom-in duration-300">
                  <CircleAlert className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Masukkan username"
                    value={body.username}
                    onChange={(e) => setBody({ username: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={body.password}
                    onChange={(e) => setBody({ password: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                  Atau
                </span>
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            </div>
          </form>
          {/* Sisi Kanan: Visual/Image */}
          <div className="relative hidden bg-slate-900 md:block">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10" />
            <Image
              src="/login.webp" // Ganti dengan gambar nyata yang relevan
              alt="Login Visual"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
              width={600}
              height={800}
            />
            <div className="relative z-20 flex h-full flex-col items-center justify-center p-10 text-white">
               <blockquote className="space-y-2 text-center">
                  <p className="text-lg italic">
                    "Teknologi hanyalah alat. Dalam hal membuat anak-anak bekerja sama dan memotivasi mereka, guru adalah yang terpenting."
                  </p>
                  <footer className="text-sm font-medium">— Bill Gates</footer>
               </blockquote>
            </div>
          </div>
        </CardContent>
      </Card>
      <footer className="text-center text-xs text-muted-foreground">
        Dengan masuk, Anda menyetujui <a href="#" className="underline underline-offset-4 hover:text-primary">Ketentuan Layanan</a> kami.
      </footer>
    </div>
  )
}