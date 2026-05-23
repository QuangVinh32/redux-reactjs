import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearch } from "../../redux/slices/ShopSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { searchQuery, cart } = useSelector((s: any) => s.shop);
  const cartCount = cart.reduce((sum: number, c: any) => sum + c.qty, 0);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
        {/* Logo */}
        <Link to="/shop" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md">
            BM
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 leading-tight">
              SHOP <span className="text-emerald-600">BM</span>
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              Giá Rẻ – Uy Tín – 24/7
            </div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="Tìm kiếm tài khoản BM, Via, Fanpage..."
              className="w-full h-11 pl-11 pr-32 rounded-full border-2 border-emerald-100 focus:border-emerald-400 outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <button className="absolute right-1.5 top-1.5 h-8 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/shop/recharge"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold transition-colors"
          >
            💳 Nạp tiền
          </Link>

          <button className="relative p-2.5 rounded-lg hover:bg-slate-100 transition-colors">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button className="relative p-2.5 rounded-lg hover:bg-slate-100 transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
