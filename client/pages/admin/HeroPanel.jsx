import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import UploadField from "./UploadField";

export default function HeroPanel({ settings, onSaved }) {
  const [image, setImage] = useState(settings.hero.image || "");
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
      const hero = await api.updateHero({ image });
      onSaved({ hero });
      setIsError(false);
      setStatus("Image uploaded successfully");
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
        <h2 className="font-display text-2xl font-bold">Hero Image</h2>
        <p className="mt-1 text-sm text-muted">The portrait shown in your hero section.</p>
      </div>

      <UploadField
        label="Portrait"
        value={image}
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        onChange={setImage}
        hint="PNG, JPG, WEBP, GIF or AVIF · max 5MB"
        noun="image"
        preview
        uploadOnly
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy || !image}
          className="rounded-md bg-cyan-neon px-6 py-2 font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save Changes"}
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
