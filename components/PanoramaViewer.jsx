"use client";

import { forwardRef, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Pannellum } from "pannellum-react";

const PanoramaViewer = forwardRef(function PanoramaViewer(
  {
    src,
    pitch = 18,
    yaw = 180,
    hfov = 104,
    minHfov = 65,
    maxHfov = 120,
    minPitch = -60,
    maxPitch = 60,
    autoRotate = 0,
    draggable = true,
    onLoad,
    onError,
  },
  ref,
) {
  const containerRef = useRef(null);
  const touchDistanceRef = useRef(null);

  const getViewer = useCallback(
    () => (ref && typeof ref === "object" ? ref.current?.getViewer?.() : null),
    [ref],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        touchDistanceRef.current = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length !== 2 || !touchDistanceRef.current) return;

      const activeViewer = getViewer();
      if (!activeViewer) return;

      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const currentDistance = Math.hypot(dx, dy);
      const pinchDelta = currentDistance - touchDistanceRef.current;
      const currentHfov = activeViewer.getHfov?.() ?? hfov;
      const nextHfov = Math.max(minHfov, Math.min(maxHfov, currentHfov - pinchDelta * 0.6));

      activeViewer.setHfov?.(nextHfov, false);
      touchDistanceRef.current = currentDistance;
      event.preventDefault();
    };

    const handleTouchEnd = () => {
      touchDistanceRef.current = null;
    };

    const container = containerRef.current;
    container.addEventListener("touchstart", handleTouchStart, false);
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [getViewer, hfov, minHfov, maxHfov]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 bg-black"
      style={{ 
        touchAction: "none",
        pointerEvents: "auto",
        cursor: draggable ? "grab" : "default" 
      }}
      initial={{ scale: 1.04, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Pannellum
        ref={ref}
        width="100%"
        height="100%"
        image={src}
        pitch={pitch}
        yaw={yaw}
        hfov={hfov}
        minHfov={minHfov}
        maxHfov={maxHfov}
        minPitch={minPitch}
        maxPitch={maxPitch}
        autoLoad
        autoRotate={autoRotate}
        draggable={draggable}
        showControls={false}
        showZoomCtrl={false}
        showFullscreenCtrl={false}
        mouseZoom={true}
        keyboardZoom={true}
        onLoad={onLoad}
        onError={onError}
      />
    </motion.div>
  );
});

export default PanoramaViewer;
