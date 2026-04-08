import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
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

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 50) setShow(false);
      else setShow(true);
      lastScroll = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-0 w-full z-50 flex justify-center px-4 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-[120%]"
      }`}
    >
      <div
        className="
          w-full max-w-5xl
          flex items-center justify-between
          rounded-xl px-5 py-2
          bg-white/5 backdrop-blur-xl
          border border-[#D4AF37]/50
          shadow-[0_8px_30px_rgba(0,0,0,0.6)]
        "
      >
        <Link to="/" className="flex items-center">
          <img
            src="/customdiscordlogo.png"
            className="h-8 w-auto object-contain"
            alt="logo"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => {
            const active = isActive(l.path);
            return (
              <Link
                key={l.path}
                to={l.path}
                className={`
                  relative text-[15px] font-medium transition
                  ${
                    active
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }
                `}
              >
                {l.name}
                <span
                  className={`
                    absolute left-1/2 -translate-x-1/2 -bottom-1.5
                    h-[2px] bg-[#D4AF37] rounded-full
                    transition-all duration-300
                    ${
                      active
                        ? "w-6 opacity-100"
                        : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-80"
                    }
                  `}
                />
              </Link>
            );
          })}
        </nav>

        <a
          href="https://discord.gg/tradingcorps"
          target="_blank"
          rel="noopener noreferrer"
          className="
            hidden md:flex items-center
            px-3 py-1.5 rounded-lg
            border border-[#D4AF37]/70
            text-white text-sm font-medium
            hover:bg-white/10
            transition
          "
        >
          Discord
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="
            md:hidden h-9 w-9 flex items-center justify-center
            rounded-lg border border-[#D4AF37]/50
            text-white
          "
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-2 w-full max-w-5xl px-4">
          <div className="rounded-xl bg-black/90 border border-[#D4AF37]/40 p-2">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="block px-3 py-2 text-sm text-white/70 hover:text-white"
              >
                {l.name}
              </Link>
            ))}
            <a
              href="https://discord.gg/tradingcorps"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 px-3 py-2 text-center bg-[#D4AF37] text-black rounded-lg text-sm"
            >
              Discord
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
