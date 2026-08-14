"use client";

import { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { api } from "@/services";
import Modal from "@/components/ui/Modal";

const EMPTY = { title: "", icon: "◈", skills: "" };

// Glyphs used by the live cards. Offered as presets so the icon stays visually
// consistent with the existing groups instead of drifting into emoji.
const ICONS = ["◈", "◆", "▤", "▣", "◉", "◇", "▨", "⬢", "✦", "⬡"];

export default function TechstackPanel() {
  const [groups, setGroups] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api.getTechstack().then(setGroups).catch((e) => setStatus(e.message));

  useEffect(() => {
    load();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

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

  const handleEdit = (group) => {
    setOpen(true);
    setEditing(group);
    setStatus("");
    setForm({
      title: group.title || "",
      icon: group.icon || "◈",
      // The form edits skills as one comma-separated line; the API splits it.
      skills: (group.skills || []).join(", "),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      if (editing) await api.updateTechstack(editing.id, form);
      else await api.createTechstack(form);
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
    if (!confirm("Delete this techstack group?")) return;
    try {
      await api.deleteTechstack(id);
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
          <h2 className="font-display text-xl font-bold sm:text-2xl">Techstack</h2>
          <p className="mt-1 text-sm text-muted">
            Skill groups shown in the Techstack section.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-violet-neon px-4 py-2 text-white transition-colors hover:bg-violet-500"
        >
          <MdAdd /> New
        </button>
      </div>

      {status && !open && <p className="text-sm text-red-400">{status}</p>}

      <div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <article
              key={group.id}
              className={`group flex flex-col rounded-xl border bg-void/50 p-5 transition-colors ${
                editing?.id === group.id
                  ? "border-cyan-neon/70"
                  : "border-line/60 hover:border-violet-neon/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl text-cyan-neon">{group.icon}</span>

                {/* Always visible on touch — hover reveal only where a pointer exists */}
                <div className="flex shrink-0 gap-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100">
                  <button
                    onClick={() => handleEdit(group)}
                    aria-label={`Edit ${group.title}`}
                    className="grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-line/40 hover:text-cyan-neon lg:h-8 lg:w-8"
                  >
                    <MdEdit size={17} />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    aria-label={`Delete ${group.title}`}
                    className="grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-line/40 hover:text-red-500 lg:h-8 lg:w-8"
                  >
                    <MdDelete size={17} />
                  </button>
                </div>
              </div>

              <h3 className="mt-3 font-bold text-ink">{group.title}</h3>
              <p className="mt-1 font-mono text-xs text-muted">
                {group.skills?.length || 0} skill
                {group.skills?.length === 1 ? "" : "s"}
              </p>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {(group.skills || []).map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line/60 bg-line/20 px-2.5 py-1 text-xs text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {groups.length === 0 && (
          <p className="rounded-xl border border-dashed border-line/60 px-6 py-10 text-center text-muted">
            No techstack groups yet. Click “New” to add your first one.
          </p>
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? "Edit Techstack Group" : "Add Techstack Group"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field
            label="Title"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Frontend"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-wider text-muted uppercase">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  aria-label={`Use icon ${icon}`}
                  aria-pressed={form.icon === icon}
                  className={`grid h-10 w-10 place-items-center rounded-md border text-xl transition-colors ${
                    form.icon === icon
                      ? "border-cyan-neon bg-cyan-neon/10 text-cyan-neon"
                      : "border-line/60 text-muted hover:bg-line/40 hover:text-ink"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Skills (comma separated)"
            value={form.skills}
            onChange={set("skills")}
            placeholder="React (Vite), Next.js, React Native (Expo)"
            textarea
            required
          />

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
      {textarea ? (
        <textarea rows={3} className={`${cls} resize-y`} {...props} />
      ) : (
        <input type="text" className={cls} {...props} />
      )}
    </div>
  );
}
