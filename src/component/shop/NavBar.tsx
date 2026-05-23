import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { mainNav, subNav } from "../../constants/ShopData";

export default function NavBar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isActive = (path: string) => {
    const base = path.split("?")[0];
    if (base === "/shop") return location.pathname === "/shop";
    return location.pathname.startsWith(base);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Main nav */}
          <ul className="flex items-center">
            {mainNav.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive(item.path)
                      ? "bg-emerald-800/40"
                      : "hover:bg-emerald-800/30"
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                  {item.children && <span className="text-xs">▾</span>}
                </Link>

                {item.children && openMenu === item.label && (
                  <ul className="absolute top-full left-0 min-w-[220px] bg-white text-slate-800 shadow-xl rounded-b-lg overflow-hidden border-t-2 border-amber-400">
                    {item.children.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          to={sub.path}
                          className="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Sub nav (right side) */}
          <ul className="hidden lg:flex items-center text-xs">
            {subNav.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className="block px-3 py-3.5 hover:bg-emerald-800/30 transition-colors whitespace-nowrap"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
