import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Igreja da Cidade Luanda",
    short_name: "Igreja da Cidade",
    description: "Comunidade da Igreja da Cidade Luanda.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#071a3d",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
