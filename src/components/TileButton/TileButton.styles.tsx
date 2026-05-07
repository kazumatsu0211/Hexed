import { cva } from "class-variance-authority";

export const tileButtonVariants = cva(
  "aspect-square flex items-center justify-center rounded-md border-2 transition-colors",
  {
    variants: {
      state: {
        hidden: "bg-bg-mid border-accent-gold-dim",
        peeked:
          "bg-bg-mid border-accent-gold-dim opacity-60 ring-2 ring-accent-gold/40",
        revealed: "bg-bg-dark border-accent-gold",
      },
      disabled: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      {
        state: "hidden",
        disabled: false,
        class: "hover:border-accent-gold cursor-pointer",
      },
    ],
    defaultVariants: {
      disabled: false,
    },
  },
);
