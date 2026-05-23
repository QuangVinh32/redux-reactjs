import { useState } from"react";
import { Link, useNavigate } from"react-router-dom";
import { useDispatch, useSelector } from"react-redux";
import { User, Phone, Mail, Lock, KeyRound, Tag, Eye, EyeOff } from"lucide-react";
import { registerThunk } from"../../redux/slices/ShopSlice";
import type { AppDispatch } from"../../redux/Store";

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
 username:"",
 email:"",
 phone:"",
 password:"",
 confirm:"",
 refCode:"",
 agree: false,
};

export default function Register() {
 const dispatch = useDispatch<AppDispatch>();
 const navigate = useNavigate();
 const authLoading = useSelector((s: any) => s.shop.authLoading as boolean);
 const authError = useSelector((s: any) => s.shop.authError as string);
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

 const strengthLabel = ["Quá yếu","Yếu","Trung bình","Mạnh","Rất mạnh"];
 const strengthColor = [
"bg-slate-200",
"bg-rose-500",
"bg-amber-500",
"bg-emerald-500",
"bg-emerald-600",
 ];

 const onSubmit = async (e: React.FormEvent) => {
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
 const res = await dispatch(registerThunk({
 username: form.username.trim(),
 email: form.email.trim(),
 phone: form.phone.trim(),
 password: form.password,
 refCode: form.refCode.trim() || undefined,
 }));
 if (!registerThunk.fulfilled.match(res)) return;
 navigate("/shop");
 };

 return (
 <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
 <div className="bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-800 overflow-hidden">
 {/* Header */}
 <div className="bg-stone-900 dark:bg-stone-100 px-6 py-8 text-center text-white dark:text-stone-900 border-b border-stone-200 dark:border-slate-800">
 <div className="w-14 h-14 mx-auto border-2 border-white dark:border-stone-900 flex items-center justify-center text-xl font-bold mb-3">
 BM
 </div>
 <h1 className="text-2xl font-bold tracking-wide">Đăng Ký Tài Khoản</h1>
 <p className="text-stone-300 dark:text-stone-700 text-xs mt-2 uppercase tracking-[0.2em]">
 Tặng 50.000đ cho thành viên mới
 </p>
 </div>

 <form onSubmit={onSubmit} className="p-6 space-y-4">
 {(error || authError) && (
 <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2">
 {error || authError}
 </div>
 )}

 {/* Username + Phone */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Field
 label="Tài khoản *"
 icon={<User size={14} />}
 value={form.username}
 onChange={(v) => set("username", v)}
 placeholder="Tên đăng nhập"
 autoFocus
 />
 <Field
 label="Số điện thoại *"
 icon={<Phone size={14} />}
 value={form.phone}
 onChange={(v) => set("phone", v.replace(/\D/g,""))}
 placeholder="0987..."
 inputMode="numeric"
 />
 </div>

 {/* Email */}
 <Field
 label="Email *"
 icon={<Mail size={14} />}
 type="email"
 value={form.email}
 onChange={(v) => set("email", v)}
 placeholder="your@email.com"
 />

 {/* Password */}
 <div>
 <Field
 label="Mật khẩu *"
 icon={<Lock size={14} />}
 type={showPwd ?"text" :"password"}
 value={form.password}
 onChange={(v) => set("password", v)}
 placeholder="Ít nhất 6 ký tự"
 suffix={
 <button
 type="button"
 onClick={() => setShowPwd((s) => !s)}
 className="text-stone-500 hover:text-stone-900"
 >
 {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
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
 className={`h-1 ${
 i <= pwdStrength
 ? strengthColor[pwdStrength]
 :"bg-slate-200"
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
 icon={<KeyRound size={14} />}
 type="password"
 value={form.confirm}
 onChange={(v) => set("confirm", v)}
 placeholder="Nhập lại mật khẩu"
 />

 {/* Ref code */}
 <Field
 label="Mã giới thiệu (tuỳ chọn)"
 icon={<Tag size={14} />}
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
 Tôi đồng ý với{""}
 <a href="#" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
 Điều khoản sử dụng
 </a>{""}
 và{""}
 <a href="#" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
 Chính sách bảo mật
 </a>
 .
 </span>
 </label>

 {/* Submit */}
 <button
 type="submit"
 disabled={authLoading}
 className="w-full h-12 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold tracking-wide transition-colors"
 >
 {authLoading ?"Đang xử lý..." :"Đăng ký"}
 </button>

 <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
 Đã có tài khoản?{""}
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
 icon: React.ReactNode;
 value: string;
 onChange: (v: string) => void;
 placeholder?: string;
 type?: string;
 autoFocus?: boolean;
 inputMode?:"text" |"numeric" |"email";
 suffix?: React.ReactNode;
};

function Field({
 label,
 icon,
 value,
 onChange,
 placeholder,
 type ="text",
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
 className={`w-full h-11 pl-10 ${suffix ?"pr-12" :"pr-4"} border border-stone-300 dark:border-slate-700 focus:border-stone-900 dark:focus:border-stone-300 outline-none text-sm bg-white dark:bg-slate-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-colors`}
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
