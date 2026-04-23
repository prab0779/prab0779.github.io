import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import GradientText from "../Shared/GradientText";
import { useAuth } from "../hooks/useAuth";

const DiscordIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, discord, signInWithDiscord, signOut } = useAuth();

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
                  className="relative group text-[15px] font-medium"
                >
                  {active ? (
                    <GradientText variant="gold" className="text-[15px] font-medium">
                      {l.name}
                    </GradientText>
                  ) : (
                    <GradientText variant="silver" className="text-[15px] font-medium">
                      {l.name}
                    </GradientText>
                  )}
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
            {/* Discord server link — icon only */}
            <a
              href="https://discord.gg/tradingcorps"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center justify-center h-9 w-9 rounded-lg border border-[#D4AF37]/50 text-[#5865F2] hover:bg-white/10 transition-colors"
              title="Join our Discord"
            >
              <DiscordIcon size={18} />
            </a>

            {/* Auth button */}
            {user ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 hover:bg-white/10 transition-colors"
                >
                  {discord?.avatar ? (
                    <img
                      src={discord.avatar}
                      alt={discord.username ?? ""}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#5865F2] flex items-center justify-center">
                      <DiscordIcon size={12} />
                    </div>
                  )}
                  <span className="text-sm text-white max-w-[100px] truncate">
                    {discord?.username ?? "User"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-white/60 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#0f0f0f]/95 backdrop-blur-xl shadow-xl overflow-hidden">
                    <div className="px-3 py-2.5 border-b border-white/10">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm text-white font-medium truncate">{discord?.username ?? "User"}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithDiscord}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 text-white text-sm hover:bg-white/10 transition-colors"
              >
                <DiscordIcon size={15} />
                <GradientText variant="silver">Login</GradientText>
              </button>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-[#D4AF37]/50 text-white"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 px-5
            ${open ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col gap-5 pt-2">
            {links.map((l) => {
              const active = isActive(l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className="relative group text-[16px] font-medium"
                >
                  {active ? (
                    <GradientText variant="gold">{l.name}</GradientText>
                  ) : (
                    <GradientText variant="silver">{l.name}</GradientText>
                  )}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-[#D4AF37] transition-all ${
                      active ? "w-20" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="https://discord.gg/tradingcorps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-[#5865F2]/40 text-[#5865F2] rounded-lg font-medium hover:bg-[#5865F2]/10 transition-colors"
              >
                <DiscordIcon size={18} />
                Join Discord
              </a>

              {user ? (
                <div className="flex flex-col gap-2 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    {discord?.avatar ? (
                      <img
                        src={discord.avatar}
                        alt={discord.username ?? ""}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                        <DiscordIcon size={14} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-white/40">Signed in as</p>
                      <p className="text-sm text-white font-medium truncate max-w-[180px]">
                        {discord?.username ?? "User"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { signOut(); setOpen(false); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { signInWithDiscord(); setOpen(false); }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] text-black rounded-lg font-medium"
                >
                  <DiscordIcon size={18} />
                  Login with Discord
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
