import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Search, ShoppingBag, Bell, CreditCard } from "lucide-react";
import { setSearch } from "../../redux/slices/ShopSlice";

export default function Header() {
 const dispatch = useDispatch();
 const { searchQuery, cart } = useSelector((s: any) => s.shop);
 const cartCount = cart.reduce((sum: number, c: any) => sum + c.qty, 0);

 return (
 <header className="bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800">
 <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 md:py-4">
 <div className="flex items-center gap-3 md:gap-6">
 {/* Logo */}
 <Link to="/shop" className="flex items-center gap-2 shrink-0">
 <div className="w-9 h-9 md:w-10 md:h-10 border-2 border-stone-900 dark:border-stone-100 flex items-center justify-center text-stone-900 dark:text-stone-100 font-serif font-black text-sm md:text-base">
 BM
 </div>
 <div>
 <div className="font-serif text-base md:text-xl font-bold text-stone-900 dark:text-stone-100 leading-tight whitespace-nowrap">
 SHOP BM
 </div>
 <div className="hidden md:block text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 leading-tight">
 Est. 2024
 </div>
 </div>
 </Link>

 {/* Search md+ */}
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
 className="hidden md:flex items-center gap-2 px-4 py-2 border border-stone-300 dark:border-slate-700 hover:border-stone-900 dark:hover:border-stone-300 text-stone-700 dark:text-stone-200 text-sm font-semibold transition-colors whitespace-nowrap"
 >
 <CreditCard size={14} />
 Nạp tiền
 </Link>

 <button className="relative p-2 md:p-2.5 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-stone-200 transition-colors">
 <ShoppingBag size={18} />
 {cartCount > 0 && (
 <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-bold flex items-center justify-center">
 {cartCount}
 </span>
 )}
 </button>

 <button className="relative p-2 md:p-2.5 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-stone-200 transition-colors">
 <Bell size={18} />
 <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 bg-rose-600 "></span>
 </button>
 </div>
 </div>

 {/* Mobile search */}
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
 value, onChange, showButton,
}: { value: string; onChange: (v: string) => void; showButton: boolean }) {
 return (
 <div className="relative">
 <input
 type="text"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 placeholder="Tìm BM, Via, Fanpage..."
 className={`w-full h-10 md:h-11 pl-10 md:pl-11 ${
 showButton ? "pr-24" : "pr-4"
 } border border-stone-300 dark:border-slate-700 focus:border-stone-900 dark:focus:border-stone-300 outline-none text-sm bg-white dark:bg-slate-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-colors`}
 />
 <Search
 size={16}
 className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-stone-400"
 />
 {showButton && (
 <button className="absolute right-0 top-0 h-full px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-colors">
 Tìm
 </button>
 )}
 </div>
 );
}
