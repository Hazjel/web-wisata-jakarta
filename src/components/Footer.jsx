export default function Footer() {
  return (
    <footer className="mt-10 flex flex-col items-center gap-1.5 bg-night px-4 py-8 text-center text-[13px] text-white/70 print:hidden">
      <span className="font-head text-lg font-bold text-gold">Jakarta Routes</span>
      <span className="text-white/85">
        Rencanakan perjalananmu di Jakarta — pilih tempatnya, kami susun rutenya.
      </span>
      <span className="text-xs opacity-65">
        © 2026 · Dikembangkan oleh tim riset HUMIC, Telkom University
      </span>
    </footer>
  )
}
