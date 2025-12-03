import React, { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
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
    <header className="bg-black sticky top-0 z-50 py-4 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

        {/* LOGO LEFT */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/customdiscordlogo.png"
            className="h-12 w-auto object-contain"
            alt="AOTR Logo"
          />
        </Link>

        {/* NAVBAR DESKTOP */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center bg-[#111] rounded-full px-6 py-2 gap-2 border border-gray-700">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(l.path)
                    ? "bg-[rgba(255,220,150,0.15)] text-[var(--gold-bright)] shadow-[0_0_10px_rgba(255,225,150,0.2)]"
                    : "text-[var(--gold-soft)] hover:bg-[rgba(255,220,150,0.07)] hover:text-[var(--gold-bright)]"
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>

        {/* DISCORD BUTTON RIGHT */}
        <a
          href="https://discord.gg/tradingcorps"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 border border-[var(--gold-bright)] text-[var(--gold-bright)] px-5 py-2 rounded-full hover:bg-[rgba(255,220,150,0.15)] transition"
        >
          <ExternalLink className="w-4 h-4" />
          Discord
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--gold-bright)] p-2"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="md:hidden mt-4 bg-[#111] border-t border-gray-800 animate-fade-in">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm ${
                isActive(l.path)
                  ? "text-[var(--gold-bright)] bg-[rgba(255,220,150,0.12)]"
                  : "text-[var(--gold-soft)] hover:text-[var(--gold-bright)]"
              }`}
            >
              {l.name}
            </Link>
          ))}

          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-3 text-sm text-[var(--gold-soft)] hover:text-[var(--gold-bright)]"
          >
            Discord <ExternalLink className="inline w-4 h-4 ml-1" />
          </a>
        </div>
      )}
    </header>
  );
};
