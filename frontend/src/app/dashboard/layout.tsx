import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
