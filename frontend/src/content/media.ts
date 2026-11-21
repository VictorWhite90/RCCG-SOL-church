// Illustrative photography supplied with the V5 design. Replace with approved
// church photography before launch (see assets/README.md).
export const photos = {
  worship: { src: "/media/v5/photo0.jpg", alt: "Congregation worshipping with raised hands" },
  welcome: { src: "/media/v5/photo1.jpg", alt: "Church members welcoming a family" },
  preacher: { src: "/media/v5/photo2.jpg", alt: "Pastor preaching with the choir behind him" },
  outreach: { src: "/media/v5/photo3.jpg", alt: "Volunteers handing out food packs" },
  arena: { src: "/media/v5/photo4.jpg", alt: "A full auditorium in worship" },
  serve: { src: "/media/v5/photo5.jpg", alt: "A volunteer serving an elderly neighbour" },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];

/**
 * Homepage hero.
 * REPLACE: `src` with a 15–30s silent clip from a real service (H.264 MP4, 1280–1920px wide,
 * ideally under 4 MB) and `poster` with a still frame from it.
 */
export const heroVideo = {
  src: "/media/v5/hero-demo.mp4",
  poster: "/media/v5/hero-poster.webp",
};

/**
 * Shown instead of the video on mobile data / data-saver connections.
 * Exactly four photos — the cross-fade timing (globals.css `hero-slide`) is built for 4 × 6s.
 * REPLACE with real church photography (landscape, at least 1600px wide).
 */
export const heroSlides: Photo[] = [photos.worship, photos.preacher, photos.welcome, photos.arena];
