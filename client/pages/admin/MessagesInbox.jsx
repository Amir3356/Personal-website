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
  MdMarkEmailRead,
  MdMarkEmailUnread,
  MdRefresh,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { api } from "@/lib/api";
import Modal from "./Modal";

const columnHelper = createColumnHelper();

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
    } catch {
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
      setError(err.message);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "no",
        header: "No",
        cell: (info) => (
          <span className="font-mono text-xs text-muted">{info.row.index + 1}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => (
          <div className="min-w-0">
            <p className="truncate text-ink">{info.row.original.name}</p>
            <p className="truncate font-mono text-xs text-cyan-neon">{info.getValue()}</p>
          </div>
        ),
      }),
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => (
          <span className="block max-w-[16rem] truncate">
            {info.getValue() || <span className="text-muted">(no subject)</span>}
          </span>
        ),
      }),
      columnHelper.accessor("message", {
        header: "Message",
        enableSorting: false,
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
                  setRead(msg, !msg.read);
                }}
                aria-label={msg.read ? "Mark as unread" : "Mark as read"}
                title={msg.read ? "Mark as unread" : "Mark as read"}
                className="p-2 text-muted transition-colors hover:text-cyan-neon"
              >
                {msg.read ? <MdMarkEmailUnread size={18} /> : <MdMarkEmailRead size={18} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(msg.id);
                }}
                aria-label="Delete message"
                title="Delete"
                className="p-2 text-muted transition-colors hover:text-red-500"
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

  const table = useTable({
    _features: { rowSortingFeature },
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    data: messages,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  const unread = messages.filter((m) => !m.read).length;

  if (loading) return <p className="font-mono text-muted">Loading messages…</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {messages.length} message{messages.length === 1 ? "" : "s"}
          {unread > 0 && <span className="ml-2 text-cyan-neon">· {unread} unread</span>}
        </p>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-md border border-line/60 px-3 py-1.5 text-sm text-muted transition-colors hover:bg-line/40 hover:text-ink"
        >
          <MdRefresh size={18} /> Refresh
        </button>
      </div>

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
                        className={`px-4 py-3 font-mono text-xs tracking-wider text-muted uppercase ${
                          header.id === "action" ? "text-right" : ""
                        }`}
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
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-4 py-3 align-top ${msg.read ? "" : "font-semibold"}`}
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
