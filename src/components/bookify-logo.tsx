import Link from "next/link";

type BookifyLogoProps = {
  href?: string;
  tone?: "light" | "dark";
  label?: string;
};

export function BookifyLogo({ href = "/", tone = "dark", label = "BookifyNow" }: BookifyLogoProps) {
  const isLight = tone === "light";
  const markClass = isLight
    ? "border-white/25 bg-white/10 text-[#f5ead9]"
    : "border-[#d6c7b5] bg-[#fffaf3] text-[#7d5f3b]";
  const wordmarkClass = isLight ? "text-white" : "text-[#1f1812]";
  const submarkClass = isLight ? "text-white/54" : "text-[#8b7157]";

  return (
    <Link href={href} className="inline-flex items-center gap-3" aria-label={`${label} home`}>
      <span
        className={`grid h-10 w-10 place-items-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ${markClass}`}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 5.5h10A2.5 2.5 0 0 1 19.5 8v9A2.5 2.5 0 0 1 17 19.5H7A2.5 2.5 0 0 1 4.5 17V8A2.5 2.5 0 0 1 7 5.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 4v3M16 4v3M5 9.5h14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
          <path
            d="m8.5 14 2.2 2.2 4.8-5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
      <span className="grid leading-none">
        <span className={`text-lg font-semibold tracking-[0.12em] ${wordmarkClass}`}>{label}</span>
        <span className={`mt-1 text-[0.62rem] uppercase tracking-[0.34em] ${submarkClass}`}>
          Bookings
        </span>
      </span>
    </Link>
  );
}
