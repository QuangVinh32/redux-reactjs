type Props = {
  count: number;
  textColor: string;
  fontFamily: string;
  fontSize: string;
};

function CounterDisplay({
  count,
  textColor,
  fontFamily,
  fontSize,
}: Props) {

  return (
    <div
      style={{
        color: textColor,
        fontFamily,
        fontSize,
        textShadow: `0 0 30px ${textColor}`,
      }}
      className="font-black text-center leading-none transition-all duration-500"
    >
      {count}
    </div>
  );
}

export default CounterDisplay;