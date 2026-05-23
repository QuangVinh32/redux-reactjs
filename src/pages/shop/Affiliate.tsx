export default function Affiliate() {
 return (
 <div className="max-w-7xl mx-auto px-4 py-6">
 <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 md:p-12 text-white text-center mb-8">
 <div className="text-6xl mb-3">💰</div>
 <h1 className="text-4xl md:text-5xl font-black mb-3">
 Affiliate Program
 </h1>
 <p className="text-lg text-amber-50 max-w-2xl mx-auto">
 Giới thiệu bạn bè – Nhận hoa hồng <b className="text-white">15%</b> mỗi đơn hàng
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-5 mb-8">
 {[
 {
 icon:"🔗",
 title:"Lấy link affiliate",
 desc:"Mỗi user có link riêng để chia sẻ",
 },
 {
 icon:"👥",
 title:"Chia sẻ bạn bè",
 desc:"Đăng Facebook, Telegram, Zalo...",
 },
 {
 icon:"💵",
 title:"Nhận hoa hồng",
 desc:"Tự động cộng vào ví, rút bất kỳ lúc nào",
 },
 ].map((step, i) => (
 <div
 key={step.title}
 className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center"
 >
 <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-2xl shadow-lg">
 {step.icon}
 </div>
 <div className="text-xs font-bold text-amber-600 mb-1">
 BƯỚC {i + 1}
 </div>
 <h3 className="font-black text-slate-800 dark:text-slate-100 mb-1">{step.title}</h3>
 <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
 </div>
 ))}
 </div>

 <div className="grid lg:grid-cols-2 gap-5">
 <div className="bg-white border border-slate-200 p-6">
 <h2 className="font-black text-slate-800 dark:text-slate-100 mb-4">🔗 Link giới thiệu của bạn</h2>
 <div className="flex gap-2">
 <input
 readOnly
 value="https://shopbm.demo/ref/demo_user"
 className="flex-1 h-11 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-mono"
 />
 <button className="px-5 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm">
 📋 Copy
 </button>
 </div>
 <div className="mt-4 grid grid-cols-3 gap-3">
 {[
 { label:"Tổng clicks", value:"1,284", color:"blue" },
 { label:"Đăng ký", value:"47", color:"emerald" },
 { label:"Hoa hồng", value:"1.2tr", color:"amber" },
 ].map((s) => (
 <div key={s.label} className="bg-slate-50 dark:bg-slate-800 p-3 text-center">
 <div className={`text-xl font-black text-${s.color}-600 dark:text-${s.color}-400`}>
 {s.value}
 </div>
 <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-slate-900 text-white p-6">
 <h2 className="font-black mb-4">📊 Cấp bậc Affiliate</h2>
 <div className="space-y-3">
 {[
 { level:"Bronze", rate:"5%", req:"0 – 5 triệu", color:"amber" },
 { level:"Silver", rate:"8%", req:"5 – 20 triệu", color:"slate" },
 { level:"Gold", rate:"12%", req:"20 – 50 triệu", color:"yellow" },
 { level:"Diamond", rate:"15%", req:"Trên 50 triệu", color:"cyan" },
 ].map((tier) => (
 <div
 key={tier.level}
 className="flex items-center justify-between bg-slate-800 px-4 py-3"
 >
 <div>
 <div className={`font-bold text-${tier.color}-400`}>
 💎 {tier.level}
 </div>
 <div className="text-xs text-slate-400">{tier.req}</div>
 </div>
 <div className="text-2xl font-black text-emerald-400">
 {tier.rate}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}
