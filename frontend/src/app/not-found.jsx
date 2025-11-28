"use client";

import React from "react";
import Link from "next/link";
import { IconHome } from "@tabler/icons-react";
import { IconArrowLeft } from "@tabler/icons-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary leading-none">
              404
            </h1>
            {/* <div className="absolute inset-0 blur-3xl opacity-20 bg-linear-to-r from-primary to-secondary"></div> */}
          </div>
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content">
              Page Not Found
            </h2>
            <p className="text-base-content/70 text-lg">
              Oops! The page you&apos;re looking for seems to have wandered off
              into the digital void.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center sm:flex-row gap-4 w-full pt-4">
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline gap-2"
            >
              <IconArrowLeft size={20} />
              Go Back
            </button>
            <Link href="/" className="btn btn-neutral gap-2">
              <IconHome size={20} />
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
