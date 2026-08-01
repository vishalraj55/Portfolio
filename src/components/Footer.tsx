export default function Footer() {
  return (
    <footer className="gutter py-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-label uppercase text-muted">
        © {new Date().getFullYear()} Vishal Rajbhar - end of reel
      </span>
      <span className="text-timecode text-muted">
        Built by vishalraj55
      </span>
    </footer>
  );
}
