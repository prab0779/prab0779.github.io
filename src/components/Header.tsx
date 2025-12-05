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
    <header className="sticky top-0 z-50 py-5 backdrop-blur-xl bg-black md:bg-transparent">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo (kept simple) */}
        <Link to="/" className="flex items-center">
          <img
            src="/customdiscordlogo.png"
            className="h-14 w-auto object-contain"
            alt="AOTR Logo"
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <nav
            className="
              flex items-center gap-6
              bg-[#0C0C0C]/80
              backdrop-blur-xl
              rounded-full px-14 py-4
              border border-[var(--gold-soft)]/25
            "
          >
            {links.map((l) => {
              const active = isActive(l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`
                    relative px-6 py-2 rounded-full text-[15px] font-medium
                    transition-all duration-200 group
                    ${
                      active
                        ? "text-[var(--gold-bright)] bg-[rgba(255,220,150,0.10)]"
                        : "text-[var(--gold-soft)] hover:text-[var(--gold-bright)] hover:bg-[rgba(255,220,150,0.06)]"
                    }
                  `}
                >
                  {l.name}

                  {/* Centered underline */}
                  <span
                    className={`
                      block h-[2px] rounded-full bg-[var(--gold-bright)]
                      mt-1 mx-auto
                      transition-all duration-300
                      ${
                        active
                          ? "w-10 opacity-100"
                          : "w-0 opacity-0 group-hover:w-10 group-hover:opacity-80"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* DISCORD BUTTON */}
        <a
          href="https://discord.gg/tradingcorps"
          target="_blank"
          rel="noopener noreferrer"
          className="
            hidden md:flex items-center justify-center h-14 w-14 
            rounded-full border
            border-[var(--gold-bright)]
            text-[var(--gold-bright)]
            hover:bg-[rgba(255,220,150,0.12)]
            transition
          "
        >
          <img
            src="/discord-icon.png"
            alt="Discord"
            className="h-24 w-24 object-contain"
          />
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--gold-bright)] p-2 active:scale-95 transition-transform"
        >
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden mt-4 bg-black/95 backdrop-blur-xl border-t border-gray-800 shadow-lg">
          {links.map((l) => {
            const active = isActive(l.path);
            return (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className={`
                  block px-6 py-4 text-lg border-b border-gray-900/60
                  transition-all
                  ${
                    active
                      ? "text-[var(--gold-bright)] bg-[rgba(255,220,150,0.10)]"
                      : "text-[var(--gold-soft)] hover:text-[var(--gold-bright)]"
                  }
                `}
              >
                {l.name}
              </Link>
            );
          })}

          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 text-lg text-[var(--gold-soft)] hover:text-[var(--gold-bright)]"
          >
            Discord
          </a>
        </div>
      )}
    </header>
  );
};
