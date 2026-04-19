import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  enabled?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
  enabled = true
}) => {
  const Tag = (tag || "p") as React.ElementType;

  // 🚀 FULL BYPASS (no GSAP, no hooks)
  if (!enabled) {
    return (
      <Tag
        style={{
          textAlign,
          wordWrap: "break-word",
          backgroundImage:
            "linear-gradient(120deg, #c6a44b 0%, #f5d97a 40%, #fff3b0 50%, #f5d97a 60%, #c6a44b 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
        className={`inline-block whitespace-normal ${className}`}
      >
        {text}
      </Tag>
    );
  }

  // Animated mode only below
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  //Only load fonts if animation is enabled
  useEffect(() => {
    if (!enabled) return;

    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, [enabled]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current as HTMLElement & {
        _split?: GSAPSplitText;
      };

      // cleanup previous
      if (el._split) {
        try {
          el._split.revert();
        } catch {}
        el._split = undefined;
      }

      const startPct = (1 - threshold) * 100;

      const marginMatch =
        /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";

      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;

      const start = `top ${startPct}%${sign}`;

      let targets: Element[] = [];

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        reduceWhiteSpace: false,

        onSplit: (self: GSAPSplitText) => {
          // assign targets
          if (splitType.includes("chars") && self.chars?.length)
            targets = self.chars;
          else if (splitType.includes("words") && self.words?.length)
            targets = self.words;
          else if (splitType.includes("lines") && self.lines?.length)
            targets = self.lines;
          else targets = self.chars || self.words || self.lines;

          // gradient styling
          targets.forEach((t: any) => {
            t.style.backgroundImage =
              "linear-gradient(120deg, #c6a44b 0%, #f5d97a 40%, #fff3b0 50%, #f5d97a 60%, #c6a44b 100%)";
            t.style.backgroundSize = "200% auto";
            t.style.webkitBackgroundClip = "text";
            t.style.backgroundClip = "text";
            t.style.webkitTextFillColor = "transparent";
          });

          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              }
            }
          );
        }
      });

      el._split = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });

        try {
          splitInstance.revert();
        } catch {}

        el._split = undefined;
      };
    },
    {
      dependencies: [text, fontsLoaded],
      scope: ref
    }
  );

  return (
    <Tag
      ref={ref}
      style={{
        textAlign,
        wordWrap: "break-word"
      }}
      className={`split-parent overflow-hidden inline-block whitespace-normal ${className}`}
    >
      {text}
    </Tag>
  );
};

export default SplitText;