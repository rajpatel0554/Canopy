"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Token interfaces for the typewriter code animations
interface Token {
  text: string;
  className: string;
}

const requestTokens: Token[] = [
  { text: "POST ", className: "text-[#6ee7b7]" },
  { text: "/api/evaluate/new-checkout-flow\n", className: "text-[#fbbf24]" },
  { text: "Content-Type: application/json\n\n", className: "text-linen/60" },
  { text: "{\n", className: "text-linen" },
  { text: '  "context"', className: "text-[#a78bfa]" },
  { text: ": {\n", className: "text-linen" },
  { text: '    "userId"', className: "text-[#a78bfa]" },
  { text: ": ", className: "text-linen" },
  { text: '"usr_123"', className: "text-[#6ee7b7]" },
  { text: ",\n", className: "text-linen" },
  { text: '    "email"', className: "text-[#a78bfa]" },
  { text: ": ", className: "text-linen" },
  { text: '"raj@example.com"', className: "text-[#6ee7b7]" },
  { text: ",\n", className: "text-linen" },
  { text: '    "plan"', className: "text-[#a78bfa]" },
  { text: ": ", className: "text-linen" },
  { text: '"pro"', className: "text-[#6ee7b7]" },
  { text: ",\n", className: "text-linen" },
  { text: '    "country"', className: "text-[#a78bfa]" },
  { text: ": ", className: "text-linen" },
  { text: '"IN"', className: "text-[#6ee7b7]" },
  { text: "\n  }\n}", className: "text-linen" }
];

const responseTokens: Token[] = [
  { text: "{\n", className: "text-linen" },
  { text: '  "value"', className: "text-[#a78bfa]" },
  { text: ": ", className: "text-linen" },
  { text: '"true"', className: "text-[#6ee7b7]" },
  { text: ",\n", className: "text-linen" },
  { text: '  "variationType"', className: "text-[#a78bfa]" },
  { text: ": ", className: "text-linen" },
  { text: '"BOOLEAN"', className: "text-[#6ee7b7]" },
  { text: ",\n", className: "text-linen" },
  { text: '  "enabled"', className: "text-[#a78bfa]" },
  { text: ": ", className: "text-linen" },
  { text: "true\n", className: "text-[#6ee7b7]" },
  { text: "}\n\n", className: "text-linen" },
  { text: "// Matched: targeting rule\n", className: "text-linen/30" },
  { text: '// plan EQUALS "pro" → ON', className: "text-linen/30" }
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [bypassAnimations, setBypassAnimations] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Section visibility states driven by IntersectionObserver
  const [howItWorksActive, setHowItWorksActive] = useState(false);
  const [apiActive, setApiActive] = useState(false);

  // Auto-play toggle pulse state inside Hero mockup
  const [pulseRow, setPulseRow] = useState<number | null>(null);

  // Rollout bar animation state (triggered after mockup entrance)
  const [rolloutAnimated, setRolloutAnimated] = useState(false);

  // Typewriter text progress states
  const [typedRequestLength, setTypedRequestLength] = useState(0);
  const [typedResponseLength, setTypedResponseLength] = useState(0);

  const requestTotalLength = requestTokens.reduce((acc, t) => acc + t.text.length, 0);
  const responseTotalLength = responseTokens.reduce((acc, t) => acc + t.text.length, 0);

  useEffect(() => {
    setIsMounted(true);

    // Scroll listeners for header backdrop-blur and progress bar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Check initial scroll (e.g. on route transition back or page refresh)
    const initialScroll = window.scrollY;
    let observer: IntersectionObserver | null = null;
    let rolloutTimer: NodeJS.Timeout | null = null;

    if (initialScroll > 80) {
      setBypassAnimations(true);
      setHowItWorksActive(true);
      setApiActive(true);
      setRolloutAnimated(true);
      setTypedRequestLength(requestTotalLength);
      setTypedResponseLength(responseTotalLength);
      
      // Delay slightly to ensure DOM has rendered, then set visible
      const timer = setTimeout(() => {
        document.querySelectorAll(".scroll-fade-up").forEach((el) => {
          el.classList.add("visible");
        });
      }, 50);
    } else {
      // Setup custom IntersectionObserver for page elements
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            
            if (entry.target.id === "how-it-works") {
              setHowItWorksActive(true);
            } else if (entry.target.id === "evaluation-api") {
              setApiActive(true);
            }
            
            observer?.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll(".scroll-fade-up, #how-it-works, #evaluation-api").forEach((element) => {
        observer?.observe(element);
      });

      // Trigger hero mockup rollout bars shortly after mount (simulating entrance completion)
      rolloutTimer = setTimeout(() => {
        setRolloutAnimated(true);
      }, 1500);
    }

    // Setup auto-play loop for mock dashboard toggles
    const toggleInterval = setInterval(() => {
      setPulseRow(0);
      const timer2 = setTimeout(() => setPulseRow(1), 1000);
      const timerReset = setTimeout(() => setPulseRow(null), 2000);
      return () => {
        clearTimeout(timer2);
        clearTimeout(timerReset);
      };
    }, 6000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(toggleInterval);
      if (rolloutTimer) clearTimeout(rolloutTimer);
      if (observer) observer.disconnect();
    };
  }, [requestTotalLength, responseTotalLength]);

  // Run the typewriter typing loop when the API section enters viewport
  useEffect(() => {
    if (!apiActive) return;

    let reqChar = 0;
    let resChar = 0;

    const reqTimer = setInterval(() => {
      reqChar += 2; // Increments of 2 for fluid speed
      if (reqChar >= requestTotalLength) {
        setTypedRequestLength(requestTotalLength);
        clearInterval(reqTimer);

        // Wait brief pause before response typewriter starts
        const resStartTimeout = setTimeout(() => {
          const resTimer = setInterval(() => {
            resChar += 2;
            if (resChar >= responseTotalLength) {
              setTypedResponseLength(responseTotalLength);
              clearInterval(resTimer);
            } else {
              setTypedResponseLength(resChar);
            }
          }, 12);
        }, 400);

        return () => clearTimeout(resStartTimeout);
      } else {
        setTypedRequestLength(reqChar);
      }
    }, 12);

    return () => {
      clearInterval(reqTimer);
    };
  }, [apiActive, requestTotalLength, responseTotalLength]);

  // Renders syntax-highlighted tokens sliced up to maxLength
  const renderTypedTokens = (tokens: Token[], maxLength: number) => {
    let currentLength = 0;
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const remaining = maxLength - currentLength;

      if (remaining <= 0) break;

      if (remaining >= token.text.length) {
        elements.push(
          <span key={i} className={token.className}>
            {token.text}
          </span>
        );
        currentLength += token.text.length;
      } else {
        elements.push(
          <span key={i} className={token.className}>
            {token.text.substring(0, remaining)}
          </span>
        );
        currentLength += remaining;
        break;
      }
    }

    return elements;
  };

  const headlineLine1 = ["Ship", "features", "faster."];
  const headlineLine2 = ["Stay", "in", "control."];

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-mint selection:text-forest antialiased font-sans">
      
      {/* Scroll Progress Indicator Bar at Top */}
      <div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-mint z-[60] origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${isMounted ? scrollProgress : 0})` }}
      />

      {/* Sticky Top Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-in-out border-b border-transparent ${
        isScrolled 
          ? "bg-forest/90 backdrop-blur-md py-[10px] border-b border-mint/10" 
          : "bg-forest py-[14px]"
      } ${bypassAnimations ? "" : isMounted ? "animate-nav-down" : "translate-y-[-100%] opacity-0"}`}>
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-container-max mx-auto">
          <a className="brand-font text-2xl text-linen flex items-center gap-2 select-none" href="#">
            <span className="text-3xl">🌿</span> Canopy
          </a>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/rajpatel0554/Canopy"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block font-bold text-sm bg-transparent border border-mint text-mint px-4 py-2 rounded-lg hover:bg-mint/8 hover:shadow-[0_0_12px_rgba(110,231,183,0.15)] transition-all duration-150"
            >
              GitHub ↗
            </a>
            
            <Link 
              href="/login"
              className="hidden md:block font-bold text-sm bg-transparent border border-mint text-mint px-4 py-2 rounded-lg hover:bg-mint/8 hover:shadow-[0_0_12px_rgba(110,231,183,0.15)] transition-all duration-150"
            >
              Login
            </Link>
            
            <Link 
              href="/register"
              className="font-bold text-sm bg-mint text-forest px-6 py-2 rounded-lg hover:scale-[1.03] hover:shadow-[0_4px_16px_rgba(110,231,183,0.3)] transition-all duration-150"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="overflow-hidden">
        {/* Section 2: Hero Block */}
        <section className="bg-forest text-linen pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mint/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-container-max mx-auto flex flex-col items-center text-center relative z-10">
            {/* Open Source Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-mint/30 bg-mint/5 text-mint font-bold text-xs mb-8 whitespace-nowrap ${
              bypassAnimations ? "" : isMounted ? "animate-hero-badge" : "opacity-0 translate-y-[10px]"
            }`}>
              <span className="material-symbols-outlined text-sm">code</span>
              <span>Open Source · Portfolio Project</span>
            </div>

            {/* Staggered Heading */}
            <h1 className="brand-font text-5xl md:text-6xl text-linen max-w-4xl mb-6 leading-tight">
              <span className="block mb-2">
                {headlineLine1.map((word, idx) => (
                  <span
                    key={idx}
                    className={`inline-block mr-[0.25em] ${bypassAnimations ? "" : "animate-word-in"}`}
                    style={{ animationDelay: bypassAnimations ? undefined : `${300 + idx * 80}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="block">
                {headlineLine2.map((word, idx) => (
                  <span
                    key={idx}
                    className={`inline-block mr-[0.25em] ${bypassAnimations ? "" : "animate-word-in"}`}
                    style={{ animationDelay: bypassAnimations ? undefined : `${300 + (headlineLine1.length + idx) * 80}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            {/* Sub-text */}
            <p 
              className={`text-lg text-linen/65 max-w-2xl mb-10 ${
                bypassAnimations 
                  ? "opacity-100" 
                  : isMounted 
                    ? "opacity-100 transition-opacity duration-500 ease-out" 
                    : "opacity-0"
              }`}
              style={{ transitionDelay: bypassAnimations ? undefined : "800ms" }}
            >
              Deploy code independently of releases. Toggle features for any user, team, or percentage — without redeploying.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-16 ${
              bypassAnimations ? "opacity-100 scale-100" : isMounted ? "animate-cta-pop" : "opacity-0 scale-92"
            }`}>
              <Link 
                href="/register"
                className="font-bold text-sm bg-white text-forest px-8 py-3.5 rounded-full hover:bg-linen hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all duration-150 font-bold border border-mint-soft flex items-center justify-center gap-1"
              >
                Get Started Free →
              </Link>
              <a 
                href="https://github.com/rajpatel0554/Canopy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sm bg-transparent border border-mint-soft text-linen px-8 py-3.5 rounded-full hover:bg-mint/10 hover:shadow-[0_4px_16px_rgba(110,231,183,0.15)] transition-all duration-150 flex items-center justify-center gap-2"
              >
                ⭐ View on GitHub
              </a>
            </div>

            {/* Fake Dashboard Mockup */}
            <div className={`w-full max-w-4xl bg-linen rounded-2xl p-6 border border-canopy-border/20 shadow-2xl text-left relative z-20 ${
              bypassAnimations ? "opacity-100 translate-y-0" : isMounted ? "animate-mockup-in" : "opacity-0 translate-y-[40px]"
            }`}>
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between bg-forest/5 border-b border-canopy-border/20 px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-xs font-bold text-muted font-sans select-none">canopy.app/flags</div>
                <div className="w-12" />
              </div>

              {/* Mock Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm text-canopy-text">
                  <thead>
                    <tr className="text-muted border-b border-canopy-border/30">
                      <th className="pb-3 font-semibold">Flag Key</th>
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold">Rollout</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-canopy-border/20">
                    {/* Row 1 */}
                    <tr className="hover:bg-forest/[0.02] transition-colors">
                      <td className="py-4 font-key text-xs font-mono text-muted select-all">new-checkout-flow</td>
                      <td className="py-4 font-medium text-forest">New Checkout</td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-mint-soft text-boolean-text rounded-md text-xs font-bold uppercase select-none">Boolean</span>
                      </td>
                      <td className="py-4">
                        <div className="w-28 bg-[#e5e7eb] rounded-full h-[6px] overflow-hidden">
                          <div 
                            className="bg-mint h-[6px] rounded-full transition-all duration-[800ms] ease-out" 
                            style={{ 
                              width: rolloutAnimated ? "100%" : "0%",
                              transitionDelay: "0ms"
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className={`inline-flex w-10 h-5 bg-mint rounded-full items-center px-0.5 cursor-default transition-all duration-200 ${
                          pulseRow === 0 ? "animate-toggle-pulse" : ""
                        }`}>
                          <div className="w-4 h-4 bg-white rounded-full translate-x-5 shadow-sm" />
                        </div>
                      </td>
                    </tr>
                    
                    {/* Row 2 */}
                    <tr className="hover:bg-forest/[0.02] transition-colors">
                      <td className="py-4 font-key text-xs font-mono text-muted select-all">ui-theme-variant</td>
                      <td className="py-4 font-medium text-forest">UI Theme</td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-purple-soft text-string-text rounded-md text-xs font-bold uppercase select-none">String</span>
                      </td>
                      <td className="py-4">
                        <div className="w-28 bg-[#e5e7eb] rounded-full h-[6px] overflow-hidden">
                          <div 
                            className="bg-mint h-[6px] rounded-full transition-all duration-[800ms] ease-out" 
                            style={{ 
                              width: rolloutAnimated ? "50%" : "0%",
                              transitionDelay: "150ms"
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className={`inline-flex w-10 h-5 bg-mint rounded-full items-center px-0.5 cursor-default transition-all duration-200 ${
                          pulseRow === 1 ? "animate-toggle-pulse" : ""
                        }`}>
                          <div className="w-4 h-4 bg-white rounded-full translate-x-5 shadow-sm" />
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-forest/[0.02] transition-colors">
                      <td className="py-4 font-key text-xs font-mono text-muted select-all">max-upload-size</td>
                      <td className="py-4 font-medium text-forest">Upload Limit</td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-amber-soft text-number-text rounded-md text-xs font-bold uppercase select-none">Number</span>
                      </td>
                      <td className="py-4">
                        <div className="w-28 bg-[#e5e7eb] rounded-full h-[6px] overflow-hidden">
                          <div 
                            className="bg-mint h-[6px] rounded-full transition-all duration-[800ms] ease-out" 
                            style={{ 
                              width: rolloutAnimated ? "25%" : "0%",
                              transitionDelay: "300ms"
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="inline-flex w-10 h-5 bg-outline-variant/60 rounded-full items-center px-0.5 cursor-default">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-0" />
                        </div>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr className="hover:bg-forest/[0.02] transition-colors">
                      <td className="py-4 font-key text-xs font-mono text-muted select-all">theme-config</td>
                      <td className="py-4 font-medium text-forest">Theme Config</td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-red-soft text-json-text rounded-md text-xs font-bold uppercase select-none">JSON</span>
                      </td>
                      <td className="py-4">
                        <div className="w-28 bg-[#e5e7eb] rounded-full h-[6px] overflow-hidden">
                          <div 
                            className="bg-mint h-[6px] rounded-full transition-all duration-[800ms] ease-out" 
                            style={{ 
                              width: rolloutAnimated ? "10%" : "0%",
                              transitionDelay: "450ms"
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="inline-flex w-10 h-5 bg-outline-variant/60 rounded-full items-center px-0.5 cursor-default">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-0" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Features Grid */}
        <section id="features" className="px-4 md:px-8 bg-white py-24 scroll-mt-12">
          <div className="max-w-container-max mx-auto">
            {/* Heading */}
            <div className="text-center mb-20 scroll-fade-up">
              <h2 className="brand-font text-4xl md:text-5xl text-forest mb-4">
                Everything you need for feature management
              </h2>
              <p className="text-base md:text-lg text-muted max-w-2xl mx-auto font-sans leading-relaxed">
                Manage risk, enable experimentation, and ship faster — without the ops overhead.
              </p>
            </div>

            {/* 3-Column Card Deck */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div 
                className="group bg-linen border border-canopy-border/50 rounded-2xl p-[28px_24px] hover:-translate-y-1 hover:border-mint hover:shadow-[0_8px_24px_rgba(28,58,47,0.1)] transition-all duration-200 scroll-fade-up"
                style={{ transitionDelay: "0ms" }}
              >
                <div className="w-[44px] h-[44px] bg-forest rounded-[10px] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(110,231,183,0.4)] transition-all duration-200">
                  <span className="material-symbols-outlined text-mint text-xl select-none">power_settings_new</span>
                </div>
                <h3 className="brand-font text-2xl text-forest mb-3 font-medium">Kill Switches</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Instantly disable any feature in production with a single toggle — no code change, no redeploy needed.
                </p>
              </div>

              {/* Feature 2 */}
              <div 
                className="group bg-linen border border-canopy-border/50 rounded-2xl p-[28px_24px] hover:-translate-y-1 hover:border-mint hover:shadow-[0_8px_24px_rgba(28,58,47,0.1)] transition-all duration-200 scroll-fade-up"
                style={{ transitionDelay: "150ms" }}
              >
                <div className="w-[44px] h-[44px] bg-forest rounded-[10px] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(110,231,183,0.4)] transition-all duration-200">
                  <span className="material-symbols-outlined text-mint text-xl select-none">person_search</span>
                </div>
                <h3 className="brand-font text-2xl text-forest mb-3 font-medium">Context-Based Targeting</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Serve different values to different users based on plan, country, email, or any custom attribute in your context.
                </p>
              </div>

              {/* Feature 3 */}
              <div 
                className="group bg-linen border border-canopy-border/50 rounded-2xl p-[28px_24px] hover:-translate-y-1 hover:border-mint hover:shadow-[0_8px_24px_rgba(28,58,47,0.1)] transition-all duration-200 scroll-fade-up"
                style={{ transitionDelay: "300ms" }}
              >
                <div className="w-[44px] h-[44px] bg-forest rounded-[10px] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(110,231,183,0.4)] transition-all duration-200">
                  <span className="material-symbols-outlined text-mint text-xl select-none">percent</span>
                </div>
                <h3 className="brand-font text-2xl text-forest mb-3 font-medium">Percentage Rollouts</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Gradually roll out features to 1%, 10%, or 50% of users. Control blast radius before full release.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Section 4: How It Works */}
        <section id="how-it-works" className="py-24 px-4 md:px-8 bg-linen border-y border-canopy-border/20">
          <div className="max-w-container-max mx-auto">
            <h2 className="brand-font text-4xl md:text-5xl text-forest text-center mb-20">
              Up and running in minutes
            </h2>
            
            <div className="relative">
              {/* Horizontal Connecting Line (Desktop) */}
              <div 
                className="hidden md:block absolute top-[23px] left-[15%] right-[15%] h-[2px] bg-canopy-border z-0 origin-left transition-transform duration-700 ease-in-out"
                style={{ 
                  transform: `scaleX(${howItWorksActive ? 1 : 0})`,
                  transitionDelay: "300ms"
                }}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full bg-forest text-mint brand-font text-2xl flex items-center justify-center mb-6 shadow-lg border border-mint/20 transition-all duration-[450ms] ${
                    howItWorksActive ? "animate-step-circle" : "opacity-0 scale-0"
                  }`} style={{ animationDelay: "100ms" }}>
                    1
                  </div>
                  <div className={`transition-all duration-500 ease-out ${
                    howItWorksActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: "200ms" }}>
                    <h3 className="font-bold text-base text-forest mb-2">Create a flag</h3>
                    <p className="text-sm leading-relaxed text-muted max-w-[220px]">
                      Define a feature flag with a key, type (Boolean, String, Number, or JSON), and your variation values.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full bg-forest text-mint brand-font text-2xl flex items-center justify-center mb-6 shadow-lg border border-mint/20 transition-all duration-[450ms] ${
                    howItWorksActive ? "animate-step-circle" : "opacity-0 scale-0"
                  }`} style={{ animationDelay: "500ms" }}>
                    2
                  </div>
                  <div className={`transition-all duration-500 ease-out ${
                    howItWorksActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: "600ms" }}>
                    <h3 className="font-bold text-base text-forest mb-2">Set your rules</h3>
                    <p className="text-sm leading-relaxed text-muted max-w-[220px]">
                      Add targeting rules by user context — or use a percentage rollout to control exposure gradually.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full bg-forest text-mint brand-font text-2xl flex items-center justify-center mb-6 shadow-lg border border-mint/20 transition-all duration-[450ms] ${
                    howItWorksActive ? "animate-step-circle" : "opacity-0 scale-0"
                  }`} style={{ animationDelay: "900ms" }}>
                    3
                  </div>
                  <div className={`transition-all duration-500 ease-out ${
                    howItWorksActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: "1000ms" }}>
                    <h3 className="font-bold text-base text-forest mb-2">Evaluate in code</h3>
                    <p className="text-sm leading-relaxed text-muted max-w-[220px]">
                      Call the evaluate API from your app. Get the right value back for each user in real time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Evaluation API Blocks */}
        <section id="evaluation-api" className="bg-forest py-24 px-4 md:px-8">
          <div className="max-w-container-max mx-auto">
            {/* Header */}
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="brand-font text-4xl md:text-5xl text-linen mb-4">
                One API call. Any language.
              </h2>
              <p className="text-base md:text-lg text-linen/60 font-sans">
                Send context, get a value back. No SDK required.
              </p>
            </div>

            {/* Code Cards Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              
              {/* Request Card */}
              <div className={`bg-black/25 border border-mint/15 rounded-xl overflow-hidden shadow-xl ${
                apiActive ? "animate-code-left" : "opacity-0 -translate-x-[30px]"
              }`}>
                {/* Header */}
                <div className="bg-black/30 px-5 py-3 border-b border-mint/15 flex items-center justify-between">
                  <span className="font-mono text-xs text-mint uppercase tracking-wider font-semibold">Request</span>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                </div>
                {/* Editor Content */}
                <div className="p-6 font-mono text-xs md:text-sm leading-relaxed min-h-[260px] select-all overflow-x-auto whitespace-pre">
                  {renderTypedTokens(requestTokens, typedRequestLength)}
                  {typedRequestLength > 0 && typedRequestLength < requestTotalLength && (
                    <span className="inline-block w-1.5 h-4 bg-mint ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Response Card */}
              <div className={`bg-black/25 border border-mint/15 rounded-xl overflow-hidden shadow-xl ${
                apiActive ? "animate-code-right" : "opacity-0 translate-x-[30px]"
              }`}>
                {/* Header */}
                <div className="bg-black/30 px-5 py-3 border-b border-mint/15 flex items-center justify-between">
                  <span className="font-mono text-xs text-mint uppercase tracking-wider font-semibold">Response · 200 OK</span>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                </div>
                {/* Editor Content */}
                <div className="p-6 font-mono text-xs md:text-sm leading-relaxed min-h-[260px] select-all overflow-x-auto whitespace-pre">
                  {renderTypedTokens(responseTokens, typedResponseLength)}
                  {typedResponseLength > 0 && typedResponseLength < responseTotalLength && (
                    <span className="inline-block w-1.5 h-4 bg-mint ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 6: Variation Types */}
        <section id="variation-types" className="py-24 px-4 md:px-8 bg-white">
          <div className="max-w-container-max mx-auto">
            {/* Header */}
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="brand-font text-3xl md:text-4xl text-forest mb-4">
                Four variation types. One consistent API.
              </h2>
            </div>

            {/* 4-column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Boolean */}
              <div 
                className="group bg-linen p-6 rounded-2xl border border-canopy-border/50 flex flex-col hover:-translate-y-1 hover:border-mint transition-all duration-200 scroll-fade-up"
                style={{ transitionDelay: "0ms" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-mint-soft text-boolean-text rounded-full text-xs font-bold uppercase transition-shadow duration-200 group-hover:shadow-[0_0_10px_#059669]/60 select-none">
                    Boolean
                  </span>
                </div>
                <h3 className="font-bold text-base text-forest mb-2">Boolean</h3>
                <p className="text-muted text-xs leading-relaxed">
                  Simple on/off. Perfect for kill switches and feature rollouts.
                </p>
              </div>

              {/* String */}
              <div 
                className="group bg-linen p-6 rounded-2xl border border-canopy-border/50 flex flex-col hover:-translate-y-1 hover:border-mint transition-all duration-200 scroll-fade-up"
                style={{ transitionDelay: "100ms" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-soft text-string-text rounded-full text-xs font-bold uppercase transition-shadow duration-200 group-hover:shadow-[0_0_10px_#6d28d9]/60 select-none">
                    String
                  </span>
                </div>
                <h3 className="font-bold text-base text-forest mb-2">String</h3>
                <p className="text-muted text-xs leading-relaxed">
                  Return different UI labels, themes, or config strings per user.
                </p>
              </div>

              {/* Number */}
              <div 
                className="group bg-linen p-6 rounded-2xl border border-canopy-border/50 flex flex-col hover:-translate-y-1 hover:border-mint transition-all duration-200 scroll-fade-up"
                style={{ transitionDelay: "200ms" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-[#fef3c7] text-[#d97706] rounded-full text-xs font-bold uppercase transition-shadow duration-200 group-hover:shadow-[0_0_10px_#d97706]/60 select-none">
                    Number
                  </span>
                </div>
                <h3 className="font-bold text-base text-forest mb-2">Number</h3>
                <p className="text-muted text-xs leading-relaxed">
                  Control limits, thresholds, or numeric config values dynamically.
                </p>
              </div>

              {/* JSON */}
              <div 
                className="group bg-linen p-6 rounded-2xl border border-canopy-border/50 flex flex-col hover:-translate-y-1 hover:border-mint transition-all duration-200 scroll-fade-up"
                style={{ transitionDelay: "300ms" }}
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-red-soft text-json-text rounded-full text-xs font-bold uppercase transition-shadow duration-200 group-hover:shadow-[0_0_10px_#dc2626]/60 select-none">
                    JSON
                  </span>
                </div>
                <h3 className="font-bold text-base text-forest mb-2">JSON</h3>
                <p className="text-muted text-xs leading-relaxed">
                  Return complex config objects — multiple values in a single flag.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Section 7: Tech Stack Footer */}
      <footer className="bg-forest text-linen w-full py-12 px-6 md:px-8 border-t border-canopy-border/10">
        <div className="max-w-container-max mx-auto">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div className="flex flex-col">
              <div className="brand-font text-2xl text-linen mb-1">🌿 Canopy</div>
              <div className="text-xs text-linen/50">Multi-Tenant Feature Flag Service</div>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/rajpatel0554/Canopy" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-mint hover:text-white transition-colors text-sm"
              >
                GitHub →
              </a>
              <span className="px-3 py-1 bg-transparent border border-mint/25 text-linen/60 text-xs rounded-full cursor-default select-none">
                Portfolio Project
              </span>
            </div>
          </div>

          {/* Divider Line */}
          <div className="h-[1px] w-full bg-mint/10 mb-8" />

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-xs text-linen/30">
              Built by Raj Patel · 2025
            </div>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-transparent border border-mint/15 text-linen/50 text-xs rounded-full hover:border-mint hover:text-white transition-all duration-150 select-none">
                Next.js
              </span>
              <span className="px-3 py-1 bg-transparent border border-mint/15 text-linen/50 text-xs rounded-full hover:border-mint hover:text-white transition-all duration-150 select-none">
                Spring Boot
              </span>
              <span className="px-3 py-1 bg-transparent border border-mint/15 text-linen/50 text-xs rounded-full hover:border-mint hover:text-white transition-all duration-150 select-none">
                PostgreSQL
              </span>
              <span className="px-3 py-1 bg-transparent border border-mint/15 text-linen/50 text-xs rounded-full hover:border-mint hover:text-white transition-all duration-150 select-none">
                Java 21
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}