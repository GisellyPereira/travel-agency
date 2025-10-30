type PlayDemoProps = {
  className?: string;
};

export function PlayDemo({ className = "" }: PlayDemoProps) {
  return (
    <button className={`group inline-flex items-center gap-3 text-[15px] font-medium text-zinc-700 ${className}`}>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#DF6951]/15 transition-colors group-hover:bg-[#DF6951]/25">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
          <path d="M2 1.8v12.4L12 8 2 1.8Z" fill="#DF6951"/>
        </svg>
      </span>
      Play Demo
    </button>
  );
}


