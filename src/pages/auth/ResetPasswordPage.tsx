import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useResetPasswordMutation } from "../../api/authApi";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getErrorMessage } from "../../utils/error";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [reset, { isLoading, error }] = useResetPasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw1 !== pw2) {
      dispatch(showToast({ message: "Mật khẩu không khớp", kind: "error" }));
      return;
    }
    try {
      await reset({ token, newPassword: pw1 }).unwrap();
      dispatch(showToast({ message: "Đặt lại mật khẩu thành công", kind: "success" }));
      navigate("/login");
    } catch { /* shown below */ }
  };

  if (!token) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
        <p className="text-sm text-red-600">Link không hợp lệ</p>
        <Link to="/forgot-password" className="mt-3 inline-block text-rose-500 hover:underline">
          Yêu cầu link mới →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-extrabold text-gray-800">Đặt lại mật khẩu</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Mật khẩu mới"
          icon={<Lock size={16} />}
          type="password"
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
          required
          hint="Tối thiểu 8 ký tự"
        />
        <Input
          label="Nhập lại mật khẩu"
          icon={<Lock size={16} />}
          type="password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          required
        />
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {getErrorMessage(error)}
          </div>
        )}
        <Button type="submit" full loading={isLoading}>
          Đặt lại mật khẩu
        </Button>
      </form>
    </div>
  );
}
