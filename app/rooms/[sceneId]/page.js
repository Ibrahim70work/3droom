import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getRoomById } from "@/lib/site-data";

const SceneFullscreenExperience = dynamic(
  () => import("@/components/SceneFullscreenExperience"),
  { ssr: false },
);

export default function ScenePage({ params, searchParams }) {
  const room = getRoomById(params.sceneId);

  if (!room) {
    notFound();
  }

  const frameIndex = Number.parseInt(searchParams?.frame ?? "0", 10);
  const mode = searchParams?.mode === "orbit" ? "orbit" : "inspect";

  return <SceneFullscreenExperience room={room} frameIndex={Number.isNaN(frameIndex) ? 0 : frameIndex} mode={mode} />;
}
