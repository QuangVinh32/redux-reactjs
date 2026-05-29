export default function Spinner({ size = 6 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-rose-200 border-t-rose-500"
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <Spinner />
    </div>
  );
}
