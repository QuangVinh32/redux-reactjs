import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearch } from "../../redux/slices/ShopSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { searchQuery, cart } = useSelector((s: any) => s.shop);
  const cartCount = cart.reduce((sum: number, c: any) => sum + c.qty, 0);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 md:py-4">
        {/* Row 1: Logo + search (md+) + actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black text-base md:text-lg shadow-md">
              BM
            </div>
            <div>
              <div className="text-base md:text-xl font-black text-slate-900 leading-tight whitespace-nowrap">
                SHOP <span className="text-emerald-600">BM</span>
              </div>
              <div className="hidden md:block text-[10px] text-slate-500 leading-tight">
                Giá Rẻ – Uy Tín – 24/7
              </div>
            </div>
          </Link>

          {/* Search - desktop (md+) inline */}
          <div className="hidden md:block flex-1 max-w-2xl">
            <SearchInput
              value={searchQuery}
              onChange={(v) => dispatch(setSearch(v))}
              showButton
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <Link
              to="/shop/recharge"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              💳 Nạp tiền
            </Link>

            <button className="relative p-2 md:p-2.5 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-lg md:text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="relative p-2 md:p-2.5 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-lg md:text-xl">🔔</span>
              <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Row 2: Search - mobile only */}
        <div className="md:hidden mt-3">
          <SearchInput
            value={searchQuery}
            onChange={(v) => dispatch(setSearch(v))}
            showButton={false}
          />
        </div>
      </div>
    </header>
  );
}

function SearchInput({
  value,
  onChange,
  showButton,
}: {
  value: string;
  onChange: (v: string) => void;
  showButton: boolean;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm BM, Via, Fanpage..."
        className={`w-full h-10 md:h-11 pl-10 md:pl-11 ${
          showButton ? "pr-32" : "pr-4"
        } rounded-full border-2 border-emerald-100 focus:border-emerald-400 outline-none text-sm bg-slate-50 focus:bg-white transition-colors`}
      />
      <span className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </span>
      {showButton && (
        <button className="absolute right-1.5 top-1.5 h-8 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors">
          Tìm kiếm
        </button>
      )}
    </div>
  );
}
