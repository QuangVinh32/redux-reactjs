import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import { clearToast } from "../../redux/slices/uiSlice";

export default function Toast() {
  const toast = useAppSelector((s) => s.ui.toast);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), 2800);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;
  const color =
    toast.kind === "success"
      ? "bg-emerald-500"
      : toast.kind === "error"
      ? "bg-rose-500"
      : "bg-gray-800";
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
      <div className={`pointer-events-auto rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg ${color}`}>
        {toast.message}
      </div>
    </div>
  );
}
