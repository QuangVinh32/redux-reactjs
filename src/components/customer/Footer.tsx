export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="text-lg font-extrabold text-gray-800">
            Shop<span className="text-rose-500">Food</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Đặt món online — giao nhanh, tươi ngon, freeship đơn từ 300k.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold text-gray-800">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Hướng dẫn đặt món</li>
            <li>Chính sách đổi trả</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold text-gray-800">Liên hệ</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>hotline@shopfood.local</li>
            <li>1900 1234</li>
            <li>123 Lê Lợi, Q1, TP. HCM</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold text-gray-800">Thanh toán</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>💳 Momo</li>
            <li>💵 Tiền mặt khi nhận hàng</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-4 text-center text-xs text-gray-400">
        © 2026 ShopFood. All rights reserved.
      </div>
    </footer>
  );
}
