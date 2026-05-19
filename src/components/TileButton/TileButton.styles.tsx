import { cva } from "class-variance-authority";

export const tileButtonVariants = cva(
  "relative w-[80px] h-[80px] flex items-center justify-center border rounded-[2px] overflow-hidden transition-colors",
  {
    variants: {
      state: {
        hidden: "bg-bg-mid border-[#3a2e22] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
        peeked: "bg-bg-mid border-[#3a2e22]",
        revealed: "",
      },
      disabled: {
        true: "cursor-default",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      {
        state: "hidden",
        disabled: false,
        class: "hover:border-accent-gold hover:shadow-gold-glow-sm",
      },
    ],
    defaultVariants: {
      disabled: false,
    },
  },
);

export const effectStyles = {
  attack: {
    revealed: "bg-accent-blood/[0.15] border-accent-blood text-accent-blood",
    label: "攻撃",
  },
  curse: {
    revealed: "bg-accent-curse/[0.15] border-accent-curse text-accent-curse",
    label: "呪い",
  },
  blessing: {
    revealed: "bg-accent-blessing/[0.12] border-accent-blessing text-accent-blessing",
    label: "加護",
  },
  treasure: {
    revealed: "bg-accent-gold/[0.12] border-accent-gold text-accent-gold",
    label: "宝物",
  },
  empty: {
    revealed: "bg-transparent border-[#5a4f4a] text-[#5a4f4a]",
    label: "",
  },
} as const;
