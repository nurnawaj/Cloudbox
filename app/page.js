import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import AppPreview from "@/components/AppPreview";
import Logo from "@/components/Logo";
import Icon from "@/components/Icons";

// Server component: if already logged in, go straight to the dashboard
export default function Home() {
  if (getUserId()) redirect("/dashboard");

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="mx-auto grid min-h-[calc(100vh-4rem-5rem)] max-w-7xl items-center gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              Store it once. Open it anywhere.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-600 dark:text-ink-300">
              A simple cloud space for your files. Upload once and open them from anywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-ink-300 bg-white px-6 py-3 font-semibold text-ink-800 hover:bg-ink-100 dark:border-ink-700 dark:bg-transparent dark:text-ink-100 dark:hover:bg-ink-800"
              >
                Log in
              </Link>
            </div>
          </div>

          <AppPreview />
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16 border-y border-ink-200 bg-white py-20 dark:border-ink-800 dark:bg-ink-900/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">Everything you need to keep your files in order</h2>

            <div className="mt-12 grid gap-5 md:grid-cols-6">
              {/* Drag and drop */}
              <div className="rounded-3xl bg-brand-50 p-7 dark:bg-brand-900/30 md:col-span-4">
                <h3 className="text-xl font-bold">Drop files anywhere</h3>
                <p className="mt-2 max-w-md text-ink-600 dark:text-ink-300">
                  Drag photos or PDFs onto the page, or pick several at once. Each upload shows its own progress bar.
                </p>
                <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-300 bg-white/70 p-5 dark:border-brand-700 dark:bg-ink-900/60">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                      <Icon name="upload" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Holiday album.pdf</p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700">
                        <div className="h-full w-3/4 rounded-full bg-brand-500" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-brand-700 dark:text-brand-300">75%</span>
                  </div>
                </div>
              </div>

              {/* Storage */}
              <div className="rounded-3xl border border-ink-200 p-7 dark:border-ink-800 md:col-span-2">
                <h3 className="text-xl font-bold">Know your space</h3>
                <p className="mt-2 text-ink-600 dark:text-ink-300">
                  Free for every account, with a live meter showing what is left.
                </p>
                <p className="mt-6 font-display text-4xl font-extrabold">100 MB</p>
              </div>

              {/* Preview */}
              <div className="rounded-3xl border border-ink-200 p-7 dark:border-ink-800 md:col-span-2">
                <h3 className="text-xl font-bold">Preview in a click</h3>
                <p className="mt-2 text-ink-600 dark:text-ink-300">
                  Open any photo full screen and flip through the rest with the arrow keys.
                </p>
              </div>

              {/* Search */}
              <div className="rounded-3xl border border-ink-200 p-7 dark:border-ink-800 md:col-span-2">
                <h3 className="text-xl font-bold">Find files fast</h3>
                <p className="mt-2 text-ink-600 dark:text-ink-300">
                  Search by name, filter to photos or PDFs, and sort by date, name or size.
                </p>
              </div>

              {/* Theme */}
              <div className="rounded-3xl bg-ink-900 p-7 text-white dark:bg-ink-800 md:col-span-2">
                <h3 className="text-xl font-bold">Easy on the eyes</h3>
                <p className="mt-2 text-ink-300">Switch between dark and light. CloudBox remembers your choice.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-200 py-8 dark:border-ink-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-ink-500 sm:flex-row sm:px-6 dark:text-ink-400">
          <Logo />
          <p>Built by Nurnawaj with love ❤️</p>
        </div>
      </footer>
    </>
  );
}