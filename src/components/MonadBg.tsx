/** Monad 风格背景：紫色光晕 + 速度线 */
export function MonadBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -top-1/3 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 rounded-full bg-[#6E3AFF]/25 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#B794FF]/15 blur-[80px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="monad-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B794FF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#monad-grid)" />
      </svg>
      <div className="absolute top-20 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#6E3AFF]/50 to-transparent" />
      <div className="absolute top-24 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#6E3AFF]/20 to-transparent" />
    </div>
  );
}
