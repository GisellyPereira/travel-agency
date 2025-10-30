import { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  return (
    <p className={`text-[12px] font-semibold tracking-[0.18em] text-orange-600 ${className}`}>
      {children}
    </p>
  );
}


