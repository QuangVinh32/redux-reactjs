import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { mainNav, subNav } from "../../constants/ShopData";

export default function NavBar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    const base = path.split("?")[0];
    if (base === "/shop") return location.pathname === "/shop";
    return location.pathname.startsWith(base);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="lg:hidden flex items-center justify-between py-2.5">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 border border-stone-300 dark:border-slate-700 hover:border-stone-900 dark:hover:border-stone-300 text-stone-900 dark:text-stone-100 transition-colors"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            <span className="text-sm font-semibold uppercase tracking-wider">Menu</span>
          </button>
          <Link to="/shop" className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
            Trang Chủ
          </Link>
          <Link to="/shop/recharge" className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider">
            Nạp
          </Link>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200 dark:border-slate-800 py-3 max-h-[70vh] overflow-y-auto">
            <ul className="space-y-px">
              {mainNav.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={closeMobile}
                    className={`block px-3 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                      isActive(item.path)
                        ? "bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-stone-100"
                        : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="ml-3 border-l border-stone-200 dark:border-slate-700 pl-3 my-1">
                      {item.children.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            to={sub.path}
                            onClick={closeMobile}
                            className="block px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                          >
                            — {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="border-t border-stone-200 dark:border-slate-800 mt-3 pt-3">
              <div className="text-[10px] uppercase tracking-widest text-stone-500 px-3 mb-1">Khác</div>
              <ul>
                {subNav.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      onClick={closeMobile}
                      className="block px-3 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="hidden lg:flex items-center justify-between">
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
                  className={`flex items-center gap-1 px-3 xl:px-4 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive(item.path)
                      ? "text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown size={12} />}
                </Link>
                {item.children && openMenu === item.label && (
                  <ul className="absolute top-full left-0 min-w-[220px] bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 shadow-lg">
                    {item.children.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          to={sub.path}
                          className="block px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
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

          <ul className="hidden xl:flex items-center">
            {subNav.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className="block px-3 py-3.5 text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors uppercase tracking-wider whitespace-nowrap"
                >
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
