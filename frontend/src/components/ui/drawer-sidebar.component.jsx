"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "@/context/auth.context";

const menuConfig = {
  student: [
    { label: "My Exams", href: "/dashboard/student/exams" },
    { label: "My Results", href: "/dashboard/student/results" },
    { label: "My Profile", href: "/dashboard/student/profile" },
  ],
  teacher: [
    { label: "Classes", href: "/dashboard/teacher/classes" },
    { label: "Exams", href: "/dashboard/teacher/exams" },
    { label: "Questions", href: "/dashboard/teacher/questions" },
    { label: "Results", href: "/dashboard/teacher/results" },
    { label: "My Profile", href: "/dashboard/teacher/profile" },
  ],
  admin: [
    { label: "Classes", href: "/dashboard/admin/classes" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Exams", href: "/dashboard/admin/exams" },
    { label: "Questions", href: "/dashboard/admin/questions" },
    { label: "Results", href: "/dashboard/admin/results" },
    { label: "My Profile", href: "/dashboard/admin/profile" },
  ],
};

export default function DrawerSidebar({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuItems = menuConfig[user?.role] || [];

  return (
    <div className="drawer lg:drawer-open h-screen">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content (Main Page) */}
      <div className="drawer-content flex flex-col h-screen">
        {/* Top Navbar */}
        <nav className="navbar bg-base-100 border-b shadow-sm sticky top-0 z-40">
          <div className="flex-1">
            <label
              htmlFor="drawer-toggle"
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="open sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <span className="hidden lg:block font-semibold ml-2">ExamHub</span>
          </div>

          {/* Top Bar Right */}
          <div className="flex-none gap-2">
            <div className="text-sm text-base-content/70 hidden md:block">
              Welcome, <span className="font-semibold">{user?.nickname}</span>
            </div>

            {/* User Dropdown */}
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {user?.nickname?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              </button>
              <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user?.nickname}</span>
                </li>
                <li>
                  <Link href={`/dashboard/${user?.role}/profile`}>Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <IconLogout size={18} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>

      {/* Drawer Side (Sidebar) */}
      <div className="drawer-side">
        <label
          htmlFor="drawer-toggle"
          className="drawer-overlay"
          aria-label="close sidebar"
        ></label>
        <div className="flex min-h-full flex-col bg-base-100 w-64 border-r">
          {/* Logo/Title */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-primary">ExamHub</h1>
            <p className="text-sm text-base-content/60 capitalize">
              {user?.role} Dashboard
            </p>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {user?.nickname?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user?.nickname}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 flex-1">
            <ul className="menu menu-compact">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="rounded-md">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error w-full gap-2"
            >
              <IconLogout size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
