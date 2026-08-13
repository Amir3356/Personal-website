import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import UploadField from "./UploadField";

export default function CvPanel({ settings, onSaved }) {
  const [cvUrl, setCvUrl] = useState(settings.hero.cvUrl || "");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef(null);

  // Clear a pending dismiss if the panel unmounts mid-countdown.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    clearTimeout(timerRef.current);

    try {
      const hero = await api.updateHero({ cvUrl });
      onSaved({ hero });
      setIsError(false);
      setStatus("CV uploaded successfully");
      // Errors stay put; only the success note auto-dismisses.
      timerRef.current = setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setIsError(true);
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex max-w-xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Download CV</h2>
        <p className="mt-1 text-sm text-muted">
          The file served by the “Download CV” button in your hero.
        </p>
      </div>

      <UploadField
        label="CV File"
        value={cvUrl}
        accept=".pdf,.doc,.docx,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown"
        onChange={setCvUrl}
        hint="PDF, DOC, DOCX or MD · max 5MB"
        noun="CV file"
        uploadOnly
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy || !cvUrl}
          className="rounded-md bg-cyan-neon px-6 py-2 font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
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
