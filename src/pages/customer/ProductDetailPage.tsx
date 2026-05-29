import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import {
  useGetProductUserQuery,
  useListReviewsByProductQuery,
  useCreateReviewMutation,
} from "../../api/catalogApi";
import {
  useCheckFavouriteQuery,
  useToggleFavouriteMutation,
} from "../../api/miscApi";
import { useAddToCartMutation } from "../../api/cartApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { fileUrl, formatDate, formatVND, priceAfterDiscount } from "../../utils/format";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: product, isLoading } = useGetProductUserQuery(productId);
  const { data: reviews } = useListReviewsByProductQuery(productId);
  const { data: isFav } = useCheckFavouriteQuery(productId, { skip: !user });
  const [toggleFav] = useToggleFavouriteMutation();
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const [createReview] = useCreateReviewMutation();

  const [activeImg, setActiveImg] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  if (isLoading || !product) return <FullPageSpinner />;

  const size = product.productSizes?.[sizeIdx];
  const price = size ? priceAfterDiscount(size.price, size.discount) : 0;

  const onAdd = async () => {
    if (!user) {
      dispatch(showToast({ message: "Vui lòng đăng nhập", kind: "error" }));
      navigate("/login");
      return;
    }
    if (!size) return;
    try {
      await addToCart({
        productId: product.productId,
        productSizeId: size.productSizeId,
        quantity: qty,
      }).unwrap();
      dispatch(showToast({ message: "Đã thêm vào giỏ", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  const onBuyNow = async () => {
    await onAdd();
    navigate("/cart");
  };

  const onToggleFav = async () => {
    if (!user) return navigate("/login");
    try {
      await toggleFav(productId).unwrap();
    } catch { /* ignore */ }
  };

  const onSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, reviewText }).unwrap();
      setReviewText("");
      dispatch(showToast({ message: "Đã đăng đánh giá", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-white">
            {product.productImages?.[activeImg] && (
              <img
                src={fileUrl(product.productImages[activeImg].image)}
                alt={product.productName}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.productImages?.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.productImages.map((img, i) => (
                <button
                  key={img.productImageId}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${i === activeImg ? "border-rose-500" : "border-transparent"}`}
                >
                  <img src={fileUrl(img.image)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase text-rose-500">
            {product.categoryName ?? "Sản phẩm"}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-800">
            {product.productName}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              {product.averageRating?.toFixed(1) ?? "—"}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{reviews?.length ?? 0} đánh giá</span>
            {product.totalSold != null && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">Đã bán {product.totalSold}</span>
              </>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-rose-500">
              {formatVND(price)}
            </span>
            {size && size.discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatVND(size.price)}</span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-600">
                  -{size.discount}%
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          )}

          {/* Size selector */}
          {product.productSizes?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-gray-700">Kích cỡ</p>
              <div className="flex flex-wrap gap-2">
                {product.productSizes.map((s, i) => (
                  <button
                    key={s.productSizeId}
                    onClick={() => setSizeIdx(i)}
                    disabled={s.quantity === 0}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      i === sizeIdx
                        ? "border-rose-500 bg-rose-50 text-rose-600"
                        : "border-gray-200 hover:border-gray-300"
                    } ${s.quantity === 0 ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    {s.sizeName}
                    {s.quantity === 0 && (
                      <span className="ml-1 text-[10px]">(Hết)</span>
                    )}
                  </button>
                ))}
              </div>
              {size && (
                <p className="mt-2 text-xs text-gray-500">
                  Còn lại: {size.quantity}
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Số lượng</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="rounded p-1 hover:bg-gray-100"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(size?.quantity ?? 99, q + 1))}
                className="rounded p-1 hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onToggleFav}
              icon={<Heart size={16} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-rose-500" : ""} />}
            />
            <Button
              variant="outline"
              onClick={onAdd}
              loading={adding}
              icon={<ShoppingCart size={16} />}
            >
              Thêm vào giỏ
            </Button>
            <Button onClick={onBuyNow} loading={adding} full>
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-extrabold text-gray-800">
          Đánh giá ({reviews?.length ?? 0})
        </h2>
        {user && (
          <form
            onSubmit={onSubmitReview}
            className="mb-6 rounded-2xl border border-gray-100 bg-white p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Chấm điểm:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={n <= rating ? "text-amber-500" : "text-gray-300"}
                >
                  <Star size={20} fill="currentColor" />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn..."
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
            <div className="mt-3 text-right">
              <Button type="submit" size="sm" disabled={!reviewText.trim()}>
                Gửi đánh giá
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {reviews?.map((r) => (
            <div key={r.reviewId} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full bg-rose-100">
                  {r.userImage && <img src={r.userImage} alt="" className="h-full w-full object-cover" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.userFullName}</p>
                  <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                </div>
                <div className="ml-auto flex items-center text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{r.reviewText}</p>
            </div>
          ))}
          {(!reviews || reviews.length === 0) && (
            <p className="text-center text-sm text-gray-500">Chưa có đánh giá nào</p>
          )}
        </div>
      </section>
    </div>
  );
}
