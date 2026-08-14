import { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { api } from "@/services";
import { useStatus, attempt } from "@/handlers";
import Modal from "@/components/ui/Modal";

const EMPTY = { period: "", role: "", company: "", description: "" };

export default function ExperiencePanel({ settings, onSaved }) {
  const [heading, setHeading] = useState(settings?.experience?.heading || "");
  const [badge, setBadge] = useState(settings?.experience?.badge || "");
  const [savingHeading, setSavingHeading] = useState(false);
  const headingStatus = useStatus();

  const [experiences, setExperiences] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.getExperience().then(setExperiences).catch((e) => setStatus(e.message));

  useEffect(() => {
    load();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleHeadingSave = async (e) => {
    e.preventDefault();
    setSavingHeading(true);
    headingStatus.clear();

    const [experience, error] = await attempt(() =>
      api.updateExperienceSettings({ heading, badge })
    );

    if (error) headingStatus.showError(error);
    else {
      onSaved?.({ experience });
      headingStatus.showSuccess("Saved successfully");
    }
    setSavingHeading(false);
  };

  const closeModal = () => {
    if (busy) return; // don't drop a save that's already in flight
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
    setStatus("");
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setStatus("");
    setOpen(true);
  };

  const handleEdit = (exp) => {
    setOpen(true);
    setEditing(exp);
    setForm({
      period: exp.period || "",
      role: exp.role || "",
      company: exp.company || "",
      description: exp.description || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const payload = { ...form, kind: "work", tags: [] };
    try {
      if (editing) await api.updateExperience(editing.id, payload);
      else await api.createExperience(payload);
      setOpen(false);
      setEditing(null);
      setForm(EMPTY);
      await load();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await api.deleteExperience(id);
      if (editing?.id === id) closeModal();
      await load();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Experiences</h2>
          <p className="mt-1 text-sm text-muted">Your work and education timeline.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-violet-neon px-4 py-2 text-white transition-colors hover:bg-violet-500"
        >
          <MdAdd /> New
        </button>
      </div>

      {/* Section heading shown above the timeline on the live site */}
      <form
        onSubmit={handleHeadingSave}
        className="flex flex-col gap-4 rounded-xl border border-line/60 bg-line/20 p-5"
      >
        <h3 className="font-bold text-ink">Section Heading</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Experiences(3 years)"
          />
          <Field
            label="Badge"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="Overall 3 Years Experiences"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={savingHeading}
            className="w-fit rounded-md bg-cyan-neon px-6 py-2 font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
          >
            {savingHeading ? "Saving…" : "Save"}
          </button>
          {headingStatus.status && (
            <span
              role="status"
              className={`text-sm ${headingStatus.isError ? "text-red-400" : "text-cyan-neon"}`}
            >
              {headingStatus.status}
            </span>
          )}
        </div>
      </form>

      <div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <article
              key={exp.id}
              className={`group flex flex-col rounded-xl border bg-void/50 p-5 transition-colors ${
                editing?.id === exp.id
                  ? "border-cyan-neon/70"
                  : "border-line/60 hover:border-violet-neon/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex rounded-full border border-violet-neon/30 bg-violet-neon/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-cyan-neon uppercase">
                  {exp.kind === "education" ? "Education" : "Work"}
                </span>

                {/* Always visible on touch — hover reveal only where a pointer exists */}
                <div className="flex shrink-0 gap-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100">
                  <button
                    onClick={() => handleEdit(exp)}
                    aria-label={`Edit ${exp.role}`}
                    className="grid h-9 w-9 place-items-center lg:h-8 lg:w-8 rounded-md text-muted transition-colors hover:bg-line/40 hover:text-cyan-neon"
                  >
                    <MdEdit size={17} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    aria-label={`Delete ${exp.role}`}
                    className="grid h-9 w-9 place-items-center lg:h-8 lg:w-8 rounded-md text-muted transition-colors hover:bg-line/40 hover:text-red-500"
                  >
                    <MdDelete size={17} />
                  </button>
                </div>
              </div>

              <h3 className="mt-3 font-bold text-ink">{exp.role}</h3>
              <p className="mt-1 text-sm text-muted">{exp.company}</p>
              <p className="mt-2 font-mono text-xs text-cyan-neon">{exp.period}</p>

              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">
                {exp.description}
              </p>
            </article>
          ))}
        </div>

        {experiences.length === 0 && (
          <p className="rounded-xl border border-dashed border-line/60 px-6 py-10 text-center text-muted">
            No experiences yet. Click “New” to add your first one.
          </p>
        )}

      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? "Edit Experience" : "Add Experience"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field label="Role" value={form.role} onChange={set("role")} required />
          <Field label="Company" value={form.company} onChange={set("company")} required />
          <Field
            label="Period"
            value={form.period}
            onChange={set("period")}
            placeholder="e.g. 2026 · 3-Month Internship"
            required
          />
          <Field label="Description" value={form.description} onChange={set("description")} textarea required />

          {status && <p className="text-sm text-red-400">{status}</p>}

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-md bg-cyan-neon px-6 py-2.5 font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
            >
              {busy ? "Saving…" : editing ? "Save Changes" : "Create"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              disabled={busy}
              className="rounded-md border border-line/60 px-6 py-2.5 transition-colors hover:bg-line/40 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, textarea, ...props }) {
  const cls =
    "rounded-md border border-line/60 bg-void px-3 py-2 text-ink focus:border-cyan-neon focus:outline-none";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs tracking-wider text-muted uppercase">{label}</label>
      {textarea ? <textarea rows={6} className={`${cls} resize-y`} {...props} /> : <input type="text" className={cls} {...props} />}
    </div>
  );
}
