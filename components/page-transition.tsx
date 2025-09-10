"use client"

import { motion } from "framer-motion"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ opacity: { duration: 0.4 }, y: { duration: 0.6, ease: "easeOut" } }}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "subpixel-antialiased",
      }}
    >
      {children}
    </motion.div>
  )
} 