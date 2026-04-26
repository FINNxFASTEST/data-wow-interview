import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
);
export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>
);
export const CalendarIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>
);
export const UsersIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"/><circle cx="9.5" cy="7" r="3.5"/><path d="M21 20v-1a4 4 0 0 0-3-3.87"/><path d="M16.5 3.5a3.5 3.5 0 0 1 0 7"/></svg>
);
export const StarIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2 2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 17l-6.1 3.3 1.5-6.7L2.3 9l6.8-.7L12 2Z"/></svg>
);
export const HeartIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20.8 6.6a5 5 0 0 0-7-.2L12 8l-1.8-1.6a5 5 0 1 0-7 7.2l.3.3L12 22l8.5-8.1.3-.3a5 5 0 0 0 0-7Z"/></svg>
);
export const ChevronLIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.8" {...p}><path d="m15 18-6-6 6-6"/></svg>
);
export const ChevronRIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.8" {...p}><path d="m9 18 6-6-6-6"/></svg>
);
export const ChevronDIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.8" {...p}><path d="m6 9 6 6 6-6"/></svg>
);
export const FlameIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-3-6.5 0 1.5-1 2-2 2 0-2 1-4-2-7-1 2-3 4-3 7 0 2-2 2-2 0-1 1-2 3-2 4.5a7 7 0 0 0 7 7Z"/></svg>
);
export const DropletIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M12 2s-6 7-6 12a6 6 0 0 0 12 0c0-5-6-12-6-12Z"/></svg>
);
export const BoltIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>
);
export const WifiIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 15.8a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/><path d="M2 9a15 15 0 0 1 20 0"/></svg>
);
export const ShowerIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M12 3v4"/><path d="M6 9h12l-2 4H8l-2-4Z"/><path d="M9 16v2M12 15v3M15 16v2"/></svg>
);
export const CarIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M5 13 7 8h10l2 5"/><rect x="3" y="13" width="18" height="5" rx="1.5"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>
);
export const TentIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 20 12 4l9 16"/><path d="M12 4v16"/><path d="M8 20l4-6 4 6"/></svg>
);
export const LeafIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M20 4C10 4 4 10 4 18c0 1 .2 2 .5 2.5C5 21 11 21 15 17s5-9 5-13Z"/><path d="M4 20c4-5 8-8 14-12"/></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="2" {...p}><path d="M4 12.5 10 18 20 6"/></svg>
);
export const PlusIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.8" {...p}><path d="M12 5v14M5 12h14"/></svg>
);
export const MinusIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.8" {...p}><path d="M5 12h14"/></svg>
);
export const ShareIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8 11 8-4M8 13l8 4"/></svg>
);
export const MapIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v16M15 6v16"/></svg>
);
export const ArrowRIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>
);
export const QuoteIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 7h4v4H9c0 3 0 4 2 4v2c-3 0-4-2-4-6V7Zm9 0h4v4h-2c0 3 0 4 2 4v2c-3 0-4-2-4-6V7Z"/></svg>
);
export const CupIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M4 8h14v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M18 10h2a2 2 0 0 1 0 4h-2"/><path d="M8 3c.5 1 .5 2 0 3M12 3c.5 1 .5 2 0 3"/></svg>
);
export const DogIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M5 12c-1-2-1-5 1-6 1 0 2 1 2 2h8c0-1 1-2 2-2 2 1 2 4 1 6l-1 2v5H6v-5l-1-2Z"/><circle cx="10" cy="13" r="0.6" fill="currentColor"/><circle cx="14" cy="13" r="0.6" fill="currentColor"/></svg>
);
export const MoonIcon = (p: IconProps) => (
  <svg {...base} strokeWidth="1.5" {...p}><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/></svg>
);
