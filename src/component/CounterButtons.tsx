import { Minus, Plus } from "lucide-react";

type Props = {
  onIncrement: () => void;
  onDecrement: () => void;
};

function CounterButtons({
  onIncrement,
  onDecrement,
}: Props) {
  return (
    <div className="flex justify-center gap-6 mt-10">

      <button
        onClick={onDecrement}
        className="group w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <Minus
          size={34}
          className="group-hover:rotate-12 transition-all"
        />
      </button>

      <button
        onClick={onIncrement}
        className="group w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <Plus
          size={34}
          className="group-hover:rotate-90 transition-all"
        />
      </button>

    </div>
  );
}

export default CounterButtons;