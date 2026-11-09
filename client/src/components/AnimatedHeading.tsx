import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

export default function AnimatedHeading({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const element = useRef<HTMLHeadingElement>(null);
  const seen = useInView(element, { once: true, amount: .2 });
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const visible = !mounted || reduced || seen;
  return <motion.h2 ref={element} id={id} className={className} initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }} transition={{ duration: reduced ? 0 : .45, ease: 'easeOut' }}>{children}</motion.h2>;
}
