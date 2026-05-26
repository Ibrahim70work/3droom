"use client";

import { motion } from "framer-motion";

export default function UIOverlay({
  brand,
  projectTitle,
  roomTitle,
  roomSubtitle,
  hint,
  isFullscreen,
  onFullscreenToggle,
  onZoomIn,
  onZoomOut,
  rooms,
  activeRoomIndex,
  onSelectRoom,
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-40"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
    >
      <div className="absolute inset-x-0 top-0 flex flex-col gap-4 p-4 md:p-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="pointer-events-auto max-w-xl rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl md:px-6 md:py-5">
          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.38em] text-white/45">
                {brand}
              </p>
              <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">
                {projectTitle}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/65 md:text-[0.95rem]">
                Premium construction showcase with four immersive 360 spaces, designed
                to feel architectural, calm, and high-end.
              </p>
            </div>

            <div className="hidden rounded-full border border-white/10 px-4 py-2 text-right xl:block">
              <p className="text-[0.6rem] uppercase tracking-[0.38em] text-white/40">
                Active room
              </p>
              <p className="mt-1 text-sm text-white/85">{roomTitle}</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
          <button
            type="button"
            onClick={onZoomOut}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={onFullscreenToggle}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-4 text-xs uppercase tracking-[0.28em] text-white/80 transition hover:border-white/20 hover:bg-white/10"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 md:p-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="pointer-events-auto max-w-xl rounded-[1.5rem] border border-white/10 bg-black/35 px-5 py-4 backdrop-blur-xl md:px-6 md:py-5">
          <p className="text-[0.68rem] uppercase tracking-[0.4em] text-white/45">
            Showcase
          </p>
          <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">
            {roomTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70 md:text-[0.95rem]">
            {roomSubtitle}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.34em] text-white/45">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              Drag to explore
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              Wheel or pinch to zoom
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              Vertical look enabled
            </span>
          </div>
        </div>

        <div className="pointer-events-auto w-full max-w-3xl rounded-[1.75rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/45">
              4-room demo
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/40">
              {hint}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {rooms.map((room, index) => {
              const isActive = index === activeRoomIndex;

              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => onSelectRoom(index)}
                  className={`group relative overflow-hidden rounded-[1.2rem] border text-left transition duration-300 ${
                    isActive
                      ? "border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${room.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.58))]" />
                  <div className="relative flex h-40 flex-col justify-between p-4 md:h-44">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.36em] text-white/50">
                          {room.code}
                        </p>
                        <p className="mt-2 font-display text-lg text-white">
                          {room.title}
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                          isActive ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    </div>
                    <p className="text-sm leading-5 text-white/70">{room.summary}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
