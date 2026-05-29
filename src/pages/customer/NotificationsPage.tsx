import { Bell, Check, Trash2 } from "lucide-react";
import {
  useMyNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} from "../../api/miscApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Empty from "../../components/common/Empty";
import Button from "../../components/common/Button";
import { formatDate } from "../../utils/format";

export default function NotificationsPage() {
  const { data, isLoading } = useMyNotificationsQuery();
  const [markRead] = useMarkReadMutation();
  const [markAll, { isLoading: markingAll }] = useMarkAllReadMutation();
  const [del] = useDeleteNotificationMutation();

  if (isLoading) return <FullPageSpinner />;
  const hasUnread = data?.some((n) => n.status === "UNREAD");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-800">Thông báo</h1>
        {hasUnread && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAll()}
            loading={markingAll}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {!data || data.length === 0 ? (
        <Empty icon="🔔" title="Chưa có thông báo nào" />
      ) : (
        <div className="space-y-2">
          {data.map((n) => (
            <div
              key={n.notificationId}
              className={`flex gap-3 rounded-xl border p-4 transition ${
                n.status === "UNREAD"
                  ? "border-rose-200 bg-rose-50/40"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <Bell size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{n.description}</p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
              </div>
              <div className="flex flex-col gap-1">
                {n.status === "UNREAD" && (
                  <button
                    onClick={() => markRead(n.notificationId)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-500"
                    aria-label="Đánh dấu đã đọc"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={() => del(n.notificationId)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500"
                  aria-label="Xóa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
