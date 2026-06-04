import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  useGetCartQuery,
  useGetTotalQuery,
  useIncrementItemMutation,
  useDecrementItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} from "../../api/cartApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Empty from "../../components/common/Empty";
import Button from "../../components/common/Button";
import { useAppSelector, useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import {
  cartItemImageUrl,
  cartItemProductId,
  cartItemProductName,
  cartItemSizeId,
  cartItemSizeName,
  cartItemUnitPrice,
  formatVND,
} from "../../utils/format";

export default function CartPage() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: items, isLoading } = useGetCartQuery(undefined, { skip: !user });
  const { data: total } = useGetTotalQuery(undefined, { skip: !user });
  const [inc] = useIncrementItemMutation();
  const [dec] = useDecrementItemMutation();
  const [remove] = useRemoveItemMutation();
  const [clear, { isLoading: clearing }] = useClearCartMutation();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Empty
          icon="🔒"
          title="Đăng nhập để xem giỏ hàng"
          action={
            <Link to="/login" className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white">
              Đăng nhập
            </Link>
          }
        />
      </div>
    );
  }
  if (isLoading) return <FullPageSpinner />;

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Empty
          icon="🛒"
          title="Giỏ hàng đang trống"
          description="Khám phá thực đơn để đặt món bạn yêu thích"
          action={
            <Link to="/products" className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white">
              Đi mua sắm
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-800">Giỏ hàng ({items.length})</h1>
        <button
          onClick={async () => {
            if (!confirm("Xóa toàn bộ giỏ?")) return;
            await clear().unwrap();
            dispatch(showToast({ message: "Đã xóa giỏ", kind: "success" }));
          }}
          disabled={clearing}
          className="text-sm text-gray-500 hover:text-rose-500"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => {
            const productId = cartItemProductId(item);
            const sizeId = cartItemSizeId(item);
            const unit = cartItemUnitPrice(item);
            const rawPrice = item.productSize.price;
            const discount = item.productSize.discount ?? 0;
            return (
              <div
                key={`${productId}-${sizeId}`}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4"
              >
                <img
                  src={cartItemImageUrl(item)}
                  alt={cartItemProductName(item)}
                  className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${productId}`}
                    className="line-clamp-1 text-sm font-semibold text-gray-800 hover:text-rose-500"
                  >
                    {cartItemProductName(item)}
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-500">Size: {cartItemSizeName(item)}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-rose-500">{formatVND(unit)}</span>
                    {discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">{formatVND(rawPrice)}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => remove({ productId, productSizeId: sizeId })}
                    className="text-gray-400 hover:text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-1">
                    <button
                      onClick={() => dec({ productId, productSizeId: sizeId })}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => inc({ productId, productSizeId: sizeId })}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="text-base font-bold text-gray-800">Tóm tắt</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatVND(total ?? 0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng</span>
              <span className="text-xs">Tính ở bước thanh toán</span>
            </div>
            <div className="my-3 border-t border-dashed border-gray-200" />
            <div className="flex items-baseline justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="text-xl text-rose-500">{formatVND(total ?? 0)}</span>
            </div>
          </div>
          <Button
            full
            size="lg"
            className="mt-5"
            icon={<ShoppingBag size={18} />}
            onClick={() => navigate("/checkout")}
          >
            Thanh toán
          </Button>
        </aside>
      </div>
    </div>
  );
}
