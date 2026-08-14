import { useState } from "react";
import { api } from "@/services";
import { useStatus, attempt } from "@/handlers";
import UploadField from "@/components/ui/UploadField";

export default function HeroPanel({ settings, onSaved }) {
  const [image, setImage] = useState(settings.hero.image || "");
  const [busy, setBusy] = useState(false);
  const { status, isError, showSuccess, showError, clear } = useStatus();

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    clear();

    const [hero, error] = await attempt(() => api.updateHero({ image }));
    if (error) {
      showError(error);
    } else {
      onSaved({ hero });
      showSuccess("Image uploaded successfully");
    }
    setBusy(false);
  };

  return (
    <form onSubmit={handleSave} className="flex max-w-xl flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Hero Image</h2>
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
