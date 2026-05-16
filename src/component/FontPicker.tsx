type Props = {
  fonts: string[];
  onChangeFont: (font: string) => void;
};

function FontPicker({
  fonts,
  onChangeFont,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">

      {fonts.map((font) => (
        <button
          key={font}
          onClick={() => onChangeFont(font)}
          style={{
            fontFamily: font,
            boxShadow:
              "5px 5px 12px rgba(199,210,254,0.6), -3px -3px 8px rgba(255,255,255,0.95)",
          }}
          className="py-3 rounded-2xl bg-white text-purple-600 font-bold text-base hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {font}
        </button>
      ))}

    </div>
  );
}

export default FontPicker;
