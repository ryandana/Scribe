"use client";

import { IconMenu3 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed bg-base-100 border-b/70 w-full z-10 mb-6">
      <div className="navbar mx-auto container px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="normal-case text-xl font-semibold">
            Sacred.io
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center md:flex hidden">
          <div className="menu menu-horizontal p-0">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="btn btn-ghost btn-md rounded-btn normal-case text-md font-semibold"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="navbar-end md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost btn-sm"
          >
            <IconMenu3 />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-end space-x-3 md:flex hidden">
          <Link href="/login" className="btn btn-neutral">
            Login
          </Link>
          <Link href="/dashboard" className="btn">
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
