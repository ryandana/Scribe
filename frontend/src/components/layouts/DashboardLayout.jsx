"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMenu, IconX, IconLogout } from "@tabler/icons-react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";

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

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuItems = menuConfig[user?.role] || [];

  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="btn btn-ghost btn-sm absolute top-4 right-4 lg:hidden"
        >
          <IconX size={20} />
        </button>

        {/* Logo/Title */}
        <div className="p-6 mt-4 lg:mt-0">
          <h1 className="text-2xl font-bold text-primary">ExamHub</h1>
          <p className="text-sm text-base-content/60 capitalize">
            {user?.role} Dashboard
          </p>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-t border-b">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center">
                <span className="text-lg font-bold">
                  {user?.nickname?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{user?.nickname}</p>
              <p className="text-xs text-base-content/60">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
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
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error w-full gap-2"
          >
            <IconLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-base-100 border-b shadow-sm lg:shadow-none">
          <div className="px-4 py-4 flex items-center justify-between lg:justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-ghost btn-sm lg:hidden"
            >
              <IconMenu size={20} />
            </button>
            <div className="text-sm text-base-content/60">
              Welcome back,{" "}
              <span className="font-semibold">{user?.nickname}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
