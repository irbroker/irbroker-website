import type { ReactNode } from "react";

// Sem entrada animada: o único momento de movimento do site é a linha do método (MethodSteps).
export default function AnimatedHeading({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h2 id={id} className={className}>
      {children}
    </h2>
  );
}
