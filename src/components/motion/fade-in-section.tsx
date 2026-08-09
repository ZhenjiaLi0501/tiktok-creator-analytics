'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type FadeInSectionProps = {
  children: ReactNode;
  delay?: number;
};

export function FadeInSection({ children, delay = 0 }: FadeInSectionProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.28,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}
