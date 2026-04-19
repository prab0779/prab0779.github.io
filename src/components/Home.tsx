import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Item } from "../types/Item";
import { FAQSection } from "./FAQSection";
import { VideoSlider } from "./VideoSlider";
import { StockRestocker } from "../components/StockRestocker";
import Carousel from "../Shared/Carousel";
import ShapeGrid from "../Shared/ShapeGrid";
import SplitText from "../Shared/SplitText";
import BlurText from "../Shared/BlurText";
import ShinyText from "../Shared/ShinyText";
import StarBorder from "../Shared/StarBorder";
import BorderGlow from "../Shared/BorderGlow";
import Dock from "../Shared/Dock";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { SiRoblox } from "react-icons/si";
import { LineChart, Sparkles, Calculator, Shield } from "lucide-react";

interface HomeProps {
  items: Item[];
}


const DockItems = [
  {
    icon: <SiRoblox size={22} />,
    label: "Roblox",
    onClick: () => window.open("https://www.roblox.com/games/13379208636/Attack-on-Titan-Revolution", "_blank"),
  },
  {
    icon: <FaXTwitter size={22} />,
    label: "X",
    onClick: () => window.open("https://x.com/", "_blank"),
  },
  {
    icon: <FaDiscord size={22} />,
    label: "Discord",
    onClick: () => window.open("https://discord.gg/tradingcorps", "_blank"),
  },
];

export const Home: React.FC<HomeProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('/gridd.svg')] opacity-10 mix-blend-soft-light pointer-events-none" />

      <div className="relative z-10">
        <section className="relative overflow-hidden w-full pt-[200px] md:pt-[260px] pb-[140px] md:pb-[200px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[150%] z-0 opacity-40 pointer-events-none mask-image-[linear-gradient(to_bottom,black,black,transparent)]">
            <ShapeGrid
              speed={0.5}
              squareSize={40}
              direction="diagonal"
              borderColor="#271E37"
              hoverFillColor="#222222"
              shape="square"
              hoverTrailAmount={0}
            />
          </div>

          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_40%,rgba(255,215,120,0.08),transparent_60%)]" />

          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#090A0F]" />

          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left space-y-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.25em] mb-2">
                  <ShinyText
                    text="AOT:R Trading Hub"
                    className="text-xs font-medium uppercase tracking-[0.25em] mb-2"
                  />
                </div>

                <SplitText
                  text="AOT:R Values"
                  tag="h1"
                  className="text-4xl md:text-6xl font-extrabold text-[var(--gold-bright)] leading-tight drop-shadow-lg"
                  delay={40}
                  duration={1}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                />

                <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold-bright)] to-transparent rounded-full mt-3 mx-auto lg:mx-0" />

                <div className="text-center lg:text-left space-y-4">
                  <BlurText
                    text="The ultimate hub for Attack on Titan Revolution trading. Discover values, analyze trades, and browse verified trade ads — all in one place."
                    delay={200}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={handleAnimationComplete}
                    className="text-2xl mb-8"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
                <StarBorder
                  as={Link}
                  to="/trade-ads"
                  className="px-6 py-3 bg-[var(--gold-bright)] text-black font-semibold rounded-xl hover:bg-[var(--gold-soft)] transition shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  color="#FFD700"
                  speed="2s"
                >
                  Start Trading →
                </StarBorder>

                <StarBorder
                  as={Link}
                  to="/value-list"
                  className="px-6 py-3 bg-[#111] text-[var(--gold-soft)] font-medium rounded-xl border border-gray-700 hover:border-[var(--gold-bright)] hover:bg-[#1a1a1a] transition hover:-translate-y-0.5"
                  color="#FFD700"
                  speed="4s"
                >
                  View Values ★
                </StarBorder>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end lg:-ml-10 px-2 sm:px-0">
                <Carousel />
            </div>
          </div>
          <div className="relative z-10 w-full flex justify-center mt-[90px] md:mt-[150px]">
              <Dock items={DockItems} />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent opacity-25 mb-10 md:mb-14" />
        </div> 

        <section className="relative max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div>
              <SplitText
                text="Popular Highlights"
                tag="h2"
                className="text-2xl md:text-3xl font-bold text-[var(--gold-bright)]"
                delay={40}
                duration={1}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
              />
              <div className="text-gray-400 text-sm md:text-base mt-1">
                <BlurText
                  text="AOT:R clips, updates and moments from the community."
                  delay={200}
                  animateBy="words"
                  direction="top"
                  enabled = {false}
                  onAnimationComplete={handleAnimationComplete}
                  className="text-1xl mb-2"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#090A0F] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#090A0F] to-transparent" />
            <VideoSlider />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent opacity-20 mb-10 md:mb-14" />
        </div>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div>
              <SplitText
                text="Stock Restocker"
                tag="h2"
                className="text-2xl md:text-3xl font-bold text-[var(--gold-bright)]"
                delay={40}
                duration={1}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
              />
              <div className="text-gray-400 text-sm md:text-base mt-1">
                <BlurText
                  text="Track limited-time stocks and cosmetics so you never miss out."
                  delay={200}
                  animateBy="words"
                  enabled={false}
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                  className="text-1xl mb-2"
                />
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-gray-800 text-xs text-gray-300">
              <Sparkles className="w-4 h-4 text-[var(--gold-bright)]" />
              Live restocks for active traders
            </span>
          </div>

          <div className="rounded-2xl bg-[#050509]/80 border border-[rgba(255,220,150,0.18)] shadow-[0_0_35px_rgba(0,0,0,0.7)] p-4 md:p-5">
            <StockRestocker />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-12">
          <SplitText
            text="AOT:R Values Features"
            tag="h2"
            className="text-3xl font-bold text-[var(--gold-bright)] mb-2"
            delay={40}
            duration={1}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          />
          <BlurText
            text="Everything you need for successful Attack on Titan Revolution trading — from accurate values to smarter tools and safer deals."
            delay={200}
            animateBy="words"
            enabled={false}
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-gray-400 mb-8 text-sm md:text-base max-w-xl"
          />

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {[{
              to: "/value-list",
              icon: LineChart,
              label: "Values",
              title: "Real-Time Values",
              desc: "Manually curated values based on active trades, demand and market trends.",
              cta: "Open value list →"
            },{
              to: "/trade-ads",
              icon: Sparkles,
              label: "Trading",
              title: "Trade Ads",
              desc: "Post your offers and find traders looking for the exact items you have.",
              cta: "Browse trade ads →"
            },{
              to: "/calculator",
              icon: Calculator,
              label: "Tools",
              title: "Smart Trade Calculator",
              desc: "Compare offers, calculate total value on both sides and avoid one-sided trades.",
              cta: "Use calculator →"
            },{
              to: "/scam-logs",
              icon: Shield,
              label: "Safety",
              title: "Safer Trading",
              desc: "Check scam logs and stay away from flagged users before you trade.",
              cta: "View scam logs →"
            }].map((card, i) => {
              const Icon = card.icon;
              return (
                <BorderGlow
                  key={i}
                  edgeSensitivity={30}
                  glowColor="40 80 80"
                  backgroundColor="#060010"
                  borderRadius={28}
                  glowRadius={40}
                  glowIntensity={1}
                  coneSpread={25}
                  animated={false}
                  colors={['#FFD700', '#FFC94D', '#FFB347']}
                >
                  <Link to={card.to} className="group block rounded-2xl p-5 md:p-6 transition-transform duration-200 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-8 h-8 text-[var(--gold-bright)] opacity-90" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-soft)]">{card.label}</span>
                    </div>

                    <SplitText
                      text={card.title}
                      tag="h3"
                      className="text-xl font-semibold text-[var(--gold-bright)] mb-1"
                      enabled = {false}
                      delay={30}
                      duration={0.8}
                      ease="power3.out"
                      splitType="chars"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                    />

                    <BlurText
                      text={card.desc}
                      delay={150}
                      animateBy="words"
                      enabled={false}
                      direction="top"
                      className="text-gray-400 text-sm mb-3"
                    />

                    <span className="text-[var(--gold-soft)] text-sm group-hover:text-[var(--gold-bright)]">{card.cta}</span>
                  </Link>
                </BorderGlow>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-16">
          <FAQSection />
        </section>
      </div>
    </div>
  );
}; 
