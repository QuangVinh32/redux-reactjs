import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useForgotPasswordMutation } from "../../api/authApi";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getErrorMessage } from "../../utils/error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgot, { isLoading, error, isSuccess }] = useForgotPasswordMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await forgot({ email }).unwrap(); } catch { /* shown below */ }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-extrabold text-gray-800">Quên mật khẩu</h1>
      <p className="mt-1 text-sm text-gray-500">
        Nhập email để nhận link đặt lại mật khẩu
      </p>

      {isSuccess ? (
        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✅ Nếu email tồn tại, link đặt lại đã được gửi. Vui lòng kiểm tra hộp thư.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            icon={<Mail size={16} />}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {getErrorMessage(error)}
            </div>
          )}
          <Button type="submit" full loading={isLoading}>
            Gửi link đặt lại
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="text-rose-500 hover:underline">
          ← Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
