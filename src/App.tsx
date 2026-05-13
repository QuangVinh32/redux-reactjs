import { useSelector, useDispatch } from "react-redux";

import {
  Palette,
  Sparkles,
  Type,
} from "lucide-react";

import CounterDisplay from "./component/CounterDisplay";
import CounterButtons from "./component/CounterButtons";
import ColorPicker from "./component/ColorPicker";
import FontPicker from "./component/FontPicker";

import {
  increment,
  changeColor,
  changeFont,
  decrement,
  changeSize,
} from "./redux/slices/CounterSlice";

import {
  colors,
  fonts,
  sizes,
} from "./constants/CounterData";

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

  const fontSize = useSelector(
    (state: any) => state.counter.fontSize

  );

  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#060816] relative overflow-hidden">

      {/* Background */}
      
      {/* Main */}
      <div className="relative z-10 max-w-4xl mx-auto  scale-[0.9] origin-top">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">

          {/* Left */}
          <div className="text-center lg:text-left">

            <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">

              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/10 flex items-center justify-center">

                <Sparkles
                  className="text-cyan-400"
                  size={20}
                />

              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Redux Counter
              </h1>

            </div>

            <p className="text-gray-400 text-sm">
              Modern React + Redux Toolkit +
              Tailwind CSS UI
            </p>

          </div>

          {/* Right */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-2xl px-5 py-4 rounded-[26px] shadow-2xl">

            <p className="text-gray-400 text-xs mb-1">
              Current Font
            </p>

            <h2
              style={{ fontFamily }}
              className="text-white text-xl font-bold"
            >
              {fontFamily}
            </h2>

          </div>

        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left */}
          <div className="lg:col-span-2 bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[30px] p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

            {/* Top */}
            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-white text-xl font-bold">
                  Counter Value
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Interactive Redux State
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">

                <Sparkles
                  className="text-cyan-400"
                  size={18}
                />

              </div>

            </div>

            {/* Counter */}
          <CounterDisplay
            count={count}
            textColor={textColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />

            {/* Buttons */}
            <CounterButtons
              onIncrement={() =>
                dispatch(increment())
              }
              onDecrement={() =>
                dispatch(decrement())
              }
            />

          </div>

          {/* Right */}
          <div className="space-y-5">

            {/* Colors */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[26px] p-5 shadow-2xl">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center">

                  <Palette
                    className="text-pink-400"
                    size={18}
                  />

                </div>

                <h2 className="text-white text-lg font-bold">
                  Text Colors
                </h2>

              </div>

              <ColorPicker
                colors={colors}
                onChangeColor={(color) =>
                  dispatch(changeColor(color))
                }
              />

            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[26px] p-5 shadow-2xl">

  <h2 className="text-white text-lg font-bold mb-5">
    Text Size
  </h2>

  <div className="grid grid-cols-3 gap-3">

    {sizes.map((size) => (
      <button
        key={size.name}
        onClick={() =>
          dispatch(changeSize(size.value))
        }
        className="bg-white/10 border border-white/10 py-3 rounded-xl text-white text-sm hover:bg-white/20 transition-all"
      >
        {size.name}
      </button>
    ))}

  </div>

</div>

            {/* Fonts */}
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[26px] p-5 shadow-2xl">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center">

                  <Type
                    className="text-cyan-400"
                    size={18}
                  />

                </div>

                <h2 className="text-white text-lg font-bold">
                  Font Style
                </h2>

              </div>

              <FontPicker
                fonts={fonts}
                onChangeFont={(font) =>
                  dispatch(changeFont(font))
                }
              />

            </div>
            

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;