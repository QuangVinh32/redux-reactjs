import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/ShopSlice";

type Form = {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  refCode: string;
  agree: boolean;
};

const empty: Form = {
  username: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
  refCode: "",
  agree: false,
};

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(empty);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const pwdStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  })();

  const strengthLabel = ["Quá yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
  const strengthColor = [
    "bg-slate-200",
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-emerald-600",
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirm
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Email không hợp lệ.");
      return;
    }
    if (!/^[0-9]{9,11}$/.test(form.phone)) {
      setError("Số điện thoại phải có 9-11 chữ số.");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!form.agree) {
      setError("Bạn cần đồng ý với điều khoản sử dụng.");
      return;
    }
    setError("");
    dispatch(login({ username: form.username.trim(), balance: 50000 }));
    navigate("/shop");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 px-6 py-8 text-center text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black mb-3 shadow-lg">
            BM
          </div>
          <h1 className="text-2xl font-black">Đăng Ký Tài Khoản</h1>
          <p className="text-amber-50 text-sm mt-1">
            Tặng <b>50.000đ</b> cho thành viên mới
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {/* Username + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Tài khoản *"
              icon="👤"
              value={form.username}
              onChange={(v) => set("username", v)}
              placeholder="Tên đăng nhập"
              autoFocus
            />
            <Field
              label="Số điện thoại *"
              icon="📱"
              value={form.phone}
              onChange={(v) => set("phone", v.replace(/\D/g, ""))}
              placeholder="0987..."
              inputMode="numeric"
            />
          </div>

          {/* Email */}
          <Field
            label="Email *"
            icon="📧"
            type="email"
            value={form.email}
            onChange={(v) => set("email", v)}
            placeholder="your@email.com"
          />

          {/* Password */}
          <div>
            <Field
              label="Mật khẩu *"
              icon="🔒"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(v) => set("password", v)}
              placeholder="Ít nhất 6 ký tự"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="text-slate-500 hover:text-slate-700 text-sm"
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              }
            />
            {/* Strength bar */}
            {form.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full ${
                        i <= pwdStrength
                          ? strengthColor[pwdStrength]
                          : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap">
                  {strengthLabel[pwdStrength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <Field
            label="Xác nhận mật khẩu *"
            icon="🔐"
            type="password"
            value={form.confirm}
            onChange={(v) => set("confirm", v)}
            placeholder="Nhập lại mật khẩu"
          />

          {/* Ref code */}
          <Field
            label="Mã giới thiệu (tuỳ chọn)"
            icon="🎁"
            value={form.refCode}
            onChange={(v) => set("refCode", v)}
            placeholder="Nhập mã nếu có"
          />

          {/* Agree */}
          <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => set("agree", e.target.checked)}
              className="accent-emerald-500 w-4 h-4 mt-0.5"
            />
            <span>
              Tôi đồng ý với{" "}
              <a href="#" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a href="#" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                Chính sách bảo mật
              </a>
              .
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:opacity-90 text-white font-bold transition-opacity shadow-lg shadow-amber-200"
          >
            🎉 Đăng Ký Ngay
          </button>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
            Đã có tài khoản?{" "}
            <Link
              to="/shop/login"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold"
            >
              ← Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  inputMode?: "text" | "numeric" | "email";
  suffix?: React.ReactNode;
};

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
  inputMode,
  suffix,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">
        {label}
      </span>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          inputMode={inputMode}
          className={`w-full h-11 pl-10 ${suffix ? "pr-12" : "pr-4"} rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-400 outline-none text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}
