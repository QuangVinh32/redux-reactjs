import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../api/authApi";
import { FullPageSpinner } from "../../components/common/Spinner";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [verify, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();

  useEffect(() => {
    if (token) verify({ token });
  }, [token, verify]);

  if (!token) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
        <p className="text-sm text-red-600">Link xác thực không hợp lệ.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
      {isLoading && <FullPageSpinner />}
      {isSuccess && (
        <>
          <div className="text-5xl">✅</div>
          <h2 className="mt-3 text-xl font-bold text-gray-800">
            Xác thực email thành công
          </h2>
          <p className="mt-1 text-sm text-gray-500">Bạn có thể đăng nhập ngay bây giờ.</p>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-lg bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Đến trang đăng nhập
          </Link>
        </>
      )}
      {isError && (
        <>
          <div className="text-5xl">❌</div>
          <h2 className="mt-3 text-xl font-bold text-gray-800">Xác thực thất bại</h2>
          <p className="mt-1 text-sm text-red-500">
            {(error as { data?: { message?: string } })?.data?.message ??
              "Token đã hết hạn hoặc không hợp lệ."}
          </p>
        </>
      )}
    </div>
  );
}
