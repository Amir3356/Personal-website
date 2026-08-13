import { useRef, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { api, API_URL } from "@/lib/api";

/**
 * File picker that uploads immediately and reports back the stored public path.
 * `accept` mirrors the mime types the server whitelists.
 *
 * `uploadOnly` hides the path text box so the value can only come from a real
 * uploaded file rather than a hand-typed path.
 */
export default function UploadField({
  label,
  value,
  accept,
  onChange,
  preview = false,
  uploadOnly = false,
  hint,
  noun = "file",
}) {
  const article = /^[aeiou]/i.test(noun) ? "an" : "a";
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // The picker's `accept` is only a filter — a user can still force any file
    // through it, so check the type before spending a round trip on it. Match
    // on extension too, since .md files often report text/plain or no type.
    const allowed = accept.split(",").map((t) => t.trim().toLowerCase());
    const name = file.name.toLowerCase();
    const ok = allowed.some((rule) =>
      rule.startsWith(".") ? name.endsWith(rule) : file.type.toLowerCase() === rule
    );

    if (!ok) {
      setError("Unsupported file type.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError("");
    setBusy(true);
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      // Reset so picking the same file again still fires a change event.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs tracking-wider text-muted uppercase">{label}</label>

      {preview && value && (
        <img
          src={value.startsWith("/uploads") ? `${API_URL}${value}` : value}
          alt="Current selection"
          className={
            uploadOnly
              ? "mx-auto aspect-4/5 w-44 rounded-lg border border-line/60 object-cover object-top"
              : "h-32 w-32 rounded-lg border border-line/60 object-cover"
          }
        />
      )}

      {uploadOnly ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line/60 px-6 py-8 text-center transition-colors hover:border-cyan-neon/60 hover:bg-line/20 disabled:opacity-50"
        >
          <MdCloudUpload size={28} className="text-muted" />
          <span className="text-sm font-medium text-ink">
            {busy ? "Uploading…" : value ? `Choose a different ${noun}` : `Choose ${article} ${noun}`}
          </span>
          {hint && <span className="text-xs text-muted">{hint}</span>}
        </button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/amir.png"
            className="flex-1 rounded-md border border-line/60 bg-void px-3 py-2 text-sm text-ink focus:border-cyan-neon focus:outline-none"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="shrink-0 rounded-md border border-line/60 px-4 py-2 text-sm transition-colors hover:bg-line/40 disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
