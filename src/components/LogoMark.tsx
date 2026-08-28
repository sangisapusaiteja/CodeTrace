interface LogoMarkProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export default function LogoMark({
  size = "md",
  className = "",
}: LogoMarkProps) {
  const sizeClasses = {
    xs: "h-7 w-7 rounded-lg",
    sm: "h-10 w-10 rounded-xl",
    md: "h-20 w-20 rounded-2xl",
    lg: "h-24 w-24 rounded-2xl",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-emerald-500/25 bg-gradient-to-br from-neutral-900 to-black ${sizeClasses[size]} ${className}`}
      style={{ boxShadow: "0 0 30px rgba(34,197,94,0.12)" }}
    >
      <svg viewBox="0 0 48 48" className="h-[72%] w-[72%]" aria-hidden="true">
        <defs>
          <linearGradient id="ctg" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* trace line */}
        <path
          d="M9 36 L9 18 L19 18 L19 28 L29 28 L29 14 L39 14"
          fill="none"
          stroke="url(#ctg)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* step markers */}
        <circle cx="9" cy="36" r="4" fill="#10b981" />
        <circle cx="19" cy="28" r="4" fill="#10b981" />
        <circle cx="29" cy="14" r="4" fill="#34d399" />
        <circle cx="39" cy="14" r="4.5" fill="#34d399" />

        {/* play triangle at the end */}
        <path d="M35.5 10.5 L42.5 14 L35.5 17.5 Z" fill="#34d399" />
      </svg>
    </div>
  );
}
