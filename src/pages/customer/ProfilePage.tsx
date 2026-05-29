import { useState, useEffect } from "react";
import { Camera, Lock, User } from "lucide-react";
import { useMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from "../../api/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import { setUser } from "../../redux/slices/authSlice";
import { showToast } from "../../redux/slices/uiSlice";
import { FullPageSpinner } from "../../components/common/Spinner";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const { data: me, isLoading } = useMeQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();

  const [form, setForm] = useState({ fullName: "", phone: "", address: "" });
  const [pwForm, setPwForm] = useState({ old: "", new1: "", new2: "" });

  useEffect(() => {
    if (me) setForm({ fullName: me.fullName ?? "", phone: me.phone ?? "", address: me.address ?? "" });
  }, [me]);

  if (isLoading || !me) return <FullPageSpinner />;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({ userId: me.userId, body: form }).unwrap();
      dispatch(
        setUser({
          userId: updated.userId,
          username: updated.username,
          fullName: updated.fullName,
          email: updated.email,
          role: updated.role,
          image: updated.image,
        })
      );
      dispatch(showToast({ message: "Đã lưu thông tin", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  const onChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new1 !== pwForm.new2) {
      dispatch(showToast({ message: "Mật khẩu mới không khớp", kind: "error" }));
      return;
    }
    try {
      await changePassword({ oldPassword: pwForm.old, newPassword: pwForm.new1 }).unwrap();
      dispatch(showToast({ message: "Đổi mật khẩu thành công", kind: "success" }));
      setPwForm({ old: "", new1: "", new2: "" });
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-extrabold text-gray-800">Tài khoản</h1>

      <section className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-5 flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-rose-400 to-amber-400 text-white">
            {user?.image ? (
              <img src={user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-2xl font-bold">
                {user?.fullName?.[0] ?? "U"}
              </span>
            )}
            <button className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{me.fullName}</p>
            <p className="text-sm text-gray-500">@{me.username}</p>
          </div>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <Input label="Email" value={me.email} disabled icon={<User size={16} />} />
          <Input
            label="Họ tên"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <Input
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <div className="text-right">
            <Button type="submit" loading={saving}>Lưu thay đổi</Button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
          <Lock size={18} /> Đổi mật khẩu
        </h2>
        <form onSubmit={onChangePw} className="space-y-4">
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            value={pwForm.old}
            onChange={(e) => setPwForm({ ...pwForm, old: e.target.value })}
            required
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            value={pwForm.new1}
            onChange={(e) => setPwForm({ ...pwForm, new1: e.target.value })}
            hint="Tối thiểu 8 ký tự"
            required
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            value={pwForm.new2}
            onChange={(e) => setPwForm({ ...pwForm, new2: e.target.value })}
            required
          />
          <div className="text-right">
            <Button type="submit" variant="secondary" loading={changing}>
              Đổi mật khẩu
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
