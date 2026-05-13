import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  changeColor,
  changeFont,
} from "./redux/slices/counterSlice";
import {
  Minus,
  Plus,
  Palette,
  Type,
  Sparkles,
} from "lucide-react";

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
    { name: "Red", value: "#ff4d4d", bg: "from-red-500 to-pink-500" },
    { name: "Blue", value: "#3b82f6", bg: "from-blue-500 to-cyan-500" },
    { name: "Yellow", value: "#facc15", bg: "from-yellow-400 to-orange-500" },
    { name: "Green", value: "#22c55e", bg: "from-green-400 to-emerald-600" },
    { name: "Pink", value: "#ec4899", bg: "from-pink-500 to-rose-500" },
    { name: "Aqua", value: "#28a3e0", bg: "from-cyan-400 to-sky-500" },
  ];

  const fonts = [
    "Arial",
    "Courier New",
    "cursive",
    "Verdana",
  ];

  return (
    <div className="min-h-screen bg-[#060816] relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-[-150px] left-[-100px] w-[350px] h-[350px] bg-cyan-500/30 rounded-full blur-[140px]" />

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-purple-600/30 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">

          <div>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-cyan-400" size={30} />
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Redux Counter UI
              </h1>
            </div>

            <p className="text-gray-400 text-lg">
              Modern React + Redux + Tailwind Dashboard
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-2xl">
            <p className="text-gray-400 text-sm mb-1">
              Current Font
            </p>

            <h2
              style={{ fontFamily }}
              className="text-white text-2xl font-bold"
            >
              {fontFamily}
            </h2>
          </div>

        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Counter Card */}
          <div className="lg:col-span-2 bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

            <div className="flex items-center justify-between mb-10">

              <div>
                <h2 className="text-white text-2xl font-bold">
                  Counter Value
                </h2>

                <p className="text-gray-400 mt-1">
                  Interactive Redux State
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                <Sparkles className="text-cyan-400" />
              </div>

            </div>

            {/* Counter */}
            <div
              style={{
                color: textColor,
                fontFamily: fontFamily,
                textShadow: `0 0 30px ${textColor}`,
              }}
              className="text-[110px] md:text-[160px] font-black text-center leading-none transition-all duration-500"
            >
              {count}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-10">

              <button
                onClick={() => dispatch(decrement())}
                className="group w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <Minus
                  size={34}
                  className="group-hover:rotate-12 transition-all"
                />
              </button>

              <button
                onClick={() => dispatch(increment())}
                className="group w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <Plus
                  size={34}
                  className="group-hover:rotate-90 transition-all"
                />
              </button>

            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Color Picker */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 shadow-2xl">

              <div className="flex items-center gap-3 mb-6">
                <Palette className="text-pink-400" />
                <h2 className="text-white text-xl font-bold">
                  Text Colors
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">

                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() =>
                      dispatch(changeColor(color.value))
                    }
                    className={`bg-gradient-to-r ${color.bg} h-14 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg`}
                  >
                    {color.name}
                  </button>
                ))}

              </div>

            </div>

            {/* Font Picker */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 shadow-2xl">

              <div className="flex items-center gap-3 mb-6">
                <Type className="text-cyan-400" />
                <h2 className="text-white text-xl font-bold">
                  Font Style
                </h2>
              </div>

              <div className="space-y-4">

                {fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() =>
                      dispatch(changeFont(font))
                    }
                    style={{
                      fontFamily: font,
                    }}
                    className="w-full bg-white/10 border border-white/10 py-4 rounded-2xl text-white text-lg hover:bg-white/20 hover:translate-x-1 active:scale-95 transition-all"
                  >
                    {font}
                  </button>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;