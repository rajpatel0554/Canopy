export default function Home() {
  return (
    <main className="min-h-screen bg-linen flex items-center justify-center">
      <div className="bg-card border border-canopy-border rounded-xl p-10 shadow-sm text-center max-w-md">

        {/* Logo / Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">🌿</span>
          <h1 className="font-serif text-4xl text-forest">Canopy</h1>
        </div>

        {/* Subtitle */}
        <p className="font-sans text-muted text-sm mb-8">
          Multi-Tenant Feature Flag Service
        </p>

        {/* Theme color swatches — visual check */}
        <div className="flex gap-2 justify-center mb-8">
          <div className="w-6 h-6 rounded-full bg-forest"        title="Forest" />
          <div className="w-6 h-6 rounded-full bg-mint"          title="Mint" />
          <div className="w-6 h-6 rounded-full bg-linen border border-canopy-border" title="Linen" />
          <div className="w-6 h-6 rounded-full bg-success"       title="Success" />
          <div className="w-6 h-6 rounded-full bg-danger"        title="Danger" />
          <div className="w-6 h-6 rounded-full bg-warning"       title="Warning" />
        </div>

        {/* Flag key sample — JetBrains Mono */}
        <p className="font-key text-sm text-muted bg-linen px-3 py-1 rounded inline-block mb-6">
          new-checkout-flow
        </p>

        {/* Nav links — placeholders until Part 2 */}
        <div className="flex gap-3 justify-center">
          
           <a href="/login"
            className="bg-forest text-mint font-sans text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Login
          </a>
          
            <a href="/flags"
            className="border border-canopy-border text-canopy-text font-sans text-sm px-4 py-2 rounded-lg hover:bg-white transition"
          >
            Dashboard →
          </a>
        </div>

      </div>
    </main>
  );
}