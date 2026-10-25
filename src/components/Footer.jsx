export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#0c0f13]">
      <div className="rule w-full" />
      <div className="flex flex-col justify-between gap-6 px-6 py-10 text-xs text-white/40 sm:flex-row md:px-12">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-light tracking-[0.12em] text-white/80">GRAVEN</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#9aa4ae]">/ DRAFTING WORKS</span>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em]">
            GRAVEN — DRAFTING WORKS · SHEET SET 0001
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] sm:text-right">
          <p>Work · Method · Studio · Contact</p>
          <p className="mt-3 text-white/25">Drawn before it’s built — © 2026</p>
        </div>
      </div>
    </footer>
  );
}
