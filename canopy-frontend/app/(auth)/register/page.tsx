"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import confetti from "canvas-confetti"
import { authApi, tenantsApi } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tenantSlug, setTenantSlug] = useState("")
  
  // UI toggles / states
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startRegisterTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Tenant Creator helper state
  const [showOrgCreator, setShowOrgCreator] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [orgSuccess, setOrgSuccess] = useState<string | null>(null)
  const [orgError, setOrgError] = useState<string | null>(null)
  const [isCreatingOrg, startCreatingOrgTransition] = useTransition()

  // Email validity check
  const isEmailValid = (val: string) => {
    if (val.length === 0) return null
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }
  const emailValid = isEmailValid(email)

  // Password strength logic
  const getPasswordStrengthScore = (val: string): 0 | 1 | 2 | 3 => {
    if (val.length === 0) return 0
    let score = 0
    if (val.length >= 6) score++
    if (val.length >= 10 && /[A-Z]/.test(val)) score++
    if (/[^a-zA-Z0-9]/.test(val) && val.length >= 8) score++
    if (score > 3) score = 3
    return score as 0 | 1 | 2 | 3
  }
  const strengthScore = getPasswordStrengthScore(password)
  
  const strength = {
    0: { color: '#9ca3af', label: 'Enter a password', colorClass: 'text-[#9ca3af]' },
    1: { color: '#dc2626', label: 'Weak — add more characters', colorClass: 'text-[#dc2626]' },
    2: { color: '#d97706', label: 'Good — try adding symbols', colorClass: 'text-[#d97706]' },
    3: { color: '#059669', label: 'Strong password ✓', colorClass: 'text-[#059669]' },
  }[strengthScore]

  // Format organization slug input on-the-fly
  const formatSlug = (val: string): string => {
    let formatted = val.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
    if (formatted.startsWith('-')) formatted = formatted.substring(1)
    return formatted
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSlug(e.target.value)
    setTenantSlug(formatted)
  }

  const handleCreateOrg = (e: React.MouseEvent) => {
    e.preventDefault()
    setOrgError(null)
    setOrgSuccess(null)

    if (!orgName.trim()) {
      setOrgError("Organization name cannot be empty.")
      return
    }

    startCreatingOrgTransition(async () => {
      try {
        const tenant = await tenantsApi.create(orgName)
        setTenantSlug(tenant.slug)
        setOrgSuccess(`Organization "${tenant.name}" created! Slug set to "${tenant.slug}".`)
        setOrgName("")
      } catch (err: any) {
        setOrgError(err.message || "Failed to create organization.")
      }
    })
  }

  const triggerErrorShakeAndFocus = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
      const emailEl = document.getElementById("email") as HTMLInputElement
      const passEl = document.getElementById("password") as HTMLInputElement
      const slugEl = document.getElementById("slug") as HTMLInputElement
      if (emailEl && (!emailEl.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value))) {
        emailEl.focus()
      } else if (passEl && !passEl.value) {
        passEl.focus()
      } else if (slugEl && !slugEl.value) {
        slugEl.focus()
      }
    }, 650)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password || !tenantSlug) {
      setError("Please fill in all fields.")
      triggerErrorShakeAndFocus()
      return
    }

    if (password.length < 6) {
      setError("Password is too weak.")
      triggerErrorShakeAndFocus()
      return
    }

    startRegisterTransition(async () => {
      const startTime = Date.now()
      try {
        // Step 1: Register the user
        await authApi.register(email, password, tenantSlug)

        // Enforce minimum 1800ms loading state for button morph animation to display fully
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 1800 - elapsedTime)
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime))
        }

        // Step 2: Show success effects
        setSuccess(true)
        setShowToast(true)
        
        // Confetti burst
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1c3a2f', '#6ee7b7', '#a7f3d0']
        })

        // Step 3: Automatically log in the user using NextAuth credentials provider
        setTimeout(async () => {
          await signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard",
          })
        }, 2500)

      } catch (err: any) {
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 1800 - elapsedTime)
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime))
        }
        setError(err.message || "Registration failed. Please check your details.")
        triggerErrorShakeAndFocus()
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-0 md:p-4 bg-[#f7f7f2]">
      {/* Main Card with White Corner Bleed Fix */}
      <div className="card-shell w-full max-w-[1000px] animate-card-in">

        {/* LEFT PANEL (Marketing) */}
        <section className="lp p-8 md:p-12 flex flex-col justify-between text-white relative">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-16 opacity-0 animate-fade-up">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(110, 231, 183, 0.18)" }}>
                <span className="material-symbols-outlined" style={{ color: "#6ee7b7", fontSize: "20px" }}>eco</span>
              </div>
              <span className="brand-font text-white text-[20px]">Canopy</span>
            </div>
            {/* Headline & Subtitle */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl leading-[1.1] mb-6 font-serif opacity-0 animate-fade-up delay-100">
                <span className="block">Ship faster.</span>
                <span className="block">Stay in control.</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-sm opacity-0 animate-fade-up delay-200">
                Feature flags, A/B tests, and targeting rules — all in one place for your team.
              </p>
            </div>
            {/* Feature Pills */}
            <div className="space-y-4">
              <div className="opacity-0 animate-fade-up delay-300">
                <div className="pill-feature px-5 py-3 rounded-full flex items-center gap-3 w-fit animate-pill-float" style={{ animationDelay: "0s" }}>
                  <span className="material-symbols-outlined text-mint text-xl">radio_button_checked</span>
                  <span className="font-medium text-mint">Instant flag toggles</span>
                </div>
              </div>
              <div className="opacity-0 animate-fade-up delay-400">
                <div className="pill-feature px-5 py-3 rounded-full flex items-center gap-3 w-fit animate-pill-float" style={{ animationDelay: "0.2s" }}>
                  <span className="material-symbols-outlined text-mint text-xl">biotech</span>
                  <span className="font-medium text-mint">A/B testing built-in</span>
                </div>
              </div>
              <div className="opacity-0 animate-fade-up delay-500">
                <div className="pill-feature px-5 py-3 rounded-full flex items-center gap-3 w-fit animate-pill-float" style={{ animationDelay: "0.4s" }}>
                  <span className="material-symbols-outlined text-mint text-xl">groups</span>
                  <span className="font-medium text-mint">Multi-tenant ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <footer className="mt-12 text-sm text-gray-500 flex items-center gap-2">
            <span>🌿 Portfolio project · Raj Patel</span>
          </footer>
        </section>

        {/* RIGHT PANEL (Registration Form) with right-slide animation */}
        <section className="rp p-8 md:p-14 bg-white relative justify-center flex flex-col animate-slide-in-right" id="formPanel">
          {/* Success Overlay (covers form panel only when success = true) */}
          {success && (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-50 animate-fade-up" id="successOverlay">
              <div className="w-[60px] h-[60px] bg-[#d1fae5] rounded-full flex items-center justify-center mb-4 animate-success-pop">
                <svg className="w-8 h-8 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path className="animate-check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="brand-font text-xl text-forest mb-2 text-center font-serif">Account created!</h2>
              <p className="text-forest font-medium text-center">Welcome to Canopy 🌿</p>
            </div>
          )}

          {/* Brand header */}
          <div className="mb-10">
            <div className="relative w-fit">
              <h2 className="brand-font text-3xl text-forest pb-1 overflow-hidden flex gap-[2px]">
                {"Canopy".split("").map((char, index) => (
                  <span
                    key={index}
                    className="animate-wavy-letter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {char}
                  </span>
                ))}
              </h2>
              <div className="absolute bottom-0 left-0 h-0.5 bg-mint animate-underline-draw"></div>
            </div>
          </div>

          {/* Tab Switcher - Sliding Pill option A */}
          <div className="bg-[#e8f5ee] rounded-[12px] p-1 flex gap-1 mb-10">
            <button 
              type="button"
              onClick={() => router.push("/login")}
              className="flex-1 py-3 px-6 rounded-[10px] font-bold text-center tab-inactive transition-all hover:bg-white/50 cursor-pointer"
            >
              Sign In
            </button>
            <button 
              type="button"
              className="flex-1 py-3 px-6 rounded-[10px] font-bold tab-active cursor-default"
            >
              Register
            </button>
          </div>

          {/* Heading */}
          <div className="mb-[14px]">
            <div className="flex gap-[7px] overflow-hidden mb-1 font-serif">
              {"Create your account".split(" ").map((word, i) => (
                <h3
                  key={i}
                  className="text-[26px] text-forest leading-tight animate-word-in"
                  style={{ animationDelay: `${i * 180}ms` }}
                >
                  {word}
                </h3>
              ))}
            </div>
            <p className="text-gray-400 font-medium text-sm mt-1 animate-word-in" style={{ animationDelay: "540ms" }}>
              Set up your organization in seconds
            </p>
          </div>

          {/* Form wrapper in shake zone */}
          <div className={`shake-zone ${isShaking ? "shake" : ""} animate-fade-up delay-500`}>
            
            {/* Error Banner */}
            <div className={`err-bar ${error ? "on" : ""} bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-lg text-sm flex items-start gap-2`}>
              <span className="material-symbols-outlined text-sm mt-0.5">error</span>
              <div>{error || "An error occurred"}</div>
            </div>

            {/* Google SSO */}
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-lg hover:bg-gray-50 hover:border-mint-soft hover:-translate-y-[1px] transition-all mb-6 shadow-sm group"
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
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative bg-white px-4 text-[11px] font-bold text-[#9ca3af] lowercase tracking-widest">
                or register with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" id="registerForm">
              
              {/* Email Field */}
              <div className="form-field-group rounded-r-lg p-1">
                <div className="flex items-center justify-between mb-2 px-3">
                  <label className="text-sm font-bold text-forest" htmlFor="email">Email address</label>
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
                  className="w-full px-4 py-3 border border-mint-soft rounded-lg input-focus transition-all bg-surface-container-lowest font-sans" 
                  placeholder="you@acme-corp.com" 
                  required 
                  disabled={isPending}
                />
              </div>

              {/* Password Field */}
              <div className="form-field-group rounded-r-lg p-1">
                <label className="block text-sm font-bold text-forest mb-2 px-3" htmlFor="password">Password</label>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(null)
                    }}
                    className="w-full px-4 py-3 border border-mint-soft rounded-lg input-focus transition-all bg-surface-container-lowest font-sans pr-12" 
                    placeholder="Create a password" 
                    required 
                    disabled={isPending}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {/* Strength Bar Block (fixed 32px height layout-shift free) */}
                <div className="strength-block">
                  <div className="flex gap-1.5 mt-2 px-3">
                    <div 
                      className="flex-1 password-strength-bar" 
                      style={{ 
                        backgroundColor: strengthScore >= 1 
                          ? (strengthScore === 1 ? '#dc2626' : strengthScore === 2 ? '#d97706' : '#059669') 
                          : '#e5e7eb' 
                      }}
                    ></div>
                    <div 
                      className="flex-1 password-strength-bar" 
                      style={{ 
                        backgroundColor: strengthScore >= 2 
                          ? (strengthScore === 2 ? '#d97706' : '#059669') 
                          : '#e5e7eb' 
                      }}
                    ></div>
                    <div 
                      className="flex-1 password-strength-bar" 
                      style={{ 
                        backgroundColor: strengthScore >= 3 
                          ? '#059669' 
                          : '#e5e7eb' 
                      }}
                    ></div>
                  </div>
                  <p className={`text-[11px] font-medium mt-1 px-3 flex items-center gap-1 ${strength.colorClass}`}>
                    {strength.label}
                  </p>
                </div>
              </div>

              {/* Org Slug Field */}
              <div className="form-field-group rounded-r-lg p-1">
                <label className="block text-sm font-bold text-forest mb-2 px-3" htmlFor="slug">Organization slug</label>
                <div className="relative">
                  <input 
                    id="slug" 
                    type="text"
                    value={tenantSlug}
                    onChange={handleSlugChange}
                    className="w-full px-4 py-3 border border-mint-soft rounded-lg font-mono input-focus transition-all bg-surface-container-lowest" 
                    placeholder="acme-corp" 
                    required 
                    disabled={isPending}
                  />
                </div>
                
                {/* Slug Preview block (fixed 18px height layout-shift free) */}
                <div className="slug-preview-block flex items-center justify-between mt-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">e.g.</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-sage text-[11px] font-bold rounded font-mono border border-emerald-100">
                      {tenantSlug || "acme-corp"}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowOrgCreator(!showOrgCreator)}
                    className="text-[11px] text-forest font-bold hover:underline"
                  >
                    {showOrgCreator ? "Hide helper" : "🏢 Need to create an org slug?"}
                  </button>
                </div>
              </div>

              {/* Expander Panel: dynamic tenant creator */}
              {showOrgCreator && (
                <div className="p-4 mx-1 bg-linen border border-mint-soft rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <h4 className="font-serif text-xs text-forest font-semibold">
                    Create a new organization
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      disabled={isCreatingOrg || isPending}
                      className="flex-1 px-3 py-1.5 bg-white border border-mint-soft rounded-md text-xs text-canopy-text focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition"
                    />
                    <button
                      onClick={handleCreateOrg}
                      disabled={isCreatingOrg || isPending}
                      className="px-3 py-1.5 bg-forest text-linen font-sans font-bold text-xs rounded-md hover:opacity-90 active:opacity-95 transition"
                    >
                      {isCreatingOrg ? "Creating..." : "Create"}
                    </button>
                  </div>
                  {orgError && (
                    <p className="text-[10px] text-json-text font-sans">❌ {orgError}</p>
                  )}
                  {orgSuccess && (
                    <p className="text-[10px] text-boolean-text font-sans">✅ {orgSuccess}</p>
                  )}
                </div>
              )}

              {/* Submit Button with loader morph */}
              <div className="mt-6 flex justify-center" id="submitContainer">
                <button 
                  type="submit"
                  disabled={isPending || success}
                  className={`btn-morph w-full bg-forest text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center ${
                    isPending ? 'btn-loading bg-forest/80' : ''
                  }`}
                  id="submitBtn"
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spinner-custom"></div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Nav */}
            <div className="mt-8 text-center" id="bottomNav">
              <p className="text-gray-500 font-medium">
                Have an account?{" "}
                <button 
                  onClick={() => router.push("/login")}
                  className="text-forest font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* Toast Notification with progress bar shrink */}
      <div 
        className={`fixed top-6 right-6 w-72 bg-forest rounded-lg shadow-2xl border border-white/10 overflow-hidden z-[60] transition-all duration-300 ${
          showToast ? "block animate-toast-in" : "hidden"
        }`}
        id="toast"
      >
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(110, 231, 183, 0.18)" }}>
              <span className="material-symbols-outlined" style={{ color: "#6ee7b7", fontSize: "20px" }}>eco</span>
            </div>
            <span className="text-sm font-bold text-white">Welcome to Canopy!</span>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="text-white/50 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
        <div className="h-1 bg-mint w-full animate-progress-shrink"></div>
      </div>
    </main>
  )
}
