type Props = {
 title: string;
 icon: string;
 description: string;
};

export default function SimplePage({ title, icon, description }: Props) {
 return (
 <div className="max-w-7xl mx-auto px-4 py-12 text-center">
 <div className="text-7xl mb-4">{icon}</div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">{title}</h1>
 <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-6">{description}</p>

 <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4 mt-10 text-left">
 {Array.from({ length: 4 }).map((_, i) => (
 <div
 key={i}
 className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-emerald-400 hover:shadow-md transition-all"
 >
 <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
 MỤC {i + 1}
 </div>
 <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
 Tiêu đề mẫu số {i + 1}
 </h3>
 <p className="text-sm text-slate-500 dark:text-slate-400">
 Nội dung trang"{title}" sẽ được cập nhật. Đây là khung UI mẫu
 để bạn dễ điền dữ liệu thật vào sau.
 </p>
 </div>
 ))}
 </div>
 </div>
 );
}
