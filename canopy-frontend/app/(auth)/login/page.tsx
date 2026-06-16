"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  
  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Client-side email validation badge
  const isEmailValid = (val: string) => {
    if (val.length === 0) return null
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }
  const emailValid = isEmailValid(email)

  // Show "Press Enter ↵ to sign in" hint when both fields are filled and valid
  const showEnterHint = emailValid === true && password.length >= 4 && !error

  const triggerErrorShakeAndFocus = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
      const emailEl = document.getElementById("email") as HTMLInputElement
      const passEl = document.getElementById("password") as HTMLInputElement
      if (emailEl && (!emailEl.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value))) {
        emailEl.focus()
      } else if (passEl && !passEl.value) {
        passEl.focus()
      }
    }, 650)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please fill in all fields.")
      triggerErrorShakeAndFocus()
      return
    }

    startTransition(async () => {
      const startTime = Date.now()
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        // Force minimum 1800ms loading state for button morph animation to display fully
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 1800 - elapsedTime)
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime))
        }

        if (result?.error) {
          setError(result.error)
          triggerErrorShakeAndFocus()
        } else {
          setSuccess(true)
          setTimeout(() => {
            router.push("/dashboard")
            router.refresh()
          }, 1000)
        }
      } catch (err: any) {
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 1800 - elapsedTime)
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime))
        }
        setError(err.message || "An unexpected error occurred.")
        triggerErrorShakeAndFocus()
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#f7f7f2]">
      {/* Main Container with White Corner Bleed Fix */}
      <div className="card-shell w-full max-w-[1000px] animate-card-in">
        
        {/* Left Marketing Panel */}
        <section className="lp p-10 flex flex-col justify-between text-white relative">
          
          <div>
            {/* Top Branding */}
            <div className="flex items-center gap-3 opacity-0 animate-fade-up">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(110, 231, 183, 0.18)" }}>
                <span className="material-symbols-outlined" style={{ color: "#6ee7b7", fontSize: "20px" }}>eco</span>
              </div>
              <span className="brand-font text-white text-[20px]">Canopy</span>
            </div>

            {/* Main Text Content */}
            <div className="mt-12">
              <h1 className="text-5xl leading-tight mb-6 font-serif opacity-0 animate-fade-up delay-100">
                Ship faster.<br />
                Stay in control.
              </h1>
              <p className="text-gray-300 text-lg mb-10 max-w-xs leading-relaxed opacity-0 animate-fade-up delay-200">
                Feature flags, A/B tests, and targeting rules — all in one place for your team.
              </p>
              
              {/* Feature Feature Feature Feature Feature Feature Pills */}
              <div className="space-y-4">
                <div className="opacity-0 animate-fade-up delay-300">
                  <div className="pill-feature animate-pill-float" style={{ animationDelay: "0s" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>toggle_on</span>
                    <span className="text-sm font-medium">Instant flag toggles</span>
                  </div>
                </div>
                <div className="opacity-0 animate-fade-up delay-400">
                  <div className="pill-feature animate-pill-float" style={{ animationDelay: "0.2s" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>science</span>
                    <span className="text-sm font-medium">A/B testing built-in</span>
                  </div>
                </div>
                <div className="opacity-0 animate-fade-up delay-500">
                  <div className="pill-feature animate-pill-float" style={{ animationDelay: "0.4s" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>groups</span>
                    <span className="text-sm font-medium">Multi-tenant ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="mt-auto pt-10 flex items-center gap-2 opacity-50 text-sm">
            <span>🌿 Portfolio project · Raj Patel</span>
          </div>

        </section>

        {/* Right Auth Panel with left-slide animation */}
        <section className="rp p-10 md:p-16 flex flex-col relative justify-center animate-slide-in-left">
          
          {/* Top Nav/Tabs */}
          <div className="flex flex-col gap-8">
            <div className="relative w-fit">
              <div className="brand-font text-3xl text-forest pb-1 overflow-hidden flex gap-[2px]">
                {"Canopy".split("").map((char, index) => (
                  <span
                    key={index}
                    className="animate-wavy-letter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 bg-mint animate-underline-draw"></div>
            </div>
            
            {/* Tab selector - Sliding Pill option A */}
            <div className="flex gap-2 p-1 rounded-lg bg-[#e8f5ee]" style={{ borderRadius: "12px", padding: "4px" }}>
              <button 
                type="button" 
                className="flex-1 py-2.5 rounded-[10px] font-bold tab-active cursor-default"
              >
                Sign In
              </button>
              <button 
                type="button" 
                onClick={() => router.push("/register")}
                className="flex-1 py-2.5 rounded-[10px] font-bold tab-inactive transition-all hover:bg-white/50 cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>

          {/* Welcome Header */}
          <div className="mt-8 mb-6">
            <div className="flex gap-[7px] overflow-hidden mb-1 font-serif">
              {"Welcome back".split(" ").map((word, i) => (
                <h2
                  key={i}
                  className="text-3xl text-forest animate-word-in"
                  style={{ animationDelay: `${i * 180}ms` }}
                >
                  {word}
                </h2>
              ))}
            </div>
            <p className="text-gray-500 animate-word-in" style={{ animationDelay: "360ms" }}>Sign in to your workspace</p>
          </div>

          {/* Form and OAuth Wrapper inside shake zone */}
          <div className={`shake-zone ${isShaking ? "shake" : ""} opacity-0 animate-fade-up delay-500`}>
            
            {/* Error Banner */}
            <div className={`err-bar ${error ? "on" : ""} bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg text-sm flex items-start gap-2`}>
              <span className="material-symbols-outlined text-sm mt-0.5">error</span>
              <div>{error || "An error occurred"}</div>
            </div>

            {/* Google SSO */}
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-mint-soft hover:-translate-y-[1px] transition-all mb-6 shadow-sm group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="font-bold text-gray-700">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider" style={{ textTransform: "lowercase", fontSize: "11px", color: "#9ca3af" }}>
                or sign in with email
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-field-group rounded-r-[8px] p-1">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <label className="text-sm font-bold text-forest" htmlFor="email">
                    Email address
                  </label>
                  {emailValid !== null && (
                    <div 
                      className={`w-[15px] h-[15px] rounded-full flex items-center justify-center text-[10px] font-bold ${
                        emailValid ? "bg-[#d1fae5] text-[#1c3a2f]" : "bg-[#fee2e2] text-[#dc2626]"
                      }`}
                    >
                      {emailValid ? "✓" : "✕"}
                    </div>
                  )}
                </div>
                <input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  className="input-field text-gray-700 placeholder-gray-400 font-sans input-focus" 
                  placeholder="you@acme-corp.com" 
                  required 
                  disabled={isPending || success}
                />
              </div>

              <div className="form-field-group rounded-r-[8px] p-1">
                <label className="block text-sm font-bold text-forest mb-1.5 px-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(null)
                    }}
                    className="input-field text-gray-700 placeholder-gray-400 pr-12 font-sans input-focus" 
                    placeholder="Enter your password" 
                    required 
                    disabled={isPending || success}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-forest border-l border-gray-100 pl-3 transition-colors"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-forest focus:ring-forest h-4 w-4 transition-all" 
                    style={{ accentColor: "#1c3a2f" }}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-forest">Remember me</span>
                </label>
                <a className="text-sm text-gray-600 hover:text-forest hover:underline" href="#">Forgot password?</a>
              </div>

              {/* Enter Hint & Submit button */}
              <div className="mt-4">
                <div className={`enter-hint ${showEnterHint ? "on" : ""}`}>
                  <span 
                    className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-mono transition-opacity duration-200" 
                    style={{ fontSize: "11px", opacity: showEnterHint ? 1 : 0, color: "#9ca3af" }}
                  >
                    Press Enter ↵ to sign in
                  </span>
                </div>
                
                <button 
                  type="submit"
                  disabled={isPending || success}
                  className={`btn-morph w-full bg-forest text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center ${
                    isPending ? "btn-loading" : ""
                  }`}
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spinner-custom"></div>
                  ) : success ? (
                    <div className="flex items-center justify-center gap-2 text-[#6ee7b7]">
                      <span className="material-symbols-outlined animate-success-pop">check_circle</span>
                      <span className="text-sm">You're signed in!</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Nav Link */}
            <p className="mt-8 text-center text-gray-500">
              No account?{" "}
              <button 
                onClick={() => router.push("/register")}
                className="text-forest font-bold hover:underline"
              >
                Create one
              </button>
            </p>

          </div>
        </section>

      </div>
    </main>
  )
}
