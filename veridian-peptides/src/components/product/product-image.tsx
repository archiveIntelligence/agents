"use client";

// Renders the generated photoreal product vial (/public/products/<base>.png)
// with the size shown as a small badge overlay. Falls back to the programmatic
// VialImage if the photo is missing (e.g., not generated yet).

import { useState } from "react";
import { VialImage } from "@/components/product/vial-image";

/** Strip the trailing size segment from a variant slug → product group base. */
function groupBase(slug: string): string {
  return slug.replace(/-(\d+(?:\.\d+)?(?:mg|ml|iu|mcg|kit|units?))$/i, "");
}

export function ProductImage({
  name,
  size,
  slug,
  className,
  showSize = true,
}: {
  name: string;
  size: string;
  slug: string;
  className?: string;
  showSize?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const base = groupBase(slug);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {failed ? (
        <VialImage name={name} size={size} className="h-full w-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/products/${base}.webp`}
          alt={`${name} ${size} research vial`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
      {showSize ? (
        <span className="absolute bottom-2 right-2 rounded-full bg-surface/85 px-2.5 py-0.5 text-xs font-medium text-foreground shadow-soft backdrop-blur">
          {size}
        </span>
      ) : null}
    </div>
  );
}
