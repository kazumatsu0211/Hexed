import { cva } from "class-variance-authority";

export const itemButtonVariants = cva(
  "w-14 h-14 flex items-center justify-center rounded border-2 transition-colors",
  {
    variants: {
      state: {
        idle: "bg-bg-mid border-accent-gold-dim hover:border-accent-gold cursor-pointer",
        selected:
          "bg-accent-gold/20 border-accent-gold ring-2 ring-accent-gold/40",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
    },
    compoundVariants: [
      {
        state: "idle",
        disabled: true,
        class: "hover:border-accent-gold-dim", // hover 効果を弱める
      },
    ],
    defaultVariants: {
      disabled: false,
    },
  },
);
