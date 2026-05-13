type Color = {
  name: string;
  value: string;
  bg: string;
};

type Props = {
  colors: Color[];
  onChangeColor: (color: string) => void;
};

function ColorPicker({
  colors,
  onChangeColor,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">

      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() =>
            onChangeColor(color.value)
          }
          className={`bg-gradient-to-r ${color.bg} h-14 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg`}
        >
          {color.name}
        </button>
      ))}

    </div>
  );
}

export default ColorPicker;