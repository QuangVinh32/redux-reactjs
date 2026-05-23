import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm">
              BM
            </div>
            <span className="text-lg font-black text-white">
              SHOP <span className="text-emerald-400">BM</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Shop bán tài khoản BM Facebook giá rẻ, uy tín, bảo hành nhanh chóng
            24/7.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors">
              📘
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors">
              ✈️
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors">
              💬
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Sản Phẩm</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop/products?cat=bm-normal" className="hover:text-emerald-400">BM Thường</Link></li>
            <li><Link to="/shop/products?cat=bm-verified" className="hover:text-emerald-400">BM Xác Minh DN</Link></li>
            <li><Link to="/shop/products?cat=bm-limit" className="hover:text-emerald-400">BM Limit Cao</Link></li>
            <li><Link to="/shop/products?cat=via" className="hover:text-emerald-400">Via Facebook</Link></li>
            <li><Link to="/shop/products?cat=fanpage" className="hover:text-emerald-400">Fanpage / Group</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Hỗ Trợ</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop/faq" className="hover:text-emerald-400">Hỏi Đáp</Link></li>
            <li><Link to="/shop/blog" className="hover:text-emerald-400">Bài Viết Hướng Dẫn</Link></li>
            <li><Link to="/shop/tools" className="hover:text-emerald-400">Công Cụ Free</Link></li>
            <li><Link to="/shop/api" className="hover:text-emerald-400">API Docs</Link></li>
            <li><a href="#" className="hover:text-emerald-400">Chính Sách Bảo Mật</a></li>
            <li><a href="#" className="hover:text-emerald-400">Điều Khoản Sử Dụng</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Liên Hệ</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>📞 Hotline: <span className="text-emerald-400">0987.654.321</span></li>
            <li>📧 Email: support@shopbm.demo</li>
            <li>💬 Telegram: @shopbm_support</li>
            <li>⏰ 24/7 – Tất cả các ngày</li>
          </ul>

          <div className="mt-5 p-3 bg-slate-800 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Phương thức nạp:</div>
            <div className="flex gap-2 text-lg">
              🏦 💸 💵 ₿ 💳
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>© 2026 SHOP BM (Demo Clone). v1.0.0</div>
          <div>Built with React 19 · Redux Toolkit · Tailwind v4</div>
        </div>
      </div>
    </footer>
  );
}
