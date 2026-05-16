import type { Utility } from "../../constants/DashboardData";

interface UtilitiesPanelProps {
  utilities: Utility[];
  isOpen: boolean;
  onToggle: (id: string) => void;
  onClose: () => void;
}

function UtilitiesPanel({ utilities, isOpen, onToggle, onClose }: UtilitiesPanelProps) {
  return (
    <>
      {/* Backdrop overlay (mobile/tablet only) */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed xl:static inset-y-0 right-0 z-40
          w-72 max-w-[85vw] bg-white border-l border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          xl:translate-x-0
        `}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Tiện ích đang chạy</h3>
            <p className="text-[10px] text-gray-400">Kéo thả để sắp xếp thứ tự</p>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-md">
              + Thêm
            </button>
            <button
              onClick={onClose}
              className="xl:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md"
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {utilities.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 group"
            >
              <span className="text-gray-300 cursor-grab text-xs">⋮⋮</span>
              <div className={`w-5 h-5 rounded ${u.iconColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                {u.name.charAt(0)}
              </div>
              <span className="flex-1 text-xs text-gray-700">{u.name}</span>

              {/* Toggle switch */}
              <button
                onClick={() => onToggle(u.id)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                  u.enabled ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                    u.enabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>

              <button className="text-gray-300 hover:text-gray-500 text-xs opacity-0 group-hover:opacity-100">
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export default UtilitiesPanel;
