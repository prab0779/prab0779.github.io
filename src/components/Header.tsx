import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BlurText from "../Shared/BlurText";

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
        className={`
          w-full max-w-5xl
          rounded-xl
          bg-white/10 backdrop-blur-xl
          border border-[#D4AF37]/50
          shadow-[0_8px_30px_rgba(0,0,0,0.6)]
          transition-all duration-300
          ${open ? "pb-4" : ""}
        `}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center">
            <img src="/customdiscordlogo.png" className="h-8" />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => {
              const active = isActive(l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`relative text-[15px] font-medium ${
                    active
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <BlurText
  text={l.name}
  enabled={false}
  className="text-[15px] font-medium"
/>
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-[2px] bg-[#D4AF37] transition-all ${
                      active ? "w-6" : "w-0 group-hover:w-6"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://discord.gg/tradingcorps"
              target="_blank"
              className="hidden md:flex px-3 py-1.5 rounded-lg border border-[#D4AF37]/70 text-white text-sm hover:bg-white/10"
            >
              Discord
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-[#D4AF37]/50 text-white"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* EXPANDING MOBILE MENU */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 px-5
            ${open ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col gap-5 pt-2">
            {links.map((l) => {
              const active = isActive(l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`relative group text-[16px] font-medium ${
                    active
                      ? "text-[#D4AF37]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <BlurText
  text={l.name}
  enabled={false}
  className="text-[16px] font-medium"
/>
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-[#D4AF37] transition-all ${
                      active ? "w-20" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}

            <a
              href="https://discord.gg/tradingcorps"
              target="_blank"
              className="mt-4 text-center px-4 py-3 bg-[#D4AF37] text-black rounded-lg font-medium"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
