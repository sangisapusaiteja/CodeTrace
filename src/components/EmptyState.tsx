export function EmptyState({ title, message }: { title?: string; message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/5 text-accent">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      {title && <h2 className="mt-4 text-lg font-bold text-text">{title}</h2>}
      <p className="mt-2 max-w-md text-sm text-text-muted">{message}</p>
    </div>
  );
}
