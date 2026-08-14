"use client";

import { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { api } from "@/services";
import { assetUrl } from "@/hooks/useSettings";
import UploadField from "@/components/ui/UploadField";
import Modal from "@/components/ui/Modal";

const EMPTY = { title: "", description: "", detail: "", tags: "", image: "", href: "" };

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.getProjects().then(setProjects).catch((e) => setStatus(e.message));

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

  const handleEdit = (project) => {
    setOpen(true);
    setEditing(project);
    setForm({
      title: project.title || "",
      description: project.description || "",
      detail: project.detail || "",
      tags: (project.tags || []).join(", "),
      image: project.image || "",
      href: project.href || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editing) await api.updateProject(editing.id, payload);
      else await api.createProject(payload);
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
    if (!confirm("Delete this project?")) return;
    try {
      await api.deleteProject(id);
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
          <h2 className="font-display text-xl font-bold sm:text-2xl">My Projects</h2>
          <p className="mt-1 text-sm text-muted">Manage the work shown in your projects grid.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-violet-neon px-4 py-2 text-white transition-colors hover:bg-violet-500"
        >
          <MdAdd /> New
        </button>
      </div>

      <div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {projects.map((p) => (
              <article
                key={p.id}
                className={`group flex flex-col overflow-hidden rounded-xl border bg-void/50 transition-colors ${
                  editing?.id === p.id
                    ? "border-cyan-neon/70"
                    : "border-line/60 hover:border-violet-neon/50"
                }`}
              >
                <div className="relative aspect-16/10 overflow-hidden bg-line/20">
                  {p.image ? (
                    <img
                      src={assetUrl(p.image)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center font-mono text-xs text-muted uppercase">
                      No image
                    </div>
                  )}

                  {/* Actions float over the cover so cards stay compact */}
                  {/* Always visible on touch — hover reveal only where a pointer exists */}
                  <div className="absolute top-2 right-2 flex gap-1.5 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100">
                    <button
                      onClick={() => handleEdit(p)}
                      aria-label={`Edit ${p.title}`}
                      className="grid h-9 w-9 place-items-center lg:h-8 lg:w-8 rounded-md bg-void/80 text-muted backdrop-blur-sm transition-colors hover:text-cyan-neon"
                    >
                      <MdEdit size={17} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      aria-label={`Delete ${p.title}`}
                      className="grid h-9 w-9 place-items-center lg:h-8 lg:w-8 rounded-md bg-void/80 text-muted backdrop-blur-sm transition-colors hover:text-red-500"
                    >
                      <MdDelete size={17} />
                    </button>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                  <h3 className="truncate font-bold text-ink">{p.title}</h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted">{p.description}</p>

                  {p.tags?.length > 0 && (
                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {p.tags.slice(0, 3).map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-violet-neon/30 bg-violet-neon/10 px-2 py-0.5 font-mono text-[10px] text-cyan-neon"
                        >
                          {tag}
                        </li>
                      ))}
                      {p.tags.length > 3 && (
                        <li className="px-1 py-0.5 font-mono text-[10px] text-muted">
                          +{p.tags.length - 3}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>

        {projects.length === 0 && (
          <p className="rounded-xl border border-dashed border-line/60 px-6 py-10 text-center text-muted">
            No projects yet. Click “New” to add your first one.
          </p>
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field label="Title" value={form.title} onChange={set("title")} required />
          <Field
            label="Description"
            value={form.description}
            onChange={set("description")}
            textarea
            required
            hint="Short summary shown on the project card."
          />
          <Field
            label="View Detail Description"
            value={form.detail}
            onChange={set("detail")}
            textarea
            hint="The only thing shown in the View Details popup."
          />
          <Field label="Techstack" value={form.tags} onChange={set("tags")} placeholder="React, Node.js" />
          <Field
            label="Link (GitHub / live URL)"
            value={form.href}
            onChange={set("href")}
            placeholder="https://github.com/…"
            hint="Optional. Shown as “Open project” in the View Details popup."
          />

          <UploadField
            label="Cover Image"
            value={form.image}
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            hint="PNG, JPG, WEBP, GIF or AVIF · max 5MB"
            noun="image"
            preview
            uploadOnly
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

function Field({ label, textarea, hint, type = "text", ...props }) {
  const cls =
    "rounded-md border border-line/60 bg-void px-3 py-2 text-ink focus:border-cyan-neon focus:outline-none";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs tracking-wider text-muted uppercase">{label}</label>
      {textarea ? (
        <textarea rows={4} className={`${cls} resize-y`} {...props} />
      ) : (
        <input type={type} className={cls} {...props} />
      )}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
