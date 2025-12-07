import React from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-black min-h-screen">

      {/* Sidebar */}
      <AdminSidebar />

      {/* MAIN PAGE */}
      <div className="flex-1 flex flex-col border-l border-red-900">
        <AdminHeader />

        <main className="flex-1 p-6 text-white bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}
