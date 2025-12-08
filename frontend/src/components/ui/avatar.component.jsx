"use client";

import { IconUser } from "@tabler/icons-react";
import Image from "next/image";

export default function Avatar({ src, alt = "Avatar", size = 40, className = "" }) {
    // Common sizes can be predefined or dynamic
    const hasSrc = src && src.trim() !== "";

    return (
        <div
            className={`relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            {hasSrc ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes={`${size}px`}
                    unoptimized
                />
            ) : (
                <IconUser size={size * 0.6} className="text-gray-500" />
            )}
        </div>
    );
}
