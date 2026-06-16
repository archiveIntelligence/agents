"use client";

// Editorial / atmospheric imagery for blog covers and category banners
// (generated into /public/blog/<slug>.png and /public/categories/<slug>.png by
// scripts/gen-scenes.mjs). Falls back to a subtle branded gradient if the image
// is missing, so the layout never breaks before an image has been generated.

import { useState } from "react";

export function SceneImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-brand-50 via-surface to-brand-100 ${className ?? ""}`}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src.replace(/\.png$/, ".webp")}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName ?? ""}`}
        />
      )}
    </div>
  );
}
