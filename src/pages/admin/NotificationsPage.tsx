import { useState } from "react";
import { Bell, Send } from "lucide-react";
import {
  useAdminListNotificationsQuery,
  useCreateMassNotificationMutation,
} from "../../api/miscApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { formatDate } from "../../utils/format";
import type { NotificationType } from "../../types/backend";

export default function NotificationsPage() {
  const { data, isLoading } = useAdminListNotificationsQuery();
  const [send, { isLoading: sending }] = useCreateMassNotificationMutation();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    redirectUrl: "",
    notificationType: "ALL" as NotificationType,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await send(form).unwrap();
      dispatch(showToast({ message: "Đã gửi thông báo", kind: "success" }));
      setForm({ title: "", description: "", redirectUrl: "", notificationType: "ALL" });
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <section>
        <h1 className="mb-5 text-xl font-extrabold text-gray-800">Lịch sử thông báo</h1>
        <div className="space-y-2">
          {data?.map((n) => (
            <div key={n.notificationId} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <Bell size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">{n.title}</p>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
                    {n.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{n.description}</p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
          {(!data || data.length === 0) && (
            <p className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
              Chưa có thông báo nào
            </p>
          )}
        </div>
      </section>

      <aside>
        <h2 className="mb-5 text-xl font-extrabold text-gray-800">Soạn mới</h2>
        <form onSubmit={onSubmit} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <Input
            label="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Nội dung</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              required
            />
          </label>
          <Input
            label="Link redirect"
            value={form.redirectUrl}
            onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
            placeholder="/promotion/june"
          />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Loại thông báo</span>
            <select
              value={form.notificationType}
              onChange={(e) => setForm({ ...form, notificationType: e.target.value as NotificationType })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Tất cả người dùng (ALL)</option>
              <option value="PUBLIC">Công khai (PUBLIC)</option>
              <option value="PRIVATE">Riêng tư (PRIVATE)</option>
            </select>
          </label>
          <Button type="submit" full loading={sending} icon={<Send size={14} />}>
            Gửi thông báo
          </Button>
        </form>
      </aside>
    </div>
  );
}
