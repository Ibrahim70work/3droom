"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import PanoramaViewer from "@/components/PanoramaViewer";

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

export default function SceneFullscreenExperience({ room, frameIndex = 0, mode = "inspect" }) {
  const router = useRouter();
  const viewerRef = useRef(null);
  const orbitCalibrationRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const isMobileViewport = useIsMobileViewport();

  const frame = useMemo(() => room.frames[frameIndex] ?? room.frames[0], [frameIndex, room.frames]);
  const imageSrc = isMobileViewport && room.mobileImage ? room.mobileImage : room.image;
  const orbitEnabled = mode === "orbit";

  useEffect(() => {
    setIsReady(false);
  }, [imageSrc, frameIndex, room.id]);

  useEffect(() => {
    console.warn("[Orbit] useEffect triggered:", { orbitEnabled, frameIndex });
    
    if (!orbitEnabled) {
      console.warn("[Orbit] Orbit not enabled, skipping");
      return undefined;
    }

    console.warn("[Orbit] Starting orbit setup...");
    let cleanup;
    let handleOrientation = null;

    const setupDeviceOrientation = () => {
      handleOrientation = (event) => {
        const activeViewer = viewerRef.current?.getViewer?.();

        if (!activeViewer) {
          console.warn("[Orbit] No active viewer");
          return;
        }

        // Check for valid orientation values - skip if null/undefined on first fire
        const beta = event.beta;
        const gamma = event.gamma;

        if (beta === null || beta === undefined || gamma === null || gamma === undefined) {
          // Only warn if we've already calibrated (otherwise it's the initial browser event)
          if (orbitCalibrationRef.current) {
            console.warn("[Orbit] Received null values after calibration, skipping");
          }
          return;
        }

        if (!orbitCalibrationRef.current) {
          orbitCalibrationRef.current = {
            beta: beta,
            gamma: gamma,
            pitch: activeViewer.getPitch?.() ?? frame.pitch,
            yaw: activeViewer.getYaw?.() ?? frame.yaw,
          };
          console.warn("[Orbit] Calibrated:", orbitCalibrationRef.current);
          return;
        }

        const calibration = orbitCalibrationRef.current;
        const deltaYaw = (gamma - calibration.gamma) * 2.4;
        const deltaPitch = (beta - calibration.beta) * 1.4;

        const nextYaw = calibration.yaw + deltaYaw;
        const nextPitch = Math.max(-78, Math.min(78, calibration.pitch + deltaPitch));

        console.warn("[Orbit] Update:", { deltaYaw, deltaPitch, nextYaw, nextPitch });
        activeViewer.lookAt(nextPitch, nextYaw, undefined, false);
      };

      orbitCalibrationRef.current = null;
      console.warn("[Orbit] Setting up device orientation listener");
      window.addEventListener("deviceorientation", handleOrientation, false);
      
      return () => {
        console.log("[Orbit] Removing device orientation listener");
        if (handleOrientation) {
          window.removeEventListener("deviceorientation", handleOrientation);
        }
        orbitCalibrationRef.current = null;
      };
    };

    const initializeOrbit = async () => {
      try {
        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
          console.warn("[Orbit] iOS 13+ detected, requesting permission");
          const permission = await DeviceOrientationEvent.requestPermission();
          console.warn("[Orbit] Permission result:", permission);
          if (permission === "granted") {
            cleanup = setupDeviceOrientation();
          }
        } else {
          // Android or older iOS - setup immediately without permission
          console.warn("[Orbit] No permission API, setting up immediately (Android/older iOS)");
          cleanup = setupDeviceOrientation();
        }
      } catch (error) {
        console.warn("[Orbit] Setup error:", error);
        // Fallback: still try to setup even if permission request fails
        console.warn("[Orbit] Falling back to setup despite error");
        cleanup = setupDeviceOrientation();
      }
    };

    initializeOrbit();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [frame.pitch, frame.yaw, orbitEnabled]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const closeScene = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <main className="scene-fullscreen relative w-full h-screen overflow-hidden bg-[#030303] text-white">
      <PanoramaViewer
        ref={viewerRef}
        src={imageSrc}
        pitch={frame.pitch}
        yaw={frame.yaw}
        hfov={frame.hfov}
        minPitch={-85}
        maxPitch={85}
        minHfov={50}
        maxHfov={140}
        autoRotate={0}
        draggable={!orbitEnabled}
        onLoad={() => {
          setIsReady(true);
        }}
        onError={() => setIsReady(true)}
      />

      {!isReady ? (
        <LoadingScreen label={`Loading ${room.code}`} message="Preparing full-screen 360 scene..." />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4 md:p-6">
        <div className="pointer-events-auto rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.35em] text-white/70 backdrop-blur-xl">
          {room.title}
        </div>

        <button
          type="button"
          onClick={closeScene}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white/80 backdrop-blur-xl transition hover:border-white/25 hover:bg-black/55"
          aria-label="Close fullscreen scene"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ×
          </span>
        </button>
      </div>

      {orbitEnabled ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4">
          <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.35em] text-white/65 backdrop-blur-xl">
            Move your phone to explore
          </div>
        </div>
      ) : null}
    </main>
  );
}
