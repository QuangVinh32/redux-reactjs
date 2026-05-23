import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/ShopSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setError("");
    dispatch(login({ username: username.trim(), balance: 250000 }));
    navigate("/shop");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 md:py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 px-6 py-8 text-center text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black mb-3 shadow-lg">
            BM
          </div>
          <h1 className="text-2xl font-black">Đăng Nhập</h1>
          <p className="text-emerald-50 text-sm mt-1">
            Chào mừng quay lại Shop BM
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {/* Username */}
          <label className="block">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">
              Tài khoản / Email
            </span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                👤
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập hoặc email"
                className="w-full h-11 pl-10 pr-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-400 outline-none text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                autoFocus
              />
            </div>
          </label>

          {/* Password */}
          <label className="block">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">
              Mật khẩu
            </span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                🔒
              </span>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full h-11 pl-10 pr-12 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-400 outline-none text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm"
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          {/* Remember + forgot */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-emerald-500 w-4 h-4"
              />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-bold transition-colors shadow-lg shadow-emerald-200"
          >
            🔓 Đăng Nhập
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-500 dark:text-slate-400">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className="h-11 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-2xl transition-colors"
              title="Facebook"
            >
              📘
            </button>
            <button
              type="button"
              className="h-11 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-2xl transition-colors"
              title="Google"
            >
              🔴
            </button>
            <button
              type="button"
              className="h-11 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-2xl transition-colors"
              title="Telegram"
            >
              ✈️
            </button>
          </div>

          {/* Register link */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
            Chưa có tài khoản?{" "}
            <Link
              to="/shop/register"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold"
            >
              Đăng ký ngay →
            </Link>
          </div>
        </form>
      </div>

      {/* Demo hint */}
      <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300">
        <b>💡 Demo:</b> Đây là form mock. Nhập tài khoản bất kỳ và mật khẩu ≥ 6
        ký tự sẽ đăng nhập thành công với số dư 250.000đ.
      </div>
    </div>
  );
}
