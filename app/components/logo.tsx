export function Logo({ className }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: logo is decorative, site name is present alongside it
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="312 763 1424 522"
      className={`text-black dark:text-white ${className ?? ''}`}
    >
      <path
        d="M 1731.8956521739133 1280.4452173913044 L 316.10434782608695 1024 L 1219.0052173913045 1280.4452173913044 L 695.4295652173913 767.5547826086956 L 1731.8956521739133 1280.4452173913044"
        fill="none"
        stroke="currentColor"
        strokeWidth={20}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
