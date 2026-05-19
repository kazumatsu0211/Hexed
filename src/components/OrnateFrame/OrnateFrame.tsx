import type { ReactNode } from "react";

type OrnateFrameProps = {
  children: ReactNode;
};

export function OrnateFrame(props: OrnateFrameProps) {
  const { children } = props;

  return (
    <div className="relative">
      <div className="absolute top-1 left-1 w-5 h-5 pointer-events-none border-t border-l border-accent-gold opacity-60" />
      <div className="absolute top-1 right-1 w-5 h-5 pointer-events-none border-t border-r border-accent-gold opacity-60" />
      <div className="absolute bottom-1 left-1 w-5 h-5 pointer-events-none border-b border-l border-accent-gold opacity-60" />
      <div className="absolute bottom-1 right-1 w-5 h-5 pointer-events-none border-b border-r border-accent-gold opacity-60" />
      {children}
    </div>
  );
}
