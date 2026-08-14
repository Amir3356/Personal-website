import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdImage,
  MdTitle,
  MdFileDownload,
  MdWork,
  MdMail,
  MdTimeline,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { api } from "@/services";
import { useAuth } from "@/context/AuthContext";
import Login from "./admin/Login";
import HeroPanel from "./admin/HeroPanel";
import HeroTextPanel from "./admin/HeroTextPanel";
import CvPanel from "./admin/CvPanel";
import ProjectsPanel from "./admin/ProjectsPanel";
import ContactPanel from "./admin/ContactPanel";
import ExperiencePanel from "./admin/ExperiencePanel";

const TABS = [
  { id: "hero", label: "Hero Image", icon: MdImage },
  { id: "heroText", label: "Hero Text", icon: MdTitle },
  { id: "cv", label: "Download CV", icon: MdFileDownload },
  { id: "projects", label: "My Projects", icon: MdWork },
  { id: "contact", label: "Contact Us", icon: MdMail },
  { id: "experience", label: "Experiences", icon: MdTimeline },
];

export default function Admin() {
  const { authed, checking, login, logout } = useAuth();
  const [tab, setTab] = useState("hero");
  const [settings, setSettings] = useState(null);
  const [unread, setUnread] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!authed) return;
    api.getSettings().then(setSettings).catch(() => setSettings(null));
    api
      .getMessages()
      .then((msgs) => setUnread(msgs.filter((m) => !m.read).length))
      .catch(() => setUnread(0));
  }, [authed, tab]);

  // Escape closes the drawer; lock page scroll while it's open.
  useEffect(() => {
    if (!navOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [navOpen]);

  const handleLogout = async () => {
    await logout();
    setSettings(null);
  };

  const handleSaved = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-void font-mono text-muted">Loading…</div>;
  }

  if (!authed) return <Login onLogin={login} />;

  return (
    <div className="min-h-screen bg-void font-sans text-ink selection:bg-cyan-neon/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-10">
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line/60 pb-5 sm:pb-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              aria-controls="admin-nav"
              aria-expanded={navOpen}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line/60 text-ink transition-colors hover:bg-line/40 lg:hidden"
            >
              <MdMenu size={22} />
            </button>
            <h1 className="truncate font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
              Admin Dashboard
            </h1>
          </div>
          <Link
            to="/"
            className="font-mono text-xs tracking-widest text-cyan-neon uppercase hover:underline sm:text-sm"
          >
            ← <span className="hidden sm:inline">Back to </span>Site
          </Link>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
          {/* Drawer below lg, static rail from lg up */}
          <nav
            id="admin-nav"
            className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r border-line/60 bg-surface p-4 transition-[transform,visibility] duration-300 lg:visible lg:static lg:z-auto lg:w-56 lg:translate-x-0 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 ${
              navOpen ? "visible translate-x-0" : "invisible -translate-x-full"
            }`}
            aria-label="Dashboard sections"
          >
            <div className="mb-2 flex items-center justify-between lg:hidden">
              <span className="font-mono text-xs tracking-widest text-muted uppercase">Menu</span>
              <button
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-line/40 hover:text-ink"
              >
                <MdClose size={20} />
              </button>
            </div>

            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setNavOpen(false);
                }}
                className={`flex w-full shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                  tab === id
                    ? "bg-violet-neon/15 font-semibold text-cyan-neon"
                    : "text-muted hover:bg-line/30 hover:text-ink"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {label}
                {id === "contact" && unread > 0 && (
                  <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-cyan-neon px-1.5 text-[11px] font-bold text-black">
                    {unread}
                  </span>
                )}
              </button>
            ))}

            <div className="mt-1 h-px w-full shrink-0 bg-line/60" aria-hidden />

            <button
              onClick={handleLogout}
              className="flex w-full shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <MdLogout size={20} className="shrink-0" />
              Logout
            </button>
          </nav>

          {/* Backdrop — only while the drawer is open below lg */}
          {navOpen && (
            <div
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
          )}

          <main className="min-w-0 flex-1">
            {/* Only the hero/CV panels read from settings. */}
            {/* Panels that read from settings can't render until it loads. */}
            {!settings && tab !== "projects" && tab !== "contact" ? (
              <p className="font-mono text-muted">Loading settings…</p>
            ) : (
              <>
                {tab === "hero" && <HeroPanel settings={settings} onSaved={handleSaved} />}
                {tab === "heroText" && <HeroTextPanel settings={settings} onSaved={handleSaved} />}
                {tab === "cv" && <CvPanel settings={settings} onSaved={handleSaved} />}
                {tab === "projects" && <ProjectsPanel />}
                {tab === "contact" && <ContactPanel />}
                {tab === "experience" && (
                  <ExperiencePanel settings={settings} onSaved={handleSaved} />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
