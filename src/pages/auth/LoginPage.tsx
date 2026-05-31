import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
} from "lucide-react";

import { useLoginMutation } from "../../api/authApi";
import { useAppDispatch } from "../../redux/Store";
import { setSession } from "../../redux/slices/authSlice";
import { showToast } from "../../redux/slices/uiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getErrorMessage } from "../../utils/error";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ username, password }).unwrap();

      dispatch(setSession(res));

      dispatch(
        showToast({
          message: `Chào ${res.fullName}!`,
          kind: "success",
        })
      );

      if (res.role === "ADMIN" || res.role === "MANAGER") {
        navigate(from.startsWith("/admin") ? from : "/admin");
      } else {
        navigate(from);
      }
    } catch {
      //
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-extrabold text-gray-800">
        Đăng nhập
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Chào mừng quay lại ShopFood
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Tên đăng nhập"
          icon={<UserIcon size={16} />}
          placeholder="nguyenvana"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        {/* PASSWORD */}
        <div className="relative">
          <Input
            label="Mật khẩu"
            icon={<Lock size={16} />}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span />

          <Link
            to="/forgot-password"
            className="text-rose-500 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {getErrorMessage(error)}
          </div>
        )}

        <Button type="submit" full loading={isLoading}>
          Đăng nhập
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-semibold text-rose-500 hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}