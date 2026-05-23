import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTheme,
  setCompactMode,
  setNotifications,
  setSound,
  setDecorations,
  setFontScale,
  setCurrency,
  setLanguage,
  resetSettings,
  syncSettingsThunk,
  type Theme,
} from "../../redux/slices/ShopSlice";
import type { AppDispatch } from "../../redux/Store";
import { tokenStorage } from "../../api/client";

const themeOptions: {
  value: Theme;
  label: string;
  icon: string;
  preview: string;
  desc: string;
}[] = [
  {
    value: "light",
    label: "Sáng",
    icon: "☀️",
    preview: "bg-gradient-to-br from-slate-50 to-white border-slate-300",
    desc: "Giao diện sáng mặc định",
  },
  {
    value: "dark",
    label: "Tối",
    icon: "🌙",
    preview: "bg-gradient-to-br from-slate-800 to-slate-950 border-slate-700",
    desc: "Giao diện tối, dễ nhìn buổi đêm",
  },
  {
    value: "tet",
    label: "Tết",
    icon: "🧧",
    preview: "bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 border-red-400",
    desc: "Đỏ + vàng, lì xì + hoa mai",
  },
  {
    value: "christmas",
    label: "Giáng Sinh",
    icon: "🎄",
    preview: "bg-gradient-to-br from-red-700 via-emerald-700 to-red-600 border-emerald-500",
    desc: "Đỏ + xanh + tuyết rơi",
  },
  {
    value: "halloween",
    label: "Halloween",
    icon: "🎃",
    preview: "bg-gradient-to-br from-orange-600 via-purple-900 to-black border-orange-500",
    desc: "Cam + tím + bí ngô, ma quái",
  },
];

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const s = useSelector((st: any) => st.shop);
  const first = useRef(true);

  // Đồng bộ về backend mỗi khi setting đổi (skip lần mount đầu)
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!tokenStorage.getAccess()) return;
    const handle = setTimeout(() => {
      dispatch(syncSettingsThunk({
        theme: s.theme, language: s.language, currency: s.currency,
        fontScale: s.fontScale, compactMode: s.compactMode,
        enableNotifications: s.enableNotifications,
        enableSound: s.enableSound, enableDecorations: s.enableDecorations,
      }));
    }, 400);
    return () => clearTimeout(handle);
  }, [dispatch, s.theme, s.language, s.currency, s.fontScale,
      s.compactMode, s.enableNotifications, s.enableSound, s.enableDecorations]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          ⚙️ Cài Đặt
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tuỳ chỉnh giao diện, ngôn ngữ, thông báo. Lưu tự động vào trình duyệt.
        </p>
      </div>

      {/* THEME */}
      <Section title="🎨 Giao diện" description="Chọn theme phù hợp với bạn hoặc theo mùa lễ hội">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => dispatch(setTheme(opt.value))}
              className={`group relative rounded-xl border-2 p-3 text-left transition-all ${
                s.theme === opt.value
                  ? "border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900"
                  : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
              }`}
            >
              <div className={`h-16 rounded-lg border ${opt.preview} mb-2 flex items-center justify-center text-3xl shadow-inner`}>
                {opt.icon}
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center justify-between">
                {opt.label}
                {s.theme === opt.value && (
                  <span className="text-emerald-500 text-xs">✓</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {opt.desc}
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* DECORATIONS */}
      <Section
        title="✨ Trang trí theo mùa"
        description="Hiện banner + emoji rơi khi đang ở theme Tết/Giáng sinh/Halloween"
      >
        <Toggle
          checked={s.enableDecorations}
          onChange={(v) => dispatch(setDecorations(v))}
          label="Bật trang trí theo mùa"
          desc="Tắt nếu thấy emoji rơi gây xao nhãng"
        />
      </Section>

      {/* DISPLAY */}
      <Section title="📺 Hiển thị" description="Cỡ chữ + chế độ compact">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Cỡ chữ
            </div>
            <div className="flex gap-2">
              {(["sm", "md", "lg"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => dispatch(setFontScale(size))}
                  className={`flex-1 py-3 rounded-lg border-2 font-bold transition-colors ${
                    s.fontScale === size
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div
                    className={
                      size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
                    }
                  >
                    {size === "sm" ? "Nhỏ" : size === "md" ? "Vừa" : "Lớn"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Toggle
            checked={s.compactMode}
            onChange={(v) => dispatch(setCompactMode(v))}
            label="Chế độ compact"
            desc="Giảm khoảng cách, hiển thị nhiều thông tin hơn"
          />
        </div>
      </Section>

      {/* LANG / CURRENCY */}
      <Section title="🌐 Ngôn ngữ & Tiền tệ">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Ngôn ngữ
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(setLanguage("vi"))}
                className={`flex-1 h-11 rounded-lg border-2 font-semibold ${
                  s.language === "vi"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => dispatch(setLanguage("en"))}
                className={`flex-1 h-11 rounded-lg border-2 font-semibold ${
                  s.language === "en"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Tiền tệ
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(setCurrency("VND"))}
                className={`flex-1 h-11 rounded-lg border-2 font-semibold ${
                  s.currency === "VND"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                VND
              </button>
              <button
                onClick={() => dispatch(setCurrency("USD"))}
                className={`flex-1 h-11 rounded-lg border-2 font-semibold ${
                  s.currency === "USD"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                USD
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* NOTIFICATIONS */}
      <Section title="🔔 Thông báo">
        <div className="space-y-3">
          <Toggle
            checked={s.enableNotifications}
            onChange={(v) => dispatch(setNotifications(v))}
            label="Bật thông báo đẩy"
            desc="Nhận thông báo khi có đơn hàng, khuyến mãi"
          />
          <Toggle
            checked={s.enableSound}
            onChange={(v) => dispatch(setSound(v))}
            label="Bật âm thanh"
            desc="Phát âm thanh khi có thông báo mới"
          />
        </div>
      </Section>

      {/* RESET */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="font-bold text-rose-700 dark:text-rose-300">
            ⚠️ Khôi phục cài đặt mặc định
          </div>
          <div className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            Đưa tất cả cài đặt về giá trị ban đầu (sáng, tiếng Việt, VND...)
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm("Khôi phục tất cả cài đặt về mặc định?")) {
              dispatch(resetSettings());
            }
          }}
          className="px-5 h-10 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold whitespace-nowrap"
        >
          Khôi phục
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-5">
      <h2 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h2>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
          {description}
        </p>
      )}
      {!description && <div className="mb-4" />}
      {children}
    </section>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </div>
        {desc && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {desc}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          checked ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
