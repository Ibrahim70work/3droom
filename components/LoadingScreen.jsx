"use client";

import { motion } from "framer-motion";

export default function LoadingScreen({ label = "Loading scene", message = "Preparing immersive showcase..." }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#040404]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%,rgba(0,0,0,0.6))]" />
      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <motion.div
            className="h-16 w-16 rounded-full border border-white/35 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="space-y-2">
          <p className="font-display text-[0.68rem] uppercase tracking-[0.4em] text-white/45">{label}</p>
          <p className="text-sm text-white/80">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
