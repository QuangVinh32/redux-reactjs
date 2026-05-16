import { Minus, Plus, RotateCcw } from "lucide-react";

type Props = {
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
};

function CounterButtons({
  onIncrement,
  onDecrement,
  onReset,
}: Props) {
  return (
    <div className="flex justify-center items-center gap-6">

      <button
        onClick={onDecrement}
        className="group w-20 h-20 rounded-[28px] bg-gradient-to-br from-pink-300 to-rose-400 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
        style={{
          boxShadow:
            "10px 10px 24px rgba(244,114,182,0.45), -6px -6px 14px rgba(255,255,255,0.85)",
        }}
      >
        <Minus
          size={36}
          strokeWidth={3.5}
          className="group-hover:-rotate-12 transition-transform drop-shadow-md"
        />
      </button>

      <button
        onClick={onReset}
        className="group w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
        style={{
          boxShadow:
            "6px 6px 16px rgba(251,146,60,0.4), -4px -4px 10px rgba(255,255,255,0.85)",
        }}
        title="Reset"
      >
        <RotateCcw
          size={22}
          strokeWidth={3}
          className="group-hover:-rotate-180 transition-transform duration-500 drop-shadow-md"
        />
      </button>

      <button
        onClick={onIncrement}
        className="group w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-300 to-teal-400 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
        style={{
          boxShadow:
            "10px 10px 24px rgba(45,212,191,0.45), -6px -6px 14px rgba(255,255,255,0.85)",
        }}
      >
        <Plus
          size={36}
          strokeWidth={3.5}
          className="group-hover:rotate-90 transition-transform drop-shadow-md"
        />
      </button>

    </div>
  );
}

export default CounterButtons;
