"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { SupportBotChat } from "@/components/dashboard/support-bot-chat";
import Image from "next/image";

export function SupportBotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="onboarding-support-btn" className="fixed right-3 -bottom-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SupportBotChat onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-30 w-30"
        size="icon"
        variant="ghost"
        aria-label={isOpen ? "Закрити чат підтримки" : "Відкрити чат підтримки"}
      >
        <motion.div
          className="pointer-events-none relative z-10 -mr-2 shrink-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/image/support-agent.svg"
            alt="AI-агент помічник-супорт"
            width={100}
            height={100}
            className="h-30 w-30"
            priority
          />
        </motion.div>
      </Button>
    </div>
  );
}
