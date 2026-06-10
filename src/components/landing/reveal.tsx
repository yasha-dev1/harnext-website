"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper. Adds `.in` when the element enters the viewport,
 * with a timed sweep as a safety net so content never stays invisible.
 * (Reduced-motion users get instant visibility straight from the CSS.)
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  style,
  children,
}: {
  as?: "div" | "article" | "section";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("in");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    const sweep = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        show();
        io.disconnect();
      }
    }, 700);
    return () => {
      io.disconnect();
      window.clearTimeout(sweep);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={style}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
