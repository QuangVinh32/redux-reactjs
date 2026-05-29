import { TrendingUp, ShoppingBag, Users, Ticket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRevenueQuery, useAdminOrdersQuery } from "../../api/orderApi";
import { useListUsersQuery, useListVouchersAdminQuery } from "../../api/miscApi";
import { useListProductsQuery } from "../../api/catalogApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import { formatDate, formatVND } from "../../utils/format";
import { orderStatusColor, orderStatusLabel } from "../../utils/status";

function Stat({
  icon, label, value, color, hint,
}: { icon: React.ReactNode; label: string; value: string; color: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-gray-800">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: revenue, isLoading: rl } = useRevenueQuery();
  const { data: orders } = useAdminOrdersQuery({ size: 5 });
  const { data: users } = useListUsersQuery();
  const { data: products } = useListProductsQuery({ size: 1 });
  const { data: vouchers } = useListVouchersAdminQuery();

  if (rl) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-extrabold text-gray-800">Tổng quan</h1>
      <p className="text-sm text-gray-500">Thống kê doanh thu và hoạt động</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<TrendingUp size={18} className="text-emerald-600" />}
          color="bg-emerald-50"
          label="Doanh thu thực"
          value={formatVND(revenue?.netRevenue ?? 0)}
          hint={`Gốc: ${formatVND(revenue?.originalRevenue ?? 0)}`}
        />
        <Stat
          icon={<Ticket size={18} className="text-rose-500" />}
          color="bg-rose-50"
          label="Tổng giảm giá"
          value={formatVND(revenue?.totalDiscount ?? 0)}
          hint={`${vouchers?.length ?? 0} voucher`}
        />
        <Stat
          icon={<ShoppingBag size={18} className="text-amber-500" />}
          color="bg-amber-50"
          label="Đơn hàng"
          value={String(orders?.totalElements ?? 0)}
          hint="Tổng số đơn"
        />
        <Stat
          icon={<Users size={18} className="text-indigo-500" />}
          color="bg-indigo-50"
          label="Người dùng"
          value={String(users?.length ?? 0)}
          hint={`${products?.totalElements ?? 0} sản phẩm`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">Đơn hàng gần đây</h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:underline"
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {orders?.content.slice(0, 5).map((o) => (
              <Link
                to={`/admin/orders?id=${o.orderId}`}
                key={o.orderId}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5 transition hover:border-rose-200 hover:bg-rose-50/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-800">#{o.orderId} • {o.fullName}</p>
                  <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${orderStatusColor[o.status]}`}
                >
                  {orderStatusLabel[o.status]}
                </span>
                <span className="hidden sm:block text-sm font-bold text-rose-500">
                  {formatVND(o.totalAmount)}
                </span>
              </Link>
            ))}
            {(!orders || orders.content.length === 0) && (
              <p className="py-6 text-center text-sm text-gray-400">Chưa có đơn hàng</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-5 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase opacity-80">Tip</p>
          <h3 className="mt-1 text-lg font-bold">Voucher mới?</h3>
          <p className="mt-1 text-sm opacity-90">
            Tạo chiến dịch khuyến mãi để tăng đơn cuối tuần.
          </p>
          <Link
            to="/admin/vouchers"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold hover:bg-white/30"
          >
            Tạo voucher <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
