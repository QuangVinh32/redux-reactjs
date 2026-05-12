import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  changeColor,
  changeFont,
} from "./redux/slices/counterSlice";

function App() {
  const count = useSelector(
    (state: any) => state.counter.value
  );

  const textColor = useSelector(
    (state: any) => state.counter.textColor
  );

  const fontFamily = useSelector(
    (state: any) => state.counter.fontFamily
  );

  const dispatch = useDispatch();

  const colors = [
    { name: "Red", value: "#ff4d4d", bg: "bg-red-500" },
    { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
    { name: "Yellow", value: "#facc15", bg: "bg-yellow-400" },
    { name: "Green", value: "#22c55e", bg: "bg-green-500" },
    { name: "Pink", value: "#ec4899", bg: "bg-pink-500" },
      { name: "aqua", value: "#28a3e0", bg: "bg-cyan-500" },

  ];

  const fonts = [
    "Arial",
    // "Georgia",
    "Courier New",
    "cursive",
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b1020] relative flex items-center justify-center px-4 py-8">

      {/* Background glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[280px] h-[280px] bg-purple-600 rounded-full blur-[120px] opacity-40" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[280px] h-[280px] bg-cyan-500 rounded-full blur-[120px] opacity-30" />

      {/* Phone style card */}
      <div className="relative z-10 w-full max-w-[360px] rounded-[38px] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-6">

        {/* Top */}
        <div className="text-center mb-8">

          <div className="w-16 h-1.5 bg-white/20 rounded-full mx-auto mb-5" />

          <h1 className="text-white text-4xl font-black tracking-tight">
            Counter
          </h1>

          <p className="text-gray-300 text-sm mt-2 tracking-widest uppercase">
            Mobile UI
          </p>

        </div>

        {/* Counter */}
        <div
          style={{
            color: textColor,
            fontFamily: fontFamily,
            // textShadow: `0 0 25px ${textColor}`,
          }}
          className="text-[90px] sm:text-[110px] font-black text-center leading-none transition-all duration-500 mb-8"
        >
          {count}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-5 mb-10">

          <button
            onClick={() => dispatch(decrement())}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white text-4xl font-bold shadow-lg active:scale-90 hover:scale-105 transition-all"
          >
            -
          </button>

          <button
            onClick={() => dispatch(increment())}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white text-4xl font-bold shadow-lg active:scale-90 hover:scale-105 transition-all"
          >
            +
          </button>

        </div>

        {/* Color Section */}
        <div className="mb-8">

          <h2 className="text-white font-bold text-lg mb-4">
            Text Color
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() =>
                  dispatch(changeColor(color.value))
                }
                className={`${color.bg} py-3 rounded-2xl text-white font-bold shadow-lg active:scale-95 transition-all`}
              >
                {color.name}
              </button>
            ))}

          </div>

        </div>

        {/* Font Section */}
        <div>

          <h2 className="text-white font-bold text-lg mb-4">
            Font Style
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {fonts.map((font) => (
              <button
                key={font}
                onClick={() =>
                  dispatch(changeFont(font))
                }
                style={{
                  fontFamily: font,
                }}
                className="bg-white/10 border border-white/10 py-3 rounded-2xl text-white active:scale-95 hover:bg-white/20 transition-all"
              >
                {font}
              </button>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;