import { Outlet, Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import Toast from "../common/Toast";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center gap-12 px-6 py-8 lg:gap-28">
        <div className="hidden flex-1 flex-col justify-between self-stretch py-8 lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-15 w-15 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white">
              <ChefHat size={50} />
            </div>
            <span className="text-3xl font-extrabold text-gray-800">
              Shop<span className="text-rose-500">Food</span>
            </span>
          </Link>
          <div>
            <h2 className="text-5xl font-extrabold leading-tight text-gray-800">
              Đặt món ngon, <br /> giao tận cửa 🍔
            </h2>
            <p className="mt-3 max-w-md text-sm text-gray-600">
              Tham gia ShopFood để nhận voucher 10% cho đơn đầu tiên & freeship 300k+.
            </p>
          </div>
          <div className="text-xs text-gray-400">© 2026 ShopFood</div>
        </div>
        <div className="w-full max-w-md flex-shrink-0">
          <Outlet />
        </div>
      </div>
      <Toast />
    </div>
  );
}
