import Icon from "./Icons";


const TILES = [
  { name: "Goa trip.jpg", size: "2.1 MB", bg: "from-sun-400 to-coral-500" },
  { name: "Resume.pdf", size: "310 KB", pdf: true },
  { name: "Campus.png", size: "1.4 MB", bg: "from-brand-300 to-brand-600" },
  { name: "Fee receipt.pdf", size: "88 KB", pdf: true },
  { name: "Sunset.jpg", size: "3.2 MB", bg: "from-coral-400 to-ink-700" },
  { name: "Team photo.jpg", size: "2.8 MB", bg: "from-ink-300 to-brand-500" },
];

export default function AppPreview() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl shadow-ink-900/10 dark:border-ink-700 dark:bg-ink-900 dark:shadow-black/40"
    >
      
      <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 dark:border-ink-800">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-coral-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-sun-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
        </div>
        <div className="mx-auto w-2/3 max-w-xs rounded-md bg-ink-100 px-3 py-1 text-center text-xs text-ink-500 dark:bg-ink-800 dark:text-ink-400">
          cloudbox.app/dashboard
        </div>
      </div>

      <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[132px_1fr]">
        {/* mini sidebar */}
        <div className="flex flex-col gap-1 border-r border-ink-100 p-3 text-xs font-medium dark:border-ink-800">
          <div className="flex items-center gap-2 rounded-md bg-brand-50 px-2 py-1.5 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            <Icon name="folder" className="h-3.5 w-3.5" /> All files
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-ink-500 dark:text-ink-400">
            <Icon name="image" className="h-3.5 w-3.5" /> Photos
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-ink-500 dark:text-ink-400">
            <Icon name="file" className="h-3.5 w-3.5" /> PDFs
          </div>
          
        </div>

        {/* mini file grid */}
        <div className="p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 flex-1 items-center gap-2 rounded-md bg-ink-100 px-2 text-xs text-ink-400 dark:bg-ink-800">
              <Icon name="search" className="h-3.5 w-3.5" /> Search files
            </div>
            <div className="flex h-7 items-center gap-1 rounded-md bg-brand-600 px-2.5 text-xs font-semibold text-white">
              <Icon name="upload" className="h-3.5 w-3.5" /> Upload
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {TILES.map((t) => (
              <div key={t.name} className="overflow-hidden rounded-lg border border-ink-100 dark:border-ink-800">
                {t.pdf ? (
                  <div className="flex aspect-[4/3] items-center justify-center bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-400">
                    <Icon name="file" className="h-7 w-7" />
                  </div>
                ) : (
                  <div className={"aspect-[4/3] bg-gradient-to-br " + t.bg} />
                )}
                <div className="px-2 py-1.5">
                  <p className="truncate text-[11px] font-medium">{t.name}</p>
                  <p className="text-[10px] text-ink-500 dark:text-ink-400">{t.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
