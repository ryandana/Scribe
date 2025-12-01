"use client";

import Link from "next/link";

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="breadcrumbs text-sm mb-6">
      <ul>
        <li>
          <Link href="/dashboard">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
