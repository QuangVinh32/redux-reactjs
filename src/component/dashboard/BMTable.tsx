import type { BM } from "../../constants/DashboardData";

interface BMTableProps {
  bms: BM[];
  selectedIds: string[];
  activeRowId: string | null;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectRow: (id: string) => void;
}

const columns: { key: string; label: string; width?: string; sortable?: boolean }[] = [
  { key: "status", label: "Trạng thái", width: "w-24", sortable: true },
  { key: "account", label: "Tài khoản", width: "w-44", sortable: true },
  { key: "bmId", label: "ID BM", width: "w-36", sortable: true },
  { key: "bmType", label: "Loại BM", width: "w-20" },
  { key: "createdAt", label: "Ngày tạo BM", width: "w-28" },
  { key: "permission", label: "Quyền", width: "w-32" },
  { key: "bm", label: "BM", width: "w-16" },
  { key: "accountBM", label: "Account BM", width: "w-28", sortable: true },
  { key: "accountShare", label: "Account Share", width: "w-28" },
  { key: "doiTac", label: "Đổi tịc", width: "w-20" },
  { key: "progress", label: "Tiến trình", width: "w-24" },
];

function BMTable({ bms, selectedIds, activeRowId, onToggleSelect, onToggleSelectAll, onSelectRow }: BMTableProps) {
  const allSelected = bms.length > 0 && selectedIds.length === bms.length;

  return (
    <div className="flex-1 overflow-auto bg-white">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
          <tr className="text-left text-gray-500">
            <th className="w-10 px-3 py-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-gray-300"
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className={`${col.width ?? ""} px-2 py-2 font-medium`}>
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && <span className="text-gray-400">▾</span>}
                </div>
              </th>
            ))}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {bms.map((bm) => {
            const isSelected = selectedIds.includes(bm.id);
            const isActive = activeRowId === bm.id;
            return (
              <tr
                key={bm.id}
                onClick={() => onSelectRow(bm.id)}
                className={`border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer ${
                  isActive ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(bm.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-2 py-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {bm.status}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${bm.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {bm.avatarLetter}
                    </div>
                    <div className="leading-tight">
                      <p className="font-semibold text-gray-800">{bm.accountName}</p>
                      <p className="text-[10px] text-gray-400">{bm.accountSubId}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-2 py-2 font-mono text-gray-700 ${isActive ? "ring-1 ring-blue-400 ring-inset" : ""}`}>
                  {bm.bmId}
                </td>
                <td className="px-2 py-2 text-gray-600">{bm.bmType}</td>
                <td className="px-2 py-2 text-gray-600">{bm.createdAt}</td>
                <td className="px-2 py-2 text-gray-600">{bm.permission}</td>
                <td className="px-2 py-2 text-gray-600">{bm.bm}</td>
                <td className="px-2 py-2 text-gray-600">{bm.accountBM}</td>
                <td className="px-2 py-2 text-gray-600">{bm.accountShare}</td>
                <td className="px-2 py-2 text-gray-600">{bm.doiTac}</td>
                <td className="px-2 py-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {bm.progress}
                  </span>
                </td>
                <td className="px-2 py-2 text-gray-400">
                  <button className="hover:text-gray-600">⋯</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BMTable;
