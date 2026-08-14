"use client";

import { useState } from "react";
import { MdDelete, MdAdd } from "react-icons/md";
import { api } from "@/services";
import { useStatus, attempt } from "@/handlers";

export default function HeroTextPanel({ settings, onSaved }) {
  const [headingStart, setHeadingStart] = useState(settings.hero.headingStart || "");
  const [highlights, setHighlights] = useState(settings.hero.headingHighlights || []);
  const [intro, setIntro] = useState(settings.hero.intro || "");
  const [ctaLabel, setCtaLabel] = useState(settings.hero.ctaLabel || "");
  const [busy, setBusy] = useState(false);
  const { status, isError, showSuccess, showError, clear } = useStatus();

  const updateHighlight = (index, value) =>
    setHighlights(highlights.map((h, i) => (i === index ? value : h)));

  const addHighlight = () => setHighlights([...highlights, ""]);
  const removeHighlight = (index) => setHighlights(highlights.filter((_, i) => i !== index));

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    clear();

    const [hero, error] = await attempt(() =>
      api.updateHero({
        headingStart,
        // Drop blanks so the typewriter never pauses on an empty string.
        headingHighlights: highlights.map((h) => h.trim()).filter(Boolean),
        intro,
        ctaLabel,
      })
    );

    if (error) showError(error);
    else {
      onSaved({ hero });
      showSuccess("Saved successfully");
    }
    setBusy(false);
  };

  return (
    <form onSubmit={handleSave} className="flex max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Hero Text</h2>
        <p className="mt-1 text-sm text-muted">
          The headline, intro paragraph and button label at the top of your site.
        </p>
      </div>

      <Field
        label="Heading Start"
        value={headingStart}
        onChange={(e) => setHeadingStart(e.target.value)}
        placeholder="Building Performance and "
        hint="Keep the trailing space — the rotating words follow straight after."
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs tracking-wider text-muted uppercase">
            Rotating Words
          </label>
          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center gap-1 text-sm text-cyan-neon hover:underline"
          >
            <MdAdd /> Add
          </button>
        </div>
        <p className="-mt-1 text-xs text-muted">
          Typed one after another in a loop after the heading.
        </p>

        {highlights.map((word, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={word}
              onChange={(e) => updateHighlight(i, e.target.value)}
              placeholder="scalable products"
              className="flex-1 rounded-md border border-line/60 bg-void px-3 py-2 text-sm text-ink focus:border-cyan-neon focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeHighlight(i)}
              aria-label={`Remove "${word || "empty"}"`}
              className="p-2 text-muted transition-colors hover:text-red-500"
            >
              <MdDelete size={18} />
            </button>
          </div>
        ))}
        {highlights.length === 0 && (
          <p className="text-sm text-muted">No rotating words — the heading shows on its own.</p>
        )}
      </div>

      <Field
        label="Intro Paragraph"
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
        textarea
      />

      <Field
        label="Button Label"
        value={ctaLabel}
        onChange={(e) => setCtaLabel(e.target.value)}
        placeholder="Contact Me"
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="w-fit rounded-md bg-cyan-neon px-6 py-2 font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        {status && (
          <span role="status" className={`text-sm ${isError ? "text-red-400" : "text-cyan-neon"}`}>
            {status}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({ label, hint, textarea, ...props }) {
  const cls =
    "rounded-md border border-line/60 bg-void px-3 py-2 text-ink focus:border-cyan-neon focus:outline-none";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs tracking-wider text-muted uppercase">{label}</label>
      {textarea ? (
        <textarea rows={5} className={`${cls} resize-y`} {...props} />
      ) : (
        <input type="text" className={cls} {...props} />
      )}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
