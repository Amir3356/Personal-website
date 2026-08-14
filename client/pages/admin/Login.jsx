import { useState } from "react";
import { MdVisibility, MdVisibilityOff, MdPersonOutline, MdLockOutline } from "react-icons/md";
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // The server sets an httpOnly session cookie; nothing to store here.
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-void lg:grid-cols-2">
      {/* Branding — hidden on small screens where the form should lead */}
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-violet-neon/25 via-surface to-void lg:grid lg:place-items-center">
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-neon/20 blur-[120px]"
          aria-hidden
        />
        <div
          className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-cyan-neon/15 blur-[120px]"
          aria-hidden
        />

        <div className="relative grid h-80 w-80 place-items-center">
          {/* Counter-rotating arcs. Partial borders make the spin legible —
              a fully drawn ring looks static at every angle. */}
          <div
            className="animate-spin-slower absolute inset-0 rounded-full border-2 border-violet-neon/30 border-r-transparent border-b-transparent"
            aria-hidden
          />
          <div
            className="animate-spin-reverse absolute inset-3 rounded-full border-2 border-cyan-neon/25 border-t-transparent border-l-transparent"
            aria-hidden
          />
          <div
            className="animate-spin-slow absolute inset-6 rounded-full border border-violet-neon/20 border-r-transparent border-b-transparent border-l-transparent"
            aria-hidden
          />

          <div className="grid h-64 w-64 place-items-center rounded-full border border-line/60 bg-void/70 px-10 text-center backdrop-blur-sm">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-violet-neon/40 bg-violet-neon/10">
                <MdLockOutline size={26} className="text-cyan-neon" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Manage your portfolio content — projects, experience, media and messages.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="grid place-items-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-line/60 bg-surface shadow-lg">
            <MdPersonOutline size={30} className="text-cyan-neon" />
          </div>

          <h1 className="mt-8 text-center font-display text-3xl font-bold text-ink">Sign in</h1>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-line/60 bg-surface px-4 py-3 text-ink placeholder:text-muted/60 focus:border-cyan-neon focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line/60 bg-surface py-3 pr-12 pl-4 text-ink placeholder:text-muted/60 focus:border-cyan-neon focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted transition-colors hover:text-cyan-neon focus-visible:text-cyan-neon focus-visible:outline-none"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-1 rounded-lg bg-violet-neon py-3.5 text-sm font-bold tracking-[0.15em] text-white uppercase transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Continue"}
            </button>
          </form>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted">
            <MdLockOutline size={14} />
            Secure admin area
          </p>
        </div>
      </main>
    </div>
  );
}
