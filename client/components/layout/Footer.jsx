import { site } from "@/lib/data";
import { FaGithub, FaLinkedin, FaTelegramPlane } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const getIcon = (label) => {
  switch (label.toLowerCase()) {
    case "github":
      return <FaGithub className="w-5 h-5" />;
    case "linkedin":
      return <FaLinkedin className="w-5 h-5" />;
    case "email":
      return <MdEmail className="w-5 h-5" />;
    case "telegram":
      return <FaTelegramPlane className="w-5 h-5" />;
    default:
      return null;
  }
};

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
                className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:text-cyan-neon"
                aria-label={social.label}
              >
                {getIcon(social.label)}
                <span className="hidden sm:inline-block">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
