import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Value List", path: "/value-list" },
    { name: "Trade Calculator", path: "/calculator" },
    { name: "Value Changes", path: "/value-changes" },
    { name: "Trade Ads", path: "/trade-ads" },
    { name: "Scam Logs", path: "/scam-logs" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-black sticky top-0 z-50 py-5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LEFT LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="/customdiscordlogo.png"
            className="h-14 w-auto object-contain"
            alt="AOTR Logo"
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center bg-[#111] rounded-full px-14 py-5 gap-6 
                          border border-gray-700 
                          shadow-[0_0_15px_rgba(255,220,150,0.1)]
                          ">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-200 ${
                  isActive(l.path)
                    ? "bg-[rgba(255,220,150,0.18)] text-[var(--gold-bright)] shadow-[0_0_12px_rgba(255,225,150,0.3)]"
                    : "text-[var(--gold-soft)] hover:bg-[rgba(255,220,150,0.08)] hover:text-[var(--gold-bright)]"
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>

        {/* DISCORD BUTTON (BIGGER) */}
        <a
          href="https://discord.gg/tradingcorps"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center justify-center h-16 w-16 
                     rounded-full border-[2px] 
                     border-[var(--gold-bright)] 
                     text-[var(--gold-bright)]
                     hover:bg-[rgba(255,220,150,0.20)]
                     transition shadow-[0_0_15px_rgba(255,220,150,0.25)]"
        >
          <img
            src="/discord-icon.png"
            alt="Discord"
            className="h-9 w-9 object-contain"
          />
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--gold-bright)] p-2"
        >
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="md:hidden mt-4 bg-[#111] border-t border-gray-800 overflow-hidden">
          {links.map((l, i) => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 text-lg mobile-item"
              style={{
                animationDelay: `${i * 0.12}s`,
                color: isActive(l.path)
                  ? "var(--gold-bright)"
                  : "var(--gold-soft)",
              }}
            >
              {l.name}
            </Link>
          ))}

          {/* Discord for mobile */}
          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 text-lg mobile-item"
            style={{
              animationDelay: `${links.length * 0.12}s`,
              color: "var(--gold-soft)",
            }}
          >
            Discord
          </a>
        </div>
      )}
    </header>
  );
};
