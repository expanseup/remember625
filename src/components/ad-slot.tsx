"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AdPlacement = "main" | "result" | "wall";
type AdUnitKey = "mobileLarge" | "mobileSlim" | "square" | "wide";

type AdUnit = {
  key: AdUnitKey;
  unit: string;
  width: number;
  height: number;
};

const KAKAO_AD_SCRIPT_URL = "https://t1.kakaocdn.net/kas/static/ba.min.js";

const AD_UNITS: Record<AdUnitKey, AdUnit> = {
  mobileLarge: {
    key: "mobileLarge",
    unit: "DAN-rqVulq3ixbjIJK0I",
    width: 320,
    height: 100,
  },
  square: {
    key: "square",
    unit: "DAN-ufqDWiHFDsvKcLWr",
    width: 250,
    height: 250,
  },
  wide: {
    key: "wide",
    unit: "DAN-MwrdXUgsOALYr9jf",
    width: 728,
    height: 90,
  },
  mobileSlim: {
    key: "mobileSlim",
    unit: "DAN-9iVv95wxc4NIO5ff",
    width: 320,
    height: 50,
  },
};

const PLACEMENT_UNITS: Record<
  AdPlacement,
  { mobile: AdUnitKey; desktop: AdUnitKey }
> = {
  main: { mobile: "mobileLarge", desktop: "wide" },
  result: { mobile: "mobileSlim", desktop: "square" },
  wall: { mobile: "square", desktop: "wide" },
};

function selectAdUnit(placement: AdPlacement, isDesktop: boolean) {
  const key = isDesktop
    ? PLACEMENT_UNITS[placement].desktop
    : PLACEMENT_UNITS[placement].mobile;

  return AD_UNITS[key];
}

export function AdSlot({
  className,
  placement = "main",
}: {
  className?: string;
  placement?: AdPlacement;
}) {
  const [unit, setUnit] = useState<AdUnit | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateUnit = () => setUnit(selectAdUnit(placement, mediaQuery.matches));

    updateUnit();
    mediaQuery.addEventListener("change", updateUnit);

    return () => mediaQuery.removeEventListener("change", updateUnit);
  }, [placement]);

  useEffect(() => {
    if (!unit) return;

    const script = document.createElement("script");
    script.src = KAKAO_AD_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-remember625-ad-loader", `${placement}-${unit.key}`);
    document.body.appendChild(script);

    return () => script.remove();
  }, [placement, unit]);

  const width = unit?.width ?? 320;
  const height = unit?.height ?? 100;

  return (
    <aside
      className={cn(
        "text-gray-text/60 flex items-center justify-center text-xs tracking-[0.14em]",
        className,
      )}
      aria-label="광고"
    >
      <div
        className="border-navy/10 flex max-w-full items-center justify-center overflow-hidden rounded-2xl border bg-white/45"
        style={{ width, minHeight: height }}
      >
        {unit ? (
          <ins
            key={`${placement}-${unit.key}`}
            className="kakao_ad_area"
            style={{ display: "none" }}
            data-ad-unit={unit.unit}
            data-ad-width={String(unit.width)}
            data-ad-height={String(unit.height)}
          />
        ) : (
          <span>광고 영역</span>
        )}
      </div>
    </aside>
  );
}
