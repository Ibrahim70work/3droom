"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { company, rooms, stats } from "@/lib/site-data";

const PanoramaViewer = dynamic(() => import("@/components/PanoramaViewer"), {
  ssr: false,
});

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  return isMobile;
}

function SceneCard({ room, active = false, onFullscreen }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const frame = useMemo(() => room.frames[frameIndex], [room.frames, frameIndex]);
  const isMobileViewport = useIsMobileViewport();
  const imageSrc = isMobileViewport && room.mobileImage ? room.mobileImage : room.image;

  useEffect(() => {
    setIsReady(false);
  }, [frameIndex, imageSrc]);

  const openFullscreen = (orbitEnabled = false) => {
    onFullscreen?.({ room, frameIndex, orbitEnabled });
  };

  return (
    <article
      className={`group overflow-hidden rounded-[2rem] border bg-[#0b0b0b] transition duration-300 ${
        active ? "border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.14)]" : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-[4/3]">
        <PanoramaViewer
          key={`${room.id}-${frameIndex}`}
          src={imageSrc}
          pitch={frame.pitch}
          yaw={frame.yaw}
          hfov={frame.hfov}
          minPitch={-85}
          maxPitch={85}
          minHfov={50}
          maxHfov={140}
          autoRotate={0}
          draggable={true}
          onLoad={() => setIsReady(true)}
          onError={() => setIsReady(true)}
        />
        {!isReady ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-full border border-white/10 bg-black/35 px-5 py-4 text-center backdrop-blur-xl">
              <div className="h-10 w-10 rounded-full border border-white/30 border-t-transparent animate-spin" />
              <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/60">Loading {room.code}</p>
            </div>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.18)_30%,rgba(0,0,0,0.64))]" />

        <div className="pointer-events-none absolute left-4 top-4 hidden rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.35em] text-white/75 backdrop-blur-xl md:block">
          {room.code}
        </div>

        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => openFullscreen(false)}
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white/80 backdrop-blur-xl transition hover:border-white/25 hover:bg-black/55"
            aria-label={`Open ${room.title} fullscreen`}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ⤢
            </span>
          </button>
        </div>

        <div className="pointer-events-none absolute left-4 right-4 bottom-4 hidden space-y-4 md:block">
          <div>
            <h3 className="font-display text-2xl text-white md:text-[2rem]">{room.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{room.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[0.6rem] uppercase tracking-[0.32em] text-white/60">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2">360 room</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2">Horizontal orbit</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2">Vertical orbit</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5 md:hidden">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.38em] text-white/45">{room.code}</p>
          <h3 className="mt-3 font-display text-3xl text-white">{room.title}</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{room.summary}</p>
        </div>
      </div>

      <div className="border-t border-white/8 bg-white/5 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/45">Frame preset</p>
          <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/45">{frame.label}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {room.frames.map((item, index) => {
            const selected = index === frameIndex;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setFrameIndex(index)}
                className={`rounded-full border px-3 py-3 text-[0.62rem] uppercase tracking-[0.28em] transition ${
                  selected
                    ? "border-white/35 bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const router = useRouter();

  const openScene = ({ room, frameIndex, orbitEnabled }) => {
    const mode = orbitEnabled ? "orbit" : "inspect";
    router.push(`/rooms/${room.id}?frame=${frameIndex}&mode=${mode}`);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 border-b border-white/6 bg-black/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[0.68rem] uppercase tracking-[0.4em] text-white/80">
              {company.short}
            </div>
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.42em] text-white/45">{company.name}</p>
              <p className="mt-1 font-display text-lg text-white">{company.tagline}</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-[0.7rem] uppercase tracking-[0.35em] text-white/55 xl:flex">
            <a href="#showcase" className="transition hover:text-white">Showcase</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-[0.66rem] uppercase tracking-[0.35em] text-white/80 transition hover:border-white/25 hover:bg-white/10"
          >
            Book consultation
          </a>
        </div>
      </header>

      <section id="top" className="border-b border-white/6">
        <div className="mx-auto max-w-[1500px] px-4 py-12 md:px-8 md:py-16">
          <p className="text-[0.68rem] uppercase tracking-[0.5em] text-white/45">Premium architecture and construction demo</p>
          <div className="mt-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <h1 className="font-display text-5xl leading-[0.95] text-white md:text-7xl xl:text-[5.4rem]">
                Four rooms. One container. Real-time architectural showcase.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/68 md:text-lg md:leading-8">
                The site now focuses on a single concurrent 2x2 scene wall so all rooms are visible at once,
                with each card offering multiple camera-style frames inside a true 360 panorama viewer.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
                  <p className="font-display text-3xl text-white">{stat.value}</p>
                  <p className="mt-2 text-[0.68rem] uppercase tracking-[0.35em] text-white/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="mx-auto max-w-[1500px] px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.5em] text-white/45">Executed projects</p>
          <h2 className="mt-4 font-display text-3xl text-white md:text-5xl">All four scenes visible together.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
            One showcase wall presents all four rendered rooms at the same time,
            while each card can switch between wide, upper, and detail framing inside a 360 orbitable view.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {rooms.map((room) => (
            <SceneCard key={room.id} room={room} onFullscreen={openScene} />
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-white/6">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-12 md:px-8 md:py-16 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <p className="text-[0.68rem] uppercase tracking-[0.5em] text-white/45">Kaia Build House</p>
            <h2 className="mt-4 font-display text-3xl text-white md:text-5xl">Demo contact details</h2>
            <p className="mt-4 text-sm leading-7 text-white/62 md:text-base">
              This is a demo-only brand profile used for the showcase website.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/45">Contact person</p>
                <p className="mt-2 font-display text-2xl text-white">Maya Rao</p>
              </div>
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/45">Phone</p>
                <p className="mt-2 text-white/80">{company.phone}</p>
              </div>
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/45">Email</p>
                <p className="mt-2 text-white/80">{company.email}</p>
              </div>
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/45">Studio</p>
                <p className="mt-2 text-white/80">Hyderabad, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1500px] px-4 py-10 md:px-8">
        <div className="flex flex-col gap-6 border-t border-white/8 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.45em] text-white/45">{company.name}</p>
            <p className="mt-2 font-display text-2xl text-white">2026 Demo Edition</p>
          </div>
          <div className="flex flex-wrap gap-3 text-[0.62rem] uppercase tracking-[0.35em] text-white/50">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Rendered room walls</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Concurrent view</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Frame switching</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
