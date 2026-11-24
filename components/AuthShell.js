import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Icon from "./Icons";

// Split layout for login and signup: brand panel on the left, form on the right
export default function AuthShell({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col overflow-hidden bg-ink-900 p-12 text-white lg:flex">
        <Logo light />

        <div className="my-auto">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight">
            Keep every photo and PDF within reach.
          </h2>
          <ul className="mt-8 space-y-4 text-ink-200">
            {[
              "100 MB of free storage for every account",
              "Photos and PDFs up to 4 MB each",
              "Private to you, protected by your login",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="hidden text-sm font-medium text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white lg:block"
          >
            Back to home
          </Link>
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}