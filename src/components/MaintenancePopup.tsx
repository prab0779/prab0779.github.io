import React, { useEffect } from 'react';
import { Wrench, MessageCircle, ExternalLink } from 'lucide-react';
import GradientText from '../Shared/GradientText';

export const MaintenancePopup: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-[#6f572c]/60 bg-[#0d0d10] shadow-[0_0_80px_rgba(196,160,74,0.06)]">
        {/* Subtle top glow accent */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#c4a04a]/50 to-transparent" />

        <div className="p-8">
          {/* Icon + Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#6f572c]/40 bg-[#4b3a1d]/20 mb-4">
              <Wrench className="w-6 h-6 text-[#c4a04a]" />
            </div>
            <h1 className="text-2xl font-bold">
              <GradientText variant="gold">Under Maintenance</GradientText>
            </h1>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c4a04a]/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c4a04a]" />
            </span>
            <span className="text-sm font-medium text-white/60">Maintenance in Progress</span>
          </div>

          {/* Notice card */}
          <div className="rounded-xl border border-white/[0.06] bg-black/30 p-5 mb-6">
            <p className="text-sm text-white/70 leading-relaxed text-center">
              This is an <span className="text-white font-medium">unofficial</span> AOT:R value list.
              We are currently performing updates. The site will be back shortly.
            </p>
          </div>

          {/* Downtime estimate */}
          <div className="rounded-xl border border-[#6f572c]/30 bg-[#4b3a1d]/10 p-4 mb-6 text-center">
            <p className="text-xs text-white/40 mb-1">Estimated downtime</p>
            <p className="text-lg font-semibold text-[#c4a04a]">Coming Back Soon</p>
          </div>

          {/* Discord CTA */}
          <div className="text-center">
            <a
              href="https://discord.gg/tradingcorps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#6f572c]/60 bg-[#4b3a1d]/30 text-[#c4a04a] hover:bg-[#4b3a1d]/60 transition-all duration-200 font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Join Our Discord
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
            <p className="text-xs text-white/30 mt-2">
              Stay updated and connect with other traders
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-white/[0.06] text-center">
          <p className="text-xs text-white/25">
            Unofficial AOT:R Value Hub
          </p>
        </div>
      </div>
    </div>
  );
};
