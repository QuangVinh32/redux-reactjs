type Props = {
  fonts: string[];
  onChangeFont: (font: string) => void;
};

function FontPicker({
  fonts,
  onChangeFont,
}: Props) {
  return (
    <div className="space-y-4">

      {fonts.map((font) => (
        <button
          key={font}
          onClick={() =>
            onChangeFont(font)
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
  );
}

export default FontPicker;