import type { ImgHTMLAttributes } from "react";

export interface R2ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

export function R2Image({ src, alt, ...props }: R2ImageProps) {
    return <img src={src} alt={alt} {...props} />;
}
