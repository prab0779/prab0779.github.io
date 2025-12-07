import { NavLink } from "react-router-dom";
import { Boxes, History, ShieldAlert, Flame, Settings, Home } from "lucide-react";

export default function AdminSidebar() {
  const linkClass = ({ isActive }: any) =>
    `flex items-center space-x-3 px-5 py-3 text-sm font-semibold transition 
     ${isActive ? "bg-red-900 text-red-200 border-l-4 border-red-500" : "text-gray-400 hover:bg-red-950 hover:text-red-300"}`;

  return (
    <aside className="w-56 bg-[#050505] border-r border-red-900 pt-6">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-red-500">⚔️ AOT:R Admin</h1>
      </div>

      <nav className="space-y-1 mt-4">

        <NavLink to="/admin" end className={linkClass}>
          <Home className="w-5 h-5" />
          <span>Items</span>
        </NavLink>

        <NavLink to="/admin/changes" className={linkClass}>
          <History className="w-5 h-5" />
          <span>Value Changes</span>
        </NavLink>

        <NavLink to="/admin/scams" className={linkClass}>
          <ShieldAlert className="w-5 h-5" />
          <span>Scam Logs</span>
        </NavLink>

        <NavLink to="/admin/stock" className={linkClass}>
          <Flame className="w-5 h-5" />
          <span>Stock Rotation</span>
        </NavLink>

        <NavLink to="/admin/settings" className={linkClass}>
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>

      </nav>
    </aside>
  );
}
