import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-16 font-serif">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 border-2 border-stone-300 flex items-center justify-center font-serif font-bold text-stone-100">
              BM
            </div>
            <span className="font-serif text-lg font-bold text-stone-100">
              SHOP BM
            </span>
          </div>
          <p className="text-sm">
            Shop bán tài khoản BM Facebook giá rẻ, uy tín, bảo hành nhanh chóng 24/7.
          </p>
          <div className="text-xs mt-4 text-stone-500 tracking-widest uppercase">
            Est. 2024
          </div>
        </div>

        <div>
          <h4 className="text-stone-100 font-semibold mb-4 text-sm uppercase tracking-wider">Sản Phẩm</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop/products?cat=bm-normal" className="hover:text-stone-100">BM Thường</Link></li>
            <li><Link to="/shop/products?cat=bm-verified" className="hover:text-stone-100">BM Xác Minh DN</Link></li>
            <li><Link to="/shop/products?cat=bm-limit" className="hover:text-stone-100">BM Limit Cao</Link></li>
            <li><Link to="/shop/products?cat=via" className="hover:text-stone-100">Via Facebook</Link></li>
            <li><Link to="/shop/products?cat=fanpage" className="hover:text-stone-100">Fanpage / Group</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-100 font-semibold mb-4 text-sm uppercase tracking-wider">Hỗ Trợ</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop/faq" className="hover:text-stone-100">Hỏi Đáp</Link></li>
            <li><Link to="/shop/blog" className="hover:text-stone-100">Bài Viết Hướng Dẫn</Link></li>
            <li><Link to="/shop/tools" className="hover:text-stone-100">Công Cụ</Link></li>
            <li><Link to="/shop/api" className="hover:text-stone-100">API Docs</Link></li>
            <li><a href="#" className="hover:text-stone-100">Chính Sách Bảo Mật</a></li>
            <li><a href="#" className="hover:text-stone-100">Điều Khoản Sử Dụng</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-100 font-semibold mb-4 text-sm uppercase tracking-wider">Liên Hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>Hotline: <span className="text-stone-100">0987.654.321</span></li>
            <li>Email: support@shopbm.demo</li>
            <li>Telegram: @shopbm_support</li>
            <li>24/7 — Tất cả các ngày</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-2 font-sans">
          <div>© 2026 SHOP BM (Demo Clone). v1.0.0</div>
          <div>Built with React 19 · Redux Toolkit · Tailwind v4</div>
        </div>
      </div>
    </footer>
  );
}
