interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSidebar: () => void;
  onOpenUtils: () => void;
}

function TopBar({ searchQuery, onSearchChange, onOpenSidebar, onOpenUtils }: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-2 sm:px-4 gap-2 sm:gap-3">
      {/* Hamburger (mobile/tablet) */}
      <button
        onClick={onOpenSidebar}
        className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md flex-shrink-0"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Bắt đầu button */}
      <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-md transition flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-white" />
        <span className="hidden sm:inline">Bắt đầu</span>
      </button>

      {/* Icon buttons - hidden on small */}
      <button className="hidden md:flex w-8 h-8 items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M6 12h12M10 18h4" />
        </svg>
      </button>
      <button className="hidden md:flex w-8 h-8 items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
      <button className="hidden md:flex w-8 h-8 items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l3 3" />
        </svg>
      </button>

      {/* Search */}
      <div className="flex-1 min-w-0 max-w-md relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm BM..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      <div className="hidden md:block flex-1" />

      {/* Mix dropdown */}
      <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
        Mix
        <span className="text-gray-400 text-xs">▾</span>
      </button>

      {/* Notification icons */}
      <button className="hidden lg:flex w-8 h-8 items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      </button>
      <button className="hidden lg:flex w-8 h-8 items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
      <button className="hidden lg:flex w-8 h-8 items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12H3M21 6H3M21 18H3" />
        </svg>
      </button>

      {/* Tạo BM */}
      <button className="hidden md:flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md flex-shrink-0">
        + Tạo BM
      </button>

      {/* Nhận link BM */}
      <button className="hidden xl:flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-sm text-gray-700 font-medium px-3 py-1.5 rounded-md flex-shrink-0">
        🔗 Nhận link BM
      </button>

      {/* User profile */}
      <div className="hidden sm:flex items-center gap-2 pl-2 sm:pl-3 sm:border-l border-gray-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
          TĐ
        </div>
        <div className="hidden lg:block text-right leading-tight">
          <p className="text-xs font-semibold text-gray-800">Trần Đình Hòa</p>
          <p className="text-[10px] text-gray-400">UID: 100008466921900</p>
        </div>
      </div>

      {/* Utilities drawer toggle (mobile/tablet) */}
      <button
        onClick={onOpenUtils}
        className="xl:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md flex-shrink-0"
        aria-label="Tiện ích"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
    </header>
  );
}

export default TopBar;
