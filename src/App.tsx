import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  increment,
  changeColor,
  changeFont,
  decrement,
  reset,
  changeSize,
} from "./redux/slices/CounterSlice";

import {
  colors,
  fonts,
  sizes,
} from "./constants/CounterData";
import CounterDisplay from "./component/CounterDisplay";
import CounterButtons from "./component/CounterButtons";
import ColorPicker from "./component/ColorPicker";
import FontPicker from "./component/FontPicker";
import Dashboard from "./pages/Dashboard";

type View = "counter" | "dashboard";

function App() {
  const [view, setView] = useState<View>("dashboard");

  if (view === "dashboard") {
    return (
      <div className="relative">
        <Dashboard />
        <button
          onClick={() => setView("counter")}
          className="fixed bottom-12 right-4 z-50 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-md shadow-lg"
        >
          → Counter
        </button>
      </div>
    );
  }

  return <CounterView onSwitch={() => setView("dashboard")} />;
}

function CounterView({ onSwitch }: { onSwitch: () => void }) {

  const count = useSelector(
    (state: any) => state.counter.value
  );

  const textColor = useSelector(
    (state: any) => state.counter.textColor
  );

  const fontFamily = useSelector(
    (state: any) => state.counter.fontFamily
  );

  const fontSize = useSelector(
    (state: any) => state.counter.fontSize
  );

  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-6 relative">

      <button
        onClick={onSwitch}
        className="fixed top-4 right-4 z-50 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-md shadow-lg"
      >
        → Dashboard
      </button>

      <div
        className="w-full max-w-2xl bg-white/70 backdrop-blur-sm rounded-[44px] p-7"
        style={{
          boxShadow:
            "18px 18px 50px rgba(199,210,254,0.55), -18px -18px 50px rgba(255,255,255,0.9)",
        }}
      >

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
            Redux Counter
          </h1>
          <p className="text-purple-400 text-xs mt-1 font-semibold">
            Tap • Play • Vibe
          </p>
        </div>

        {/* Counter display (inset) */}
        <div
          className="bg-white/80 rounded-[32px] p-6 mb-6 flex items-center justify-center min-h-[180px]"
          style={{
            boxShadow:
              "inset 8px 8px 18px rgba(199,210,254,0.55), inset -8px -8px 18px rgba(255,255,255,0.95)",
          }}
        >
          <CounterDisplay
            count={count}
            textColor={textColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        </div>

        {/* Buttons */}
        <div className="mb-7">
          <CounterButtons
            onIncrement={() => dispatch(increment())}
            onDecrement={() => dispatch(decrement())}
            onReset={() => dispatch(reset())}
          />
        </div>

        {/* Controls */}
        <div className="space-y-5">

          {/* Color */}
          <div>
            <p className="text-purple-500 text-xs font-bold uppercase tracking-widest text-center mb-3">
              🎨 Color
            </p>
            <ColorPicker
              colors={colors}
              onChangeColor={(color) => dispatch(changeColor(color))}
            />
          </div>

          {/* Size */}
          <div>
            <p className="text-purple-500 text-xs font-bold uppercase tracking-widest text-center mb-3">
              📏 Size
            </p>
            <div className="flex gap-3 justify-center">
              {sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => dispatch(changeSize(size.value))}
                  className="px-5 py-2.5 rounded-2xl bg-white text-purple-600 font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                  style={{
                    boxShadow:
                      "5px 5px 12px rgba(199,210,254,0.6), -3px -3px 8px rgba(255,255,255,0.95)",
                  }}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <p className="text-purple-500 text-xs font-bold uppercase tracking-widest text-center mb-3">
              ✍️ Font
            </p>
            <FontPicker
              fonts={fonts}
              onChangeFont={(font) => dispatch(changeFont(font))}
            />
          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
