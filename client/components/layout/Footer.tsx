import { site } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center sm:flex-row sm:text-left lg:px-10">
        <p className="font-mono text-xs tracking-widest text-muted">
          © {new Date().getFullYear()} {site.name} · {site.company}
        </p>
        <ul className="flex items-center gap-6">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:text-cyan-neon"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
