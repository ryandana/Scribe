"use client";

import { IconMenu3, IconLogout, IconDashboard } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const getDashboardLink = (role) => {
  switch (role) {
    case "student":
      return "/dashboard/student";
    case "teacher":
      return "/dashboard/teacher";
    case "admin":
      return "/dashboard/admin";
    default:
      return "/";
  }
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getDashboardHref = () => getDashboardLink(user?.role);

  return (
    <header className="fixed bg-base-100 border-b/70 w-full z-10 mb-6">
      <div className="navbar mx-auto container px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="normal-case text-xl font-semibold">
            ExamHub
          </Link>
        </div>

        {/* Desktop Menu - Only show for non-authenticated users */}
        {!user && (
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
        )}

        {/* Mobile Menu */}
        <div className="navbar-end md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost btn-sm"
          >
            <IconMenu3 />
          </button>
        </div>

        {/* Desktop Auth Section */}
        <div className="navbar-end space-x-3 md:flex hidden">
          {loading ? (
            <div className="loading loading-spinner loading-sm"></div>
          ) : user ? (
            <>
              {/* Dashboard Button */}
              <Link
                href={getDashboardHref()}
                className="btn btn-ghost btn-sm gap-2"
              >
                <IconDashboard size={18} />
                Dashboard
              </Link>

              {/* User Menu */}
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-circle avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center">
                    {user?.nickname ? (
                      <span className="text-xl font-bold">
                        {user.nickname.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-xl">?</span>
                    )}
                  </div>
                </button>
                <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li className="menu-title">
                    <span>{user?.nickname}</span>
                  </li>
                  <li>
                    <Link href={`${getDashboardHref()}/profile`}>Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-error">
                      <IconLogout size={18} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
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
    </header>
  );
}
