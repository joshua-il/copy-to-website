/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import { HeroContent } from "@/components/originkit/ui/hero-13/hero-content";

/** Public asset under /sections/hero-13/assets */
function asset(file: string) {
  return `/originkit/hero-13/${file}`;
}

/** Dark slabs so non-photo panels stay invisible in the tunnel. */
const TUNNEL_COLORS = ["#181818", "#1c1c1c", "#222222", "#161616"];
const DEFAULT_IMAGES = [
  asset("potrait-1.png"),
  asset("potrait-2.png"),
  asset("potrait-3.png"),
  asset("potrait-4.png"),
  asset("potrait-5.png"),
  asset("potrait-6.png"),
];

export interface Section20HeroProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onExploreGallery?: () => void;
  onBookShoot?: () => void;
  images?: string[];
  background?: string;
}

export const Section20Hero = ({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onExploreGallery,
  onBookShoot,
  images = DEFAULT_IMAGES,
  background = "#050505",
}: Section20HeroProps = {}) => {
  const handleExploreGallery = () => {
    if (onExploreGallery) {
      onExploreGallery();
    } else {
      window.location.hash = "#gallery";
    }
  };

  const handleBookShoot = () => {
    if (onBookShoot) {
      onBookShoot();
    } else {
      window.location.hash = "#book";
    }
  };

  return (
    <section
      aria-label="Elevating portraits through perspective"
      className="relative isolate flex min-h-[700px] w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: background }}
    >
      {/* 3D portrait tunnel */}
      <div aria-hidden="true" className="pointer-events-auto absolute inset-0 z-0">
        <GalleryTunnel
          images={images}
          background={background}
          lineColor="#B0B0B0"
          lineOpacity={0}
          grid={8}
          speed={50}
          boost={100}
          fade={100}
          label={false}
          cellMode="square"
        />
      </div>

      {/* Smooth radial vignette wash behind text so copy stays readable while 3D images blend naturally */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[80vh] w-[100vw] wide-lg:w-[50vw] wide-lg:h-[50vh] ipad:w-[75vw] desktop-sm:w-[55vw] -translate-x-1/2 -translate-y-1/2 blur-[25px]"
        style={{ backgroundColor: background }}
      />

      <div className="pointer-events-none relative z-20 flex w-full max-w-[763px] items-center justify-center py-12">
        <div className="pointer-events-auto relative flex w-full items-center justify-center">
          <HeroContent
            title={title}
            subtitle={subtitle}
            primaryButtonText={primaryButtonText}
            secondaryButtonText={secondaryButtonText}
            onExploreGallery={handleExploreGallery}
            onBookShoot={handleBookShoot}
          />
        </div>
      </div>
    </section>
  );
};
