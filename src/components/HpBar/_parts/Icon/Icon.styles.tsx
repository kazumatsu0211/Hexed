import { cva } from "class-variance-authority";

export const iconVariants = cva("", {
  variants: {
    state: {
      filled: "text-accent-blood",
      empty: "text-accent-gold-dim",
    },
  },
});
