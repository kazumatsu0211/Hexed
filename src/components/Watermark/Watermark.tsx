import {
  ClubIcon,
  DiamondIcon,
  HeartIcon,
  type Icon,
  SpadeIcon,
} from "@phosphor-icons/react";

const WATERMARK_ICONS: Icon[] = [
  SpadeIcon,
  DiamondIcon,
  HeartIcon,
  ClubIcon,
  SpadeIcon,
  DiamondIcon,
  HeartIcon,
  ClubIcon,
  SpadeIcon,
  DiamondIcon,
  HeartIcon,
  ClubIcon,
];

export function Watermark() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {WATERMARK_ICONS.map((IconComp, i) => (
        <IconComp
          key={i}
          size={28 + (i % 4) * 8}
          weight="fill"
          className="absolute text-accent-gold opacity-[0.04]"
          style={{
            top: `${(i * 13 + 7) % 88}%`,
            left: `${(i * 19 + 5) % 88}%`,
          }}
        />
      ))}
    </div>
  );
}
