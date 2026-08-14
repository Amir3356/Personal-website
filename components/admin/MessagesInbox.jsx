"use client";

import { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  createSortedRowModel,
  flexRender,
  rowSortingFeature,
  sortFns,
  useTable,
} from "@tanstack/react-table";
import {
  MdDelete,
  MdVisibility,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { api } from "@/services";
import Modal from "@/components/ui/Modal";

const columnHelper = createColumnHelper();

/**
 * Which columns drop away as the viewport narrows. Written as plain literals so
 * Tailwind's scanner picks the utilities up — it can't see class names that are
 * only ever assembled at runtime.
 */
const HIDE_CLASSES = {
  no: "hidden sm:table-cell",
  phone: "hidden md:table-cell",
  subject: "hidden md:table-cell",
  message: "hidden lg:table-cell",
};

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);
  const [sorting, setSorting] = useState([]);

  const load = async () => {
    try {
      setMessages(await api.getMessages());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setRead = async (msg, read) => {
    setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read } : m)));
    try {
      await api.markMessageRead(msg.id, read);
    } catch (err) {
      // A 404 means this row is stale — the message was deleted elsewhere (another
      // tab, another device). Close it and resync rather than leaving a row on
      // screen that no longer exists, which would 404 again on the next click.
      if (err.status === 404) {
        setActive((current) => (current?.id === msg.id ? null : current));
        setError("That message no longer exists — refreshing the list.");
      }
      load(); // resync if the server rejected it
    }
  };

  const openMessage = (msg) => {
    setActive(msg);
    if (!msg.read) setRead(msg, true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.deleteMessage(id);
      setMessages((list) => list.filter((m) => m.id !== id));
      setActive((current) => (current?.id === id ? null : current));
    } catch (err) {
      // Already gone server-side: the intent succeeded, so drop the stale row
      // instead of reporting an error for a message that no longer exists.
      if (err.status === 404) {
        setMessages((list) => list.filter((m) => m.id !== id));
        setActive((current) => (current?.id === id ? null : current));
        return;
      }
      setError(err.message);
    }
  };

  const columns = useMemo(
    () => [
      // `meta.className` drives which columns survive on narrow screens. The
      // literals are repeated in HIDE_CLASSES so Tailwind's scanner sees them.
      columnHelper.display({
        id: "no",
        header: "No",
        meta: { className: HIDE_CLASSES.no },
        cell: (info) => (
          <span className="font-mono text-xs text-muted">{info.row.index + 1}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => (
          <div className="min-w-0 max-w-[9rem] sm:max-w-none">
            <p className="truncate text-ink">{info.row.original.name}</p>
            <p className="truncate font-mono text-xs text-cyan-neon">{info.getValue()}</p>
            {/* Phone folds in here once its own column is hidden */}
            {info.row.original.phone && (
              <p className="truncate font-mono text-xs text-muted md:hidden">
                {info.row.original.phone}
              </p>
            )}
            {/* Subject folds in here once its own column is hidden */}
            <p className="mt-0.5 truncate text-xs text-muted md:hidden">
              {info.row.original.subject || "(no subject)"}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("phone", {
        header: "Phone Number",
        meta: { className: HIDE_CLASSES.phone },
        cell: (info) =>
          info.getValue() ? (
            <a
              href={`tel:${info.getValue().replace(/[^\d+]/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-xs whitespace-nowrap text-cyan-neon hover:underline"
            >
              {info.getValue()}
            </a>
          ) : (
            <span className="text-muted">—</span>
          ),
      }),
      columnHelper.accessor("subject", {
        header: "Subject",
        meta: { className: HIDE_CLASSES.subject },
        cell: (info) => (
          <span className="block max-w-[16rem] truncate">
            {info.getValue() || <span className="text-muted">(no subject)</span>}
          </span>
        ),
      }),
      columnHelper.accessor("message", {
        header: "Message",
        enableSorting: false,
        meta: { className: HIDE_CLASSES.message },
        cell: (info) => (
          <span className="block max-w-sm truncate text-muted">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => {
          const msg = info.row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMessage(msg);
                }}
                aria-label={`View message from ${msg.name}`}
                title="View message"
                className="p-2.5 text-muted transition-colors hover:text-cyan-neon sm:p-2"
              >
                <MdVisibility size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(msg.id);
                }}
                aria-label={`Delete message from ${msg.name}`}
                title="Delete"
                className="p-2.5 text-muted transition-colors hover:text-red-500 sm:p-2"
              >
                <MdDelete size={18} />
              </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  // v9 takes features and row models together under `features`.
  const table = useTable({
    features: {
      rowSortingFeature,
      sortFns,
      sortedRowModel: createSortedRowModel(sortFns),
    },
    data: messages,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  const unread = messages.filter((m) => !m.read).length;

  if (loading) return <p className="font-mono text-muted">Loading messages…</p>;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">
        {messages.length} message{messages.length === 1 ? "" : "s"}
        {unread > 0 && <span className="ml-2 text-cyan-neon">· {unread} unread</span>}
      </p>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line/60 px-6 py-12 text-center text-muted">
          No messages yet. Submissions from your contact form will appear here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line/60">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line/60 bg-line/20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={`px-3 py-3 font-mono text-xs tracking-wider text-muted uppercase sm:px-4 ${
                          header.id === "action" ? "text-right" : ""
                        } ${header.column.columnDef.meta?.className ?? ""}`}
                      >
                        {canSort ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline-flex items-center gap-1 transition-colors hover:text-ink"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {sorted === "asc" && <MdArrowUpward size={14} />}
                            {sorted === "desc" && <MdArrowDownward size={14} />}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => {
                const msg = row.original;
                return (
                  <tr
                    key={row.id}
                    onClick={() => openMessage(msg)}
                    className={`cursor-pointer border-b border-line/40 transition-colors last:border-0 hover:bg-line/20 ${
                      msg.read ? "" : "bg-cyan-neon/5"
                    }`}
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-3 py-3 align-top sm:px-4 ${msg.read ? "" : "font-semibold"} ${
                          cell.column.columnDef.meta?.className ?? ""
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.subject || "(no subject)"}
      >
        {active && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-ink">{active.name}</p>
              <p className="font-mono text-xs text-cyan-neon">{active.email}</p>
              {active.phone && (
                <a
                  href={`tel:${active.phone.replace(/[^\d+]/g, "")}`}
                  className="font-mono text-xs text-cyan-neon hover:underline"
                >
                  {active.phone}
                </a>
              )}
              <p className="mt-1 font-mono text-xs text-muted">
                {new Date(active.createdAt).toLocaleString()}
              </p>
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-line text-ink">
              {active.message}
            </p>

            <a
              href={`mailto:${active.email}?subject=${encodeURIComponent(
                `Re: ${active.subject || "your message"}`
              )}`}
              className="w-fit font-mono text-xs tracking-wider text-cyan-neon uppercase hover:underline"
            >
              Reply by email →
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
