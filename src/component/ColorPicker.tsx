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
    <div className="flex gap-3 justify-center flex-wrap">

      {colors.map((color) => (
        <button
          key={color.name}
          title={color.name}
          onClick={() => onChangeColor(color.value)}
          style={{
            backgroundColor: color.value,
            boxShadow: `6px 6px 14px ${color.value}55, -3px -3px 8px rgba(255,255,255,0.85)`,
          }}
          className="w-11 h-11 rounded-2xl hover:scale-115 active:scale-90 transition-all duration-200"
        />
      ))}

    </div>
  );
}

export default ColorPicker;
