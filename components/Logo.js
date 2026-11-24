import Link from "next/link";
import Icon from "./Icons";

export default function Logo({ light = false, href = "/" }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="CloudBox home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <Icon name="cloud" className="h-5 w-5" />
      </span>
      <span
        className={
          "font-display text-xl font-bold tracking-tight " +
          (light ? "text-white" : "text-ink-900 dark:text-white")
        }
      >
        CloudBox
      </span>
    </Link>
  );
}
