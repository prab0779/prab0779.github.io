import React, { useRef, useEffect, useState } from "react";
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
import ScrollReveal from "../Shared/ScrollReveal";
import Dock from "../Shared/Dock";
import GradientText from "../Shared/GradientText";

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
    onClick: () =>
      window.open(
        "https://www.roblox.com/games/13379208636/Attack-on-Titan-Revolution",
        "_blank"
      ),
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
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 100);
    const t3 = setTimeout(() => setStage(3), 100);
    const t4 = setTimeout(() => setStage(4), 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('/gridd.svg')] opacity-10 mix-blend-soft-light pointer-events-none" />

      <div className="relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden w-full pt-[200px] md:pt-[500px] pb-[140px] md:pb-[200px]">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[150%] opacity-40 pointer-events-none">
            <ShapeGrid
              speed={0.5}
              squareSize={40}
              direction="diagonal"
              borderColor="#271E37"
              hoverFillColor="#222222"
              shape="square"
            />
          </div>

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            <div className="text-center lg:text-left space-y-4">
              
              <ShinyText
                text="AOT:R Trading Hub"
                className="text-xs uppercase tracking-[0.25em] flex justify-center lg:justify-start"
              />

              {stage >= 1 && (
                <SplitText
                  text="AOT:R Values"
                  tag="h1"
                  className="text-4xl md:text-6xl font-extrabold text-[var(--gold-bright)]"
                />
              )}

              {stage >= 1 && (
                <BlurText
                  text="The ultimate hub for Attack on Titan Revolution trading."
                  className="text-xl text-center lg:text-left"
                />
              )}

              {stage >= 2 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  
                  <StarBorder as={Link} to="/trade-ads">
                    <GradientText variant="silver">
                      Start Trading →
                    </GradientText>
                  </StarBorder>

                  <StarBorder as={Link} to="/value-list">
                    <GradientText variant="gold">
                      View Values ★
                    </GradientText>
                  </StarBorder>

                </div>
              )}
            </div>

            {stage >= 3 && <Carousel />}
          </div>

          {stage >= 3 && <Dock items={DockItems} />}
        </section>

        {/* VIDEO SECTION */}
        <ScrollReveal>
          <section className="max-w-7xl mx-auto px-4 pb-10">
            
            <SplitText text="Popular Highlights" tag="h2" />

            <BlurText text="Community clips and updates." enabled={false} />

            <VideoSlider />
          </section>
        </ScrollReveal>

        {/* STOCK */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <SplitText text="Stock Restocker" tag="h2" />
          <StockRestocker />
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          
          <SplitText text="AOT:R Features" tag="h2" />

          <p className="text-gray-400 mb-8 max-w-xl">
            <GradientText variant="silver">
              Everything you need for trading — values, tools, and safety.
            </GradientText>
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {[{
              to: "/value-list",
              icon: LineChart,
              title: "Real-Time Values",
              desc: "Accurate values based on market trends.",
            }].map((card, i) => {
              const Icon = card.icon;
              return (
                <BorderGlow key={i}>
                  <Link to={card.to} className="block p-6">
                    
                    <Icon className="w-8 h-8 text-yellow-400" />

                    <h3 className="text-xl mt-2">
                      <GradientText variant="gold">
                        {card.title}
                      </GradientText>
                    </h3>

                    <p className="text-gray-400 text-sm">
                      <GradientText variant="silver">
                        {card.desc}
                      </GradientText>
                    </p>

                  </Link>
                </BorderGlow>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />
      </div>
    </div>
  );
};