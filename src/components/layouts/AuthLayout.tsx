import { Outlet, Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import Toast from "../common/Toast";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-white">
      <div className="hidden flex-1 flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white">
            <ChefHat size={20} />
          </div>
          <span className="text-xl font-extrabold text-gray-800">
            Shop<span className="text-rose-500">Food</span>
          </span>
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight text-gray-800">
            Đặt món ngon, <br /> giao tận cửa 🍔
          </h2>
          <p className="mt-3 max-w-md text-sm text-gray-600">
            Tham gia ShopFood để nhận voucher 10% cho đơn đầu tiên & freeship 300k+.
          </p>
        </div>
        <div className="text-xs text-gray-400">© 2026 ShopFood</div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
      <Toast />
    </div>
  );
}
