import React, { useState, useEffect } from "react";
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

  // Close menu on route change (mobile UX)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/customdiscordlogo.png"
              className="h-10 w-auto object-contain"
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
                    <span
                      className={`
                        block h-[2px] rounded-full bg-[var(--gold-bright)]
                        mt-1 mx-auto transition-all duration-300
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

          {/* DISCORD BUTTON (DESKTOP) */}
          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden md:flex items-center justify-center h-12 w-12
              rounded-full border border-[var(--gold-bright)]
              text-[var(--gold-bright)]
              hover:bg-[rgba(255,220,150,0.12)]
              transition
            "
            aria-label="Join Discord"
          >
            <img
              src="/discord-icon.png"
              alt="Discord"
              className="h-6 w-6 object-contain"
            />
          </a>

          {/* MOBILE ACTIONS */}
          <div className="md:hidden flex items-center gap-2">
            {/* quick discord */}
            <a
              href="https://discord.gg/tradingcorps"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center
                h-10 w-10 rounded-full
                border border-[var(--gold-soft)]/40
                hover:border-[var(--gold-bright)]/70
                hover:bg-[rgba(255,220,150,0.08)]
                transition
              "
              aria-label="Discord"
            >
              <img
                src="/discord-icon.png"
                alt=""
                className="h-5 w-5 object-contain"
              />
            </a>

            {/* menu toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="
                inline-flex items-center justify-center
                h-10 w-10 rounded-full
                border border-[var(--gold-soft)]/40
                text-[var(--gold-bright)]
                hover:border-[var(--gold-bright)]/70
                hover:bg-[rgba(255,220,150,0.08)]
                transition
                active:scale-95
              "
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU SHEET */}
        {open && (
          <div className="md:hidden pb-4">
            <div
              className="
                rounded-2xl border border-white/10
                bg-[#0B0B0B]/92 backdrop-blur-xl
                shadow-[0_20px_60px_rgba(0,0,0,0.55)]
                overflow-hidden
              "
            >
              <div className="p-3">
                <div className="grid gap-1">
                  {links.map((l) => {
                    const active = isActive(l.path);
                    return (
                      <Link
                        key={l.path}
                        to={l.path}
                        className={`
                          flex items-center justify-between
                          px-4 py-3 rounded-xl text-[15px]
                          transition
                          ${
                            active
                              ? "text-[var(--gold-bright)] bg-[rgba(255,220,150,0.10)] border border-[var(--gold-soft)]/25"
                              : "text-[var(--gold-soft)] hover:text-[var(--gold-bright)] hover:bg-white/5"
                          }
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`
                              h-5 w-[3px] rounded-full
                              ${
                                active
                                  ? "bg-[var(--gold-bright)]"
                                  : "bg-white/10"
                              }
                            `}
                          />
                          {l.name}
                        </span>

                        <span className="text-white/20">›</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Discord CTA */}
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-3 w-full
                    flex items-center justify-center gap-2
                    px-5 py-3 rounded-xl font-semibold
                    bg-[var(--gold-bright)] text-black
                    shadow-[0_0_18px_rgba(255,220,150,0.25)]
                    hover:bg-[var(--gold-soft)]
                    transition
                    active:scale-[0.99]
                  "
                >
                  <img
                    src="/discord-icon.png"
                    alt=""
                    className="h-10 w-10 object-contain"
                  />
                  Join Discord
                  <span className="opacity-70">→</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
