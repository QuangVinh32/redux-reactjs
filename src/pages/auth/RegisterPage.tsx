import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  MapPin,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react"; import { useRegisterMutation } from "../../api/authApi";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getErrorMessage } from "../../utils/error";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);
    try {
      await register(fd).unwrap();
      dispatch(
        showToast({
          message: "Đăng ký thành công! Kiểm tra email để xác thực.",
          kind: "success",
        })
      );
      navigate("/login");
    } catch { /* error shown below */ }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-extrabold text-gray-800">Đăng ký</h1>
      <p className="mt-1 text-sm text-gray-500">Tạo tài khoản ShopFood</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
        <div className="flex items-center gap-4">
          <label className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:border-rose-400">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                <Camera size={18} />
                <span className="text-[10px]">Avatar</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
          <div className="flex-1">
            <Input
              label="Họ tên"
              icon={<UserIcon size={16} />}
              value={form.fullName}
              onChange={set("fullName")}
              required
            />
          </div>
        </div>
        <Input
          label="Tên đăng nhập"
          icon={<UserIcon size={16} />}
          value={form.username}
          onChange={set("username")}
          required
        />
        <Input
          label="Email"
          icon={<Mail size={16} />}
          type="email"
          value={form.email}
          onChange={set("email")}
          required
        />
        <div className="relative">
          <Input
            label="Mật khẩu"
            icon={<Lock size={16} />}
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
            hint="Tối thiểu 8 ký tự"
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
        <Input
          label="Số điện thoại"
          icon={<Phone size={16} />}
          value={form.phone}
          onChange={set("phone")}
          required
        />
        <Input
          label="Địa chỉ"
          icon={<MapPin size={16} />}
          value={form.address}
          onChange={set("address")}
          required
        />
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {getErrorMessage(error)}
          </div>
        )}
        <Button type="submit" full loading={isLoading}>
          Tạo tài khoản
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-rose-500 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
