import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { Theme } from "../../redux/slices/ShopSlice";

const config: Record<Theme, { emojis: string[]; banner: string | null; bannerBg: string }> = {
  light: { emojis: [], banner: null, bannerBg: "" },
  dark: { emojis: [], banner: null, bannerBg: "" },
  tet: {
    emojis: ["🧧", "🏮", "🎆", "🌸", "🐉", "✨"],
    banner: "🧧 Chúc Mừng Năm Mới – Lì xì 88K cho đơn đầu năm! 🏮",
    bannerBg: "bg-gradient-to-r from-rose-600 via-red-600 to-amber-500",
  },
  christmas: {
    emojis: ["❄️", "🎄", "⛄", "🎅", "🎁", "✨"],
    banner: "🎄 Merry Christmas – Giảm 25% toàn shop dịp lễ! 🎁",
    bannerBg: "bg-gradient-to-r from-red-700 via-green-700 to-red-700",
  },
  halloween: {
    emojis: ["🎃", "👻", "🦇", "🕷️", "🕸️", "💀"],
    banner: "🎃 Trick or Treat – Giảm 31% mã HALLO31! 👻",
    bannerBg: "bg-gradient-to-r from-orange-600 via-purple-800 to-orange-600",
  },
};

export default function SeasonalDecorations() {
  const theme = useSelector((s: any) => s.shop.theme as Theme);
  const enabled = useSelector((s: any) => s.shop.enableDecorations as boolean);

  const flakes = useMemo(() => {
    const cfg = config[theme];
    if (!enabled || cfg.emojis.length === 0) return [];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: cfg.emojis[i % cfg.emojis.length],
      left: Math.random() * 100,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 8,
      size: 14 + Math.random() * 14,
    }));
  }, [theme, enabled]);

  const cfg = config[theme];
  if (!enabled || theme === "light" || theme === "dark") return null;

  return (
    <>
      {/* Top seasonal banner */}
      {cfg.banner && (
        <div
          className={`${cfg.bannerBg} text-white text-center text-xs md:text-sm font-semibold py-2 px-4 overflow-hidden`}
        >
          <span className="inline-block animate-pulse">{cfg.banner}</span>
        </div>
      )}

      {/* Floating emojis */}
      <div className="pointer-events-none">
        {flakes.map((f) => (
          <span
            key={f.id}
            className="snow-flake"
            style={{
              left: `${f.left}%`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              fontSize: `${f.size}px`,
            }}
          >
            {f.emoji}
          </span>
        ))}
      </div>
    </>
  );
}
