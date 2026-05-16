interface BottomBarProps {
  total: number;
  selected: number;
  region: number;
}

function BottomBar({ total, selected, region }: BottomBarProps) {
  return (
    <footer className="h-9 bg-white border-t border-gray-200 flex items-center px-4 text-xs text-gray-600">
      <div className="flex items-center gap-4">
        <span>
          TỔNG: <span className="font-semibold text-gray-800">{total}</span>
        </span>
        <span>
          CHỌN: <span className="font-semibold text-gray-800">{selected}</span>
        </span>
        <span>
          VÙNG: <span className="font-semibold text-gray-800">{region}</span>
        </span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Live</span>
        <button className="relative w-9 h-5 rounded-full bg-blue-500">
          <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4 transition-transform duration-200" />
        </button>
      </div>
    </footer>
  );
}

export default BottomBar;
