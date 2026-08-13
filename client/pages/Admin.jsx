import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdImage, MdFileDownload, MdWork, MdMail, MdTimeline, MdLogout } from "react-icons/md";
import { api, getToken, clearToken } from "@/lib/api";
import Login from "./admin/Login";
import HeroPanel from "./admin/HeroPanel";
import CvPanel from "./admin/CvPanel";
import ProjectsPanel from "./admin/ProjectsPanel";
import ContactPanel from "./admin/ContactPanel";
import ExperiencePanel from "./admin/ExperiencePanel";

const TABS = [
  { id: "hero", label: "Hero Image", icon: MdImage },
  { id: "cv", label: "Download CV", icon: MdFileDownload },
  { id: "projects", label: "My Projects", icon: MdWork },
  { id: "contact", label: "Contact Us", icon: MdMail },
  { id: "experience", label: "Experiences", icon: MdTimeline },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("hero");
  const [settings, setSettings] = useState(null);
  const [unread, setUnread] = useState(0);

  // Validate any stored token before showing the dashboard.
  useEffect(() => {
    if (!getToken()) {
      setChecking(false);
      return;
    }
    api
      .me()
      .then(() => setAuthed(true))
      .catch(() => clearToken())
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    api.getSettings().then(setSettings).catch(() => setSettings(null));
    api
      .getMessages()
      .then((msgs) => setUnread(msgs.filter((m) => !m.read).length))
      .catch(() => setUnread(0));
  }, [authed, tab]);

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
    setSettings(null);
  };

  const handleSaved = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-void font-mono text-muted">Loading…</div>;
  }

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-void font-sans text-ink selection:bg-cyan-neon/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 p-6 lg:p-10">
        <header className="flex items-center justify-between border-b border-line/60 pb-6">
          <h1 className="font-display text-3xl font-bold lg:text-4xl">Admin Dashboard</h1>
          <div className="flex items-center gap-6">
            <Link to="/" className="font-mono text-sm tracking-widest text-cyan-neon uppercase hover:underline">
              ← Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-mono text-sm tracking-widest text-muted uppercase transition-colors hover:text-red-400"
            >
              <MdLogout /> Logout
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <nav className="flex shrink-0 gap-2 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm whitespace-nowrap transition-colors ${
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
          </nav>

          <main className="min-w-0 flex-1">
            {/* Only the hero/CV panels read from settings. */}
            {!settings && (tab === "hero" || tab === "cv") ? (
              <p className="font-mono text-muted">Loading settings…</p>
            ) : (
              <>
                {tab === "hero" && <HeroPanel settings={settings} onSaved={handleSaved} />}
                {tab === "cv" && <CvPanel settings={settings} onSaved={handleSaved} />}
                {tab === "projects" && <ProjectsPanel />}
                {tab === "contact" && <ContactPanel />}
                {tab === "experience" && <ExperiencePanel />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
