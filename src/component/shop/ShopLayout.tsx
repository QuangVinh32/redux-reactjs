import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TopBar from "./TopBar";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SeasonalDecorations from "./SeasonalDecorations";
import type { Theme } from "../../redux/slices/ShopSlice";

const themeClasses: Record<Theme, string> = {
  light: "",
  dark: "dark",
  tet: "theme-tet",
  christmas: "theme-christmas",
  halloween: "theme-halloween dark",
};

const fontScaleClass: Record<"sm" | "md" | "lg", string> = {
  sm: "text-[14px]",
  md: "",
  lg: "text-[17px]",
};

export default function ShopLayout() {
  const theme = useSelector((s: any) => s.shop.theme as Theme);
  const compactMode = useSelector((s: any) => s.shop.compactMode as boolean);
  const fontScale = useSelector(
    (s: any) => s.shop.fontScale as "sm" | "md" | "lg"
  );

  useEffect(() => {
    const root = document.documentElement;
    // Strip all theme classes first
    root.classList.remove(
      "dark",
      "theme-tet",
      "theme-christmas",
      "theme-halloween"
    );
    const cls = themeClasses[theme];
    if (cls) {
      cls.split(" ").forEach((c) => root.classList.add(c));
    }
  }, [theme]);

  return (
    <div
      className={`shop-root min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col ${fontScaleClass[fontScale]} ${compactMode ? "leading-tight" : ""}`}
    >
      <SeasonalDecorations />
      <TopBar />
      <Header />
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      <Link
        to="/"
        className="fixed bottom-4 right-4 z-50 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-md shadow-lg"
      >
        ← Counter App
      </Link>
    </div>
  );
}
