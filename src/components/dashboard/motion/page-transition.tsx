"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
};
