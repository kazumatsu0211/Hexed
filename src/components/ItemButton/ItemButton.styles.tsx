import { cva } from "class-variance-authority";

export const itemButtonVariants = cva(
  "w-[68px] h-[68px] flex items-center justify-center border rounded-[2px] transition-colors",
  {
    variants: {
      state: {
        idle: "bg-transparent border-accent-gold-dim text-accent-gold-dim hover:border-accent-gold hover:text-accent-gold cursor-pointer",
        selected:
          "bg-accent-gold/[0.12] border-accent-gold text-accent-gold shadow-gold-glow-xs cursor-pointer",
      },
      disabled: {
        true: "cursor-not-allowed opacity-30",
        false: "",
      },
    },
    compoundVariants: [
      {
        state: "idle",
        disabled: true,
        class: "hover:border-accent-gold-dim hover:text-accent-gold-dim",
      },
    ],
    defaultVariants: {
      disabled: false,
    },
  },
);
