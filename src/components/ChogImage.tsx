import { useState } from "react";
import { CHOG_ASSETS } from "../config/assets";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackIndex?: number;
};

/** 素材占位：主图不存在时自动用 gallery 里的 CHOG 图 */
export function ChogImage({ src, alt, className, fallbackIndex = 0 }: Props) {
  const [current, setCurrent] = useState(src);
  const gallery = CHOG_ASSETS.gallery;

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        const next = gallery[fallbackIndex % gallery.length];
        if (current !== next) setCurrent(next);
      }}
    />
  );
}
