export const company = {
  name: "Kaia Build House",
  short: "KBH",
  tagline: "Spaces with precision",
  phone: "+91 98765 43210",
  email: "studio@kaiabuildhouse.com",
};

export const rooms = [
  {
    id: "scene-1",
    code: "Scene 01",
    title: "Signature Lounge",
    summary: "A warm open-plan space with premium detailing and a calm architectural flow.",
    image: "/panoramas/scene1.jpg",
    frames: [
      { label: "Wide frame", pitch: 18, yaw: 180, hfov: 108 },
      { label: "Upper frame", pitch: 44, yaw: 182, hfov: 94 },
      { label: "Detail frame", pitch: 6, yaw: 156, hfov: 82 },
    ],
  },
  {
    id: "scene-2",
    code: "Scene 02",
    title: "Chef Kitchen",
    summary: "Crisp surfaces, layered illumination, and a refined material palette.",
    image: "/panoramas/scene2.jpg",
    mobileImage: "/panoramas/scene2-mobile.jpg",
    frames: [
      { label: "Wide frame", pitch: 16, yaw: 176, hfov: 108 },
      { label: "Upper frame", pitch: 40, yaw: 180, hfov: 94 },
      { label: "Detail frame", pitch: 8, yaw: 158, hfov: 82 },
    ],
  },
  {
    id: "scene-3",
    code: "Scene 03",
    title: "Primary Suite",
    summary: "Soft textures and balanced proportions for a calm residential mood.",
    image: "/panoramas/scene3.jpg",
    mobileImage: "/panoramas/scene3-mobile.jpg",
    frames: [
      { label: "Wide frame", pitch: 20, yaw: 184, hfov: 109 },
      { label: "Upper frame", pitch: 46, yaw: 188, hfov: 95 },
      { label: "Detail frame", pitch: 7, yaw: 168, hfov: 83 },
    ],
  },
  {
    id: "scene-4",
    code: "Scene 04",
    title: "Private Bedroom",
    summary: "Elegant symmetry, subtle contrast, and a polished architectural finish.",
    image: "/panoramas/scene4.jpg",
    frames: [
      { label: "Wide frame", pitch: 17, yaw: 180, hfov: 108 },
      { label: "Upper frame", pitch: 42, yaw: 186, hfov: 95 },
      { label: "Detail frame", pitch: 9, yaw: 166, hfov: 84 },
    ],
  },
];

export const stats = [
  { label: "Years of experience", value: "08+" },
  { label: "Projects completed", value: "180+" },
  { label: "Client satisfaction", value: "99%" },
];

export function getRoomById(sceneId) {
  return rooms.find((room) => room.id === sceneId) ?? null;
}
