import { Trash2 } from "lucide-react";
import { useListUsersQuery, useDeleteUserMutation } from "../../api/miscApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";

const roleColor = {
  USER: "bg-gray-100 text-gray-700",
  MANAGER: "bg-amber-100 text-amber-700",
  ADMIN: "bg-rose-100 text-rose-700",
};

export default function UsersPage() {
  const { data, isLoading } = useListUsersQuery();
  const [del] = useDeleteUserMutation();
  const dispatch = useAppDispatch();

  const onDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa user "${name}"?`)) return;
    try {
      await del(id).unwrap();
      dispatch(showToast({ message: "Đã xóa", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="mb-5 text-xl font-extrabold text-gray-800">Người dùng ({data?.length ?? 0})</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {data?.map((u) => (
              <tr key={u.userId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-400 to-amber-400 text-white">
                      {u.image ? (
                        <img src={u.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold">{u.fullName?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{u.fullName}</p>
                      <p className="text-xs text-gray-400">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-600">{u.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${roleColor[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => onDelete(u.userId, u.fullName)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
