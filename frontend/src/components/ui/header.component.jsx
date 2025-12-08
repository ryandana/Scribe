"use client";

import {
  IconMenu3,
  IconLogout,
  IconUser,
  IconPencilPlus,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import { navLinks } from "@/constants/navLinks";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const avatarUrl = user ? getImageUrl(user.avatar_url) : "";

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed bg-base-100/80 backdrop-blur-md border-b/70 w-full z-50 mb-6"
      >
        <div className="navbar mx-auto container px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <div className="navbar-start">
            <Link href="/" className="normal-case text-xl font-semibold">
              Scribe
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="navbar-center md:flex hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="navbar-end md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-ghost btn-sm"
            >
              {isOpen ? <IconX /> : <IconMenu3 />}
            </button>
          </div>

          {/* Desktop Auth Section */}
          <div className="navbar-end space-x-3 md:flex hidden">
            {loading ? (
              <div className="loading loading-spinner loading-sm"></div>
            ) : user ? (
              <>
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-circle avatar placeholder">
                    <Avatar
                      src={avatarUrl}
                      alt={user.nickname}
                      size={40}
                    />
                  </button>
                  <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-64 mt-3 font-medium">
                    <li className="menu-title px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={avatarUrl}
                          alt={user.nickname}
                          size={40}
                        />
                        <div className="flex-1 min-w-0 text-black">
                          <p className="font-semibold text-base truncate">
                            {user.nickname}
                          </p>
                          <p className="text-xs opacity-70 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </li>
                    <div className="divider my-1"></div>
                    <li>
                      <Link href="/profile" className="flex items-center">
                        <IconUser size={18} />
                        <span>Profile</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-error flex items-center"
                      >
                        <IconLogout size={18} />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
                <Link href="/write" className="btn btn-neutral">
                  Write
                  <IconPencilPlus size={18} />
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-neutral">
                  Login
                </Link>
                <Link href="/register" className="btn btn-outline">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-base-100 z-40 md:hidden flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-6">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="btn btn-ghost btn-lg w-full"
                >
                  {link.title}
                </Link>
              ))}

              {/* Auth Section */}
              <div className="divider"></div>
              {loading ? (
                <div className="loading loading-spinner loading-lg"></div>
              ) : user ? (
                <>
                  <Link
                    href="/write"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-neutral btn-lg w-full"
                  >
                    Write
                    <IconPencilPlus size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-neutral btn-lg w-full"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-outline btn-lg w-full"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Profile Section at Bottom */}
            {user && (
              <div className="p-6">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors mb-3"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={avatarUrl}
                      alt={user.nickname}
                      size={48}
                    />
                    <div>
                      <p className="font-semibold">{user.nickname}</p>
                      <p className="text-sm opacity-70">{user.email}</p>
                    </div>
                  </div>
                  <IconUser size={20} className="opacity-50" />
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="btn btn-ghost btn-block justify-start text-error"
                >
                  <IconLogout size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

