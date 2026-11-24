"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Icon from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // Vercel accepts request bodies up to 4.5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

// ---------- small helpers ----------
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
const isImage = (f) => f.mime_type.startsWith("image/");
// Ask Cloudinary for a small, optimised thumbnail instead of the full photo
function thumb(url) {
  return url.includes("/upload/") ? url.replace("/upload/", "/upload/c_fill,w_520,h_390,q_auto,f_auto/") : url;
}

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white";

// ---------- pieces of the screen ----------
function StorageMeter({ storage }) {
  const percent = Math.min(100, Math.round((storage.used / storage.limit) * 100));
  const nearlyFull = percent >= 90;
  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">Storage</span>
        <span className={nearlyFull ? "font-medium text-coral-600 dark:text-coral-400" : "text-ink-500 dark:text-ink-400"}>
          {percent}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
        <div
          className={"h-full rounded-full transition-all duration-500 " + (nearlyFull ? "bg-coral-500" : "bg-brand-500")}
          style={{ width: percent + "%" }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
        {formatSize(storage.used)} of {formatSize(storage.limit)} used
      </p>
    </div>
  );
}

function Sidebar({ open, onClose, filter, setFilter, counts, storage, email, onLogout }) {
  const items = [
    { key: "all", label: "All files", icon: "folder", count: counts.all },
    { key: "image", label: "Photos", icon: "image", count: counts.image },
    { key: "pdf", label: "PDFs", icon: "file", count: counts.pdf },
  ];
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-ink-950/50 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-200 bg-white p-4 transition-transform dark:border-ink-800 dark:bg-ink-900 lg:static lg:z-auto lg:w-64 lg:translate-x-0 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="mb-6 flex items-center justify-between px-1">
          <Logo href="/dashboard" />
          <button onClick={onClose} className={iconBtn + " lg:hidden"} aria-label="Close menu">
            <Icon name="x" />
          </button>
        </div>

        <nav className="flex flex-col gap-1" aria-label="File types">
          {items.map((it) => {
            const active = filter === it.key;
            return (
              <button
                key={it.key}
                onClick={() => {
                  setFilter(it.key);
                  onClose();
                }}
                aria-current={active ? "page" : undefined}
                className={
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium " +
                  (active
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                    : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800")
                }
              >
                <Icon name={it.icon} className="h-5 w-5" />
                <span className="flex-1 text-left">{it.label}</span>
                <span className="text-xs text-ink-500 dark:text-ink-400">{it.count}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <StorageMeter storage={storage} />
          <div className="flex items-center gap-3 rounded-xl p-1">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold uppercase text-white">
              {email ? email[0] : "?"}
            </span>
            <p className="min-w-0 flex-1 truncate text-sm font-medium" title={email}>
              {email || "Your account"}
            </p>
            <button onClick={onLogout} className={iconBtn} aria-label="Log out" title="Log out">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function FileThumb({ f }) {
  if (isImage(f)) {
    return <img src={thumb(f.url)} alt="" loading="lazy" className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-400">
      <Icon name="file" className="h-10 w-10" />
      <span className="rounded bg-coral-500 px-1.5 py-0.5 text-xs font-bold text-white">PDF</span>
    </div>
  );
}

// Opens the preview for photos, or the PDF in a new tab
function OpenArea({ f, onPreview, className, children }) {
  if (isImage(f)) {
    return (
      <button type="button" onClick={() => onPreview(f)} className={className} aria-label={"Preview " + f.name}>
        {children}
      </button>
    );
  }
  return (
    <a href={f.url} target="_blank" rel="noreferrer" className={className} aria-label={"Open " + f.name}>
      {children}
    </a>
  );
}

function FileActions({ f, onDelete }) {
  return (
    <div className="flex shrink-0 items-center">
      <a href={`/api/files/${f.id}`} className={iconBtn} aria-label={"Download " + f.name} title="Download">
        <Icon name="download" className="h-[18px] w-[18px]" />
      </a>
      <button
        onClick={() => onDelete(f)}
        className={iconBtn + " hover:!bg-coral-50 hover:!text-coral-600 dark:hover:!bg-coral-500/10 dark:hover:!text-coral-400"}
        aria-label={"Delete " + f.name}
        title="Delete"
      >
        <Icon name="trash" className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

function FileCard({ f, onPreview, onDelete }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <OpenArea f={f} onPreview={onPreview} className="block aspect-[4/3] w-full overflow-hidden bg-ink-100 dark:bg-ink-800">
        <FileThumb f={f} />
      </OpenArea>
      <div className="flex items-center gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" title={f.name}>{f.name}</p>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            {formatSize(f.size)}, {formatDate(f.created_at)}
          </p>
        </div>
        <FileActions f={f} onDelete={onDelete} />
      </div>
    </li>
  );
}

function FileRow({ f, onPreview, onDelete }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-2.5 dark:border-ink-800 dark:bg-ink-900">
      <OpenArea f={f} onPreview={onPreview} className="block h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <FileThumb f={f} />
      </OpenArea>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" title={f.name}>{f.name}</p>
        <p className="text-xs text-ink-500 dark:text-ink-400 sm:hidden">{formatSize(f.size)}</p>
      </div>
      <p className="hidden w-24 text-sm text-ink-500 dark:text-ink-400 sm:block">{formatSize(f.size)}</p>
      <p className="hidden w-32 text-sm text-ink-500 dark:text-ink-400 md:block">{formatDate(f.created_at)}</p>
      <FileActions f={f} onDelete={onDelete} />
    </li>
  );
}

function PreviewModal({ images, index, onClose, onMove }) {
  const f = images[index];
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onMove(-1);
      if (e.key === "ArrowRight") onMove(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onMove]);

  if (!f) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in flex-col bg-ink-950/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={"Preview of " + f.name}
      onClick={onClose}
    >
      <div className="mb-3 flex items-center gap-3 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{f.name}</p>
          <p className="text-sm text-ink-300">
            {formatSize(f.size)}, {index + 1} of {images.length}
          </p>
        </div>
        <a
          href={`/api/files/${f.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
        >
          <Icon name="download" className="h-4 w-4" /> Download
        </a>
        <button onClick={onClose} className="rounded-lg bg-white/10 p-2 hover:bg-white/20" aria-label="Close preview">
          <Icon name="x" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <img
          src={f.url}
          alt={f.name}
          className="max-h-full max-w-full animate-pop rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onMove(-1); }}
              className="absolute left-0 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:left-2"
              aria-label="Previous photo"
            >
              <Icon name="chevronLeft" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMove(1); }}
              className="absolute right-0 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:right-2"
              aria-label="Next photo"
            >
              <Icon name="chevronRight" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmDelete({ file, busy, onCancel, onConfirm }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in items-center justify-center bg-ink-950/60 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        className="w-full max-w-sm animate-pop rounded-2xl bg-white p-6 shadow-2xl dark:bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-400">
          <Icon name="trash" />
        </span>
        <h2 id="delete-title" className="mt-4 text-lg font-bold">Delete this file?</h2>
        <p className="mt-1 break-words text-sm text-ink-600 dark:text-ink-300">
          <span className="font-medium">{file.name}</span> will be removed permanently. This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            autoFocus
            onClick={onCancel}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-medium hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-lg bg-coral-600 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-700 disabled:opacity-70"
          >
            {busy ? "Deleting" : "Delete file"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toasts({ toasts }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "pointer-events-auto flex max-w-md animate-pop items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg " +
            (t.type === "error" ? "bg-coral-600 text-white" : "bg-ink-900 text-white dark:bg-white dark:text-ink-900")
          }
        >
          <Icon name={t.type === "error" ? "alert" : "check"} className="h-4 w-4 shrink-0" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- the page ----------
export default function Dashboard() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [storage, setStorage] = useState({ used: 0, limit: 100 * 1024 * 1024 });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all"); // all | image | pdf
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid"); // grid | list
  const [menuOpen, setMenuOpen] = useState(false);

  const [uploads, setUploads] = useState([]); // files being uploaded right now
  const [dragging, setDragging] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const inputRef = useRef(null);
  const dragDepth = useRef(0);

  const toast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  // Get my files and my storage numbers from the server
  const loadFiles = useCallback(async () => {
    const res = await fetch("/api/files");
    if (res.status === 401) return router.push("/login"); // not logged in
    const data = await res.json();
    setFiles(data.files);
    setStorage(data.storage);
    setEmail(data.user?.email || "");
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // ----- upload (XMLHttpRequest, because fetch cannot report upload progress) -----
  function uploadOne(file, id) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/files");
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploads((list) => list.map((u) => (u.id === id ? { ...u, progress } : u)));
      };
      xhr.onload = () => {
        let data = {};
        try { data = JSON.parse(xhr.responseText); } catch {}
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          error: data.error || "Upload failed. Try again.",
        });
      };
      xhr.onerror = () => resolve({ ok: false, status: 0, error: "Upload failed. Check your connection." });
      const form = new FormData();
      form.append("file", file);
      xhr.send(form);
    });
  }

  async function handleFiles(fileList) {
    for (const file of [...fileList]) {
      if (!ALLOWED.includes(file.type)) {
        toast("error", `${file.name}: only photos and PDFs are allowed.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast("error", `${file.name} is larger than 4 MB.`);
        continue;
      }
      const id = Date.now() + Math.random();
      setUploads((l) => [...l, { id, name: file.name, progress: 0 }]);
      const result = await uploadOne(file, id);
      setUploads((l) => l.filter((u) => u.id !== id));
      if (result.status === 401) return router.push("/login");
      if (result.ok) {
        toast("success", `${file.name} uploaded`);
        await loadFiles();
      } else {
        toast("error", result.error);
      }
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    const res = await fetch(`/api/files/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      toast("success", `${toDelete.name} deleted`);
      setToDelete(null);
      loadFiles();
    } else {
      toast("error", "Could not delete the file. Try again.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  // ----- drag and drop anywhere on the page -----
  const hasFiles = (e) => [...(e.dataTransfer?.types || [])].includes("Files");
  const dragHandlers = {
    onDragEnter(e) {
      if (!hasFiles(e)) return;
      dragDepth.current++;
      setDragging(true);
    },
    onDragOver(e) {
      if (hasFiles(e)) e.preventDefault();
    },
    onDragLeave(e) {
      if (!hasFiles(e)) return;
      dragDepth.current--;
      if (dragDepth.current <= 0) setDragging(false);
    },
    onDrop(e) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
  };

  // ----- filter, search, sort -----
  const counts = useMemo(
    () => ({
      all: files.length,
      image: files.filter(isImage).length,
      pdf: files.filter((f) => !isImage(f)).length,
    }),
    [files]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = files.filter((f) => {
      if (filter === "image" && !isImage(f)) return false;
      if (filter === "pdf" && isImage(f)) return false;
      return !q || f.name.toLowerCase().includes(q);
    });
    const by = {
      newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      oldest: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      name: (a, b) => a.name.localeCompare(b.name),
      size: (a, b) => b.size - a.size,
    };
    return list.sort(by[sort]);
  }, [files, filter, search, sort]);

  // photos in the current list, used by the preview arrows
  const images = useMemo(() => visible.filter(isImage), [visible]);
  const previewIndex = images.findIndex((f) => f.id === previewId);
  const closePreview = useCallback(() => setPreviewId(null), []);
  const movePreview = useCallback(
    (step) => {
      if (images.length === 0) return;
      const i = images.findIndex((f) => f.id === previewId);
      setPreviewId(images[(i + step + images.length) % images.length].id);
    },
    [images, previewId]
  );

  const titles = { all: "All files", image: "Photos", pdf: "PDFs" };
  const Item = view === "grid" ? FileCard : FileRow;

  return (
    <div className="relative flex h-dvh overflow-hidden bg-ink-50 dark:bg-ink-950" {...dragHandlers}>
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        storage={storage}
        email={email}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-ink-200 bg-white px-3 dark:border-ink-800 dark:bg-ink-900 sm:gap-3 sm:px-6">
          <button onClick={() => setMenuOpen(true)} className={iconBtn + " h-9 w-9 lg:hidden"} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <div className="relative max-w-md flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              <Icon name="search" className="h-[18px] w-[18px]" />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your files"
              aria-label="Search your files"
              className="w-full rounded-xl border border-transparent bg-ink-100 py-2.5 pl-10 pr-3 text-sm placeholder:text-ink-500 focus:border-brand-500 focus:bg-white dark:bg-ink-800 dark:focus:bg-ink-900"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 sm:px-4"
            >
              <Icon name="upload" className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              hidden
              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{titles[filter]}</h1>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                  {visible.length} {visible.length === 1 ? "file" : "files"}
                  {search && ` matching "${search}"`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort files"
                  className="rounded-lg border border-ink-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-ink-700 dark:bg-ink-900"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name A to Z</option>
                  <option value="size">Largest first</option>
                </select>
                <div className="flex rounded-lg border border-ink-300 bg-white p-0.5 dark:border-ink-700 dark:bg-ink-900" role="group" aria-label="View">
                  {[["grid", "grid", "Grid view"], ["list", "list", "List view"]].map(([key, icon, label]) => (
                    <button
                      key={key}
                      onClick={() => setView(key)}
                      aria-label={label}
                      aria-pressed={view === key}
                      className={
                        "rounded-md p-1.5 " +
                        (view === key
                          ? "bg-brand-600 text-white"
                          : "text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white")
                      }
                    >
                      <Icon name={icon} className="h-[18px] w-[18px]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Uploads in progress */}
            {uploads.length > 0 && (
              <ul className="mb-5 space-y-2 rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
                {uploads.map((u) => (
                  <li key={u.id}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="truncate font-medium">{u.name}</span>
                      <span className="text-brand-700 dark:text-brand-300">{u.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900">
                      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: u.progress + "%" }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Files */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-ink-200 dark:bg-ink-800" />
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-ink-300 bg-white px-6 py-16 text-center dark:border-ink-700 dark:bg-ink-900">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <Icon name="upload" className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-xl font-bold">Upload your first file</h2>
                <p className="mt-2 max-w-sm text-ink-600 dark:text-ink-300">
                  Drag photos or PDFs onto this page, or choose them from your device. Each file can be up to 4 MB.
                </p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
                >
                  Choose files
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-3xl border border-ink-200 bg-white px-6 py-14 text-center dark:border-ink-800 dark:bg-ink-900">
                <h2 className="text-lg font-bold">No files match</h2>
                <p className="mt-1 text-ink-600 dark:text-ink-300">Try a different search or switch the file type.</p>
                <button
                  onClick={() => { setSearch(""); setFilter("all"); }}
                  className="mt-5 rounded-lg border border-ink-300 px-4 py-2 text-sm font-medium hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800"
                >
                  Clear search and filters
                </button>
              </div>
            ) : (
              <ul
                className={
                  view === "grid"
                    ? "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col gap-2"
                }
              >
                {visible.map((f) => (
                  <Item key={f.id} f={f} onPreview={(file) => setPreviewId(file.id)} onDelete={setToDelete} />
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>

      {/* Full-page drop target while dragging files over the window */}
      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-[55] flex animate-fade-in items-center justify-center bg-brand-600/20 p-6 backdrop-blur-sm">
          <div className="flex w-full max-w-lg flex-col items-center rounded-3xl border-2 border-dashed border-brand-500 bg-white px-8 py-14 text-center shadow-2xl dark:bg-ink-900">
            <Icon name="upload" className="h-10 w-10 text-brand-600" />
            <p className="mt-4 text-xl font-bold">Drop to upload</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">Photos and PDFs up to 4 MB</p>
          </div>
        </div>
      )}

      {previewIndex >= 0 && (
        <PreviewModal images={images} index={previewIndex} onClose={closePreview} onMove={movePreview} />
      )}
      {toDelete && (
        <ConfirmDelete file={toDelete} busy={deleting} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
