export default defineEventHandler((event) => {
  setHeader(event, "content-type", "application/manifest+json; charset=utf-8");
  return {
    name: "Kenya Import Duty Calculator",
    short_name: "Duty Calculator",
    description: "Calculate vehicle and cargo import taxes using KRA's official CRSP methodology",
    start_url: "/import-duty-calculator.html",
    display: "standalone",
    background_color: "#071122",
    theme_color: "#dc2626",
    orientation: "portrait",
    icons: [
      { src: "/images/kenya-tradex-logo.png", sizes: "192x192", type: "image/png" },
      { src: "/images/kenya-tradex-logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
});
