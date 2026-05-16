import type { MenuSection } from "../../constants/DashboardData";

interface SidebarProps {
  sections: MenuSection[];
  activeMenu: string;
  isOpen: boolean;
  onSelectMenu: (id: string) => void;
  onClose: () => void;
}

function Sidebar({ sections, activeMenu, isOpen, onSelectMenu, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop overlay (mobile only) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-56 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo bar */}
        <div className="h-14 flex items-center gap-1 px-3 border-b border-gray-200">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
          <div className="w-7 h-7 rounded bg-gray-200" />
          <div className="w-7 h-7 rounded bg-gray-800" />
          {/* Close button mobile */}
          <button
            onClick={onClose}
            className="lg:hidden ml-auto w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-3">
          {sections.map((section) => (
            <div key={section.id} className="mb-4 px-3">
              <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 px-2">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activeMenu === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onSelectMenu(item.id);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm transition ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center text-xs">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse menu */}
        <div className="px-3 py-2 border-t border-gray-200">
          <button className="w-full flex items-center gap-2 px-2 py-2 text-xs text-gray-500 hover:bg-gray-50 rounded-md">
            <span>«</span> Thu gọn menu
          </button>
        </div>

        {/* User footer */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-xs font-bold">
            DL
          </div>
          <span className="text-sm font-medium text-gray-700">Đính Lúa</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
