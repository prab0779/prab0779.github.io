import React from 'react';
import { ExternalLink, Mail, Home, List, Calculator, History, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      className="
      relative 
      bg-gradient-to-b from-[#0A0A0A] to-black
      border-t border-[var(--gold-soft)]/20
      rounded-t-3xl
      shadow-[0_-10px_25px_rgba(255,215,100,0.05)]
      mt-16
    "
    >
      <div className="absolute -top-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-bright)] to-transparent opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">

          <div className="col-span-2 sm:col-span-1">
            <div className="mb-4 text-xl font-bold flex flex-wrap">
              {"AOT:R Value Hub".split("").map((char, i) => (
                <span key={i} className="gold-letter">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed max-w-xs flex flex-wrap">
              {"aotrvalue.com is a 3rd party site not affiliated with Attack on Titan Revolution or Roblox."
                .split(" ")
                .map((word, i, arr) => (
                  <span key={i} className="silver-letter">
                    {word}
                    {i < arr.length - 1 && "\u00A0"}
                  </span>
                ))}
            </p>
          </div>

          <div>
            <div className="font-semibold text-sm mb-3 flex flex-wrap">
              {"Navigation".split("").map((char, i) => (
                <span key={i} className="gold-letter">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Home className="w-4 h-4" />
                  <span className="flex flex-wrap">
                    {"Home".split("").map((c, i) => (
                      <span key={i} className="silver-letter">
                        {c}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/value-list" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <List className="w-4 h-4" />
                  <span className="flex flex-wrap">
                    {"Value List".split("").map((c, i) => (
                      <span key={i} className="silver-letter">
                        {c === " " ? "\u00A0" : c}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Calculator className="w-4 h-4" />
                  <span className="flex flex-wrap">
                    {"Calculator".split("").map((c, i) => (
                      <span key={i} className="silver-letter">
                        {c}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/value-changes" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <History className="w-4 h-4" />
                  <span className="flex flex-wrap">
                    {"Value Changes".split("").map((c, i) => (
                      <span key={i} className="silver-letter">
                        {c === " " ? "\u00A0" : c}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-sm mb-3 flex flex-wrap">
              {"Community".split("").map((char, i) => (
                <span key={i} className="gold-letter">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/trade-ads" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Shield className="w-4 h-4" />
                  <span className="flex flex-wrap">
                    {"Trade Ads".split("").map((c, i) => (
                      <span key={i} className="silver-letter">
                        {c === " " ? "\u00A0" : c}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
              <li>
              </li>
              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="flex flex-wrap">
                    {"Discord".split("").map((c, i) => (
                      <span key={i} className="silver-letter">
                        {c}
                      </span>
                    ))}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-sm mb-3 flex flex-wrap">
              {"Support".split("").map((char, i) => (
                <span key={i} className="gold-letter">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition"
                >
                  <Mail className="w-4 h-4" />
                  <span className="flex flex-wrap">
                    {"Contact Us".split("").map((c, i) => (
                      <span key={i} className="silver-letter">
                        {c === " " ? "\u00A0" : c}
                      </span>
                    ))}
                  </span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-5 flex flex-col sm:flex-row items-center justify-between text-center gap-3">
          <p className="text-xs sm:text-sm flex flex-wrap">
            {"© 2026 AOT:R Value Hub — Not affiliated with AoT:R or Roblox."
              .split(" ")
              .map((word, i, arr) => (
                <span key={i} className="silver-letter">
                  {word}
                  {i < arr.length - 1 && "\u00A0"}
                </span>
              ))}
          </p>
        </div>

      </div>
    </footer>
  );
};