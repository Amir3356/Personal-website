import { site } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-6 py-8 lg:px-10">
        <ul className="flex flex-wrap items-center justify-center gap-6">
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
