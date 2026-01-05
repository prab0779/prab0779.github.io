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

          {/* DISCORD BUTTON (DESKTOP) - UPDATED (PILL + NO IMAGE) */}
          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden md:inline-flex items-center gap-2
              px-4 py-2 rounded-xl
              bg-[#0b0b10]/70 backdrop-blur
              border border-[rgba(255,220,150,0.22)]
              shadow-[0_10px_30px_rgba(0,0,0,0.35)]
              text-[var(--gold-bright)] font-semibold
              hover:border-[var(--gold-bright)] hover:bg-[#12121a]
              hover:-translate-y-0.5 active:translate-y-0 transition
            "
            aria-label="Join Discord"
          >
            <span
              className="
                grid place-items-center w-8 h-8 rounded-lg
                bg-gradient-to-br from-[var(--gold-bright)] to-[var(--gold-soft)]
                text-black shadow-inner
              "
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M19.54 6.83A16.4 16.4 0 0 0 15.7 5.5c-.18.33-.38.77-.52 1.12a15.2 15.2 0 0 0-4.37 0c-.14-.35-.35-.79-.53-1.12A16.2 16.2 0 0 0 6.46 6.83C4.1 10.3 3.46 13.68 3.78 17c1.56 1.16 3.06 1.87 4.54 2.34.36-.5.68-1.03.96-1.6-.52-.2-1.02-.45-1.5-.74.13-.1.25-.2.37-.3 2.9 1.36 6.04 1.36 8.9 0 .12.1.25.2.37.3-.48.29-.98.54-1.5.74.28.57.6 1.1.96 1.6 1.48-.47 2.98-1.18 4.54-2.34.38-3.88-.65-7.23-2.46-10.17ZM9.35 14.7c-.87 0-1.58-.8-1.58-1.79 0-.98.7-1.78 1.58-1.78s1.6.8 1.58 1.78c0 .99-.7 1.79-1.58 1.79Zm5.3 0c-.87 0-1.58-.8-1.58-1.79 0-.98.7-1.78 1.58-1.78s1.6.8 1.58 1.78c0 .99-.7 1.79-1.58 1.79Z" />
              </svg>
            </span>
            <span className="tracking-wide">Discord</span>
          </a>

          {/* MOBILE ACTIONS */}
          <div className="md:hidden flex items-center gap-2">
            {/* removed quick discord (you wanted mobile only in navbar/menu, not topbar) */}

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
                              ${active ? "bg-[var(--gold-bright)]" : "bg-white/10"}
                            `}
                          />
                          {l.name}
                        </span>

                        <span className="text-white/20">›</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Discord CTA (MOBILE ONLY) - UPDATED (NO IMAGE) */}
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
                  <span
                    className="grid place-items-center w-9 h-9 rounded-lg bg-black/10 border border-black/10"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M19.54 6.83A16.4 16.4 0 0 0 15.7 5.5c-.18.33-.38.77-.52 1.12a15.2 15.2 0 0 0-4.37 0c-.14-.35-.35-.79-.53-1.12A16.2 16.2 0 0 0 6.46 6.83C4.1 10.3 3.46 13.68 3.78 17c1.56 1.16 3.06 1.87 4.54 2.34.36-.5.68-1.03.96-1.6-.52-.2-1.02-.45-1.5-.74.13-.1.25-.2.37-.3 2.9 1.36 6.04 1.36 8.9 0 .12.1.25.2.37.3-.48.29-.98.54-1.5.74.28.57.6 1.1.96 1.6 1.48-.47 2.98-1.18 4.54-2.34.38-3.88-.65-7.23-2.46-10.17ZM9.35 14.7c-.87 0-1.58-.8-1.58-1.79 0-.98.7-1.78 1.58-1.78s1.6.8 1.58 1.78c0 .99-.7 1.79-1.58 1.79Zm5.3 0c-.87 0-1.58-.8-1.58-1.79 0-.98.7-1.78 1.58-1.78s1.6.8 1.58 1.78c0 .99-.7 1.79-1.58 1.79Z" />
                    </svg>
                  </span>
                  Discord <span className="opacity-70">→</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
