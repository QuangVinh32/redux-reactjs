import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Plus, Trash2, ArrowLeft } from "lucide-react";
import {
  useCreateProductMutation,
  useGetProductAdminQuery,
  useListCategoriesQuery,
  useUpdateProductMutation,
  useBulkUpsertSizesMutation,
} from "../../api/catalogApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { fileUrl } from "../../utils/format";
import type { ProductSize } from "../../types/backend";

type SizeRow = Partial<ProductSize> & { _tempKey: string };

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: existing, isLoading: loadingExisting } = useGetProductAdminQuery(Number(id), {
    skip: !isEdit,
  });
  const { data: categories } = useListCategoriesQuery({});
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [bulkSizes, { isLoading: savingSizes }] = useBulkUpsertSizesMutation();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    categoryId: 0,
  });
  const [images, setImages] = useState<File[]>([]);
  const [sizes, setSizes] = useState<SizeRow[]>([
    { _tempKey: "k0", sizeName: "M", price: 0, discount: 0, quantity: 0 },
  ]);

  useEffect(() => {
    if (existing) {
      setForm({
        productName: existing.productName,
        description: existing.description ?? "",
        categoryId: existing.categoryId,
      });
      setSizes(
        existing.productSizes.map((s, i) => ({ ...s, _tempKey: `s${i}` })) ?? []
      );
    }
  }, [existing]);

  if (isEdit && loadingExisting) return <FullPageSpinner />;

  const addSize = () =>
    setSizes((arr) => [
      ...arr,
      { _tempKey: `k${Date.now()}`, sizeName: "", price: 0, discount: 0, quantity: 0 },
    ]);
  const updateSize = (idx: number, patch: Partial<SizeRow>) =>
    setSizes((arr) => arr.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  const removeSize = (idx: number) => setSizes((arr) => arr.filter((_, i) => i !== idx));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("productName", form.productName);
    fd.append("description", form.description);
    fd.append("categoryId", String(form.categoryId));
    images.forEach((img) => fd.append("productImages", img));
    fd.append(
      "productSizes",
      JSON.stringify(
        sizes.map(({ _tempKey: _k, ...rest }) => rest)
      )
    );

    try {
      let productId: number;
      if (isEdit) {
        const updated = await updateProduct({ id: Number(id), body: fd }).unwrap();
        productId = updated.productId;
        // also bulk upsert sizes (safer)
        await bulkSizes({
          productId,
          sizes: sizes.map(({ _tempKey: _k, ...rest }) => rest),
        }).unwrap();
      } else {
        const created = await createProduct(fd).unwrap();
        productId = created.productId;
      }
      dispatch(showToast({ message: isEdit ? "Đã cập nhật" : "Đã tạo sản phẩm", kind: "success" }));
      navigate("/admin/products");
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/admin/products")}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft size={14} /> Quay lại
      </button>
      <h1 className="mb-5 text-xl font-extrabold text-gray-800">
        {isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-gray-700">Thông tin chung</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Tên sản phẩm"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              required
            />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Danh mục</span>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              >
                <option value={0}>-- Chọn danh mục --</option>
                {categories?.content.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryStatus}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Mô tả</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </label>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-gray-700">Ảnh sản phẩm</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {existing?.productImages?.map((img) => (
              <div key={img.productImageId} className="aspect-square overflow-hidden rounded-lg">
                <img src={fileUrl(img.image)} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {images.map((f, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg border-2 border-dashed border-emerald-400">
                <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-rose-400 hover:text-rose-400">
              <Camera size={20} />
              <span className="mt-1 text-xs">Thêm ảnh</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setImages([...images, ...Array.from(e.target.files ?? [])])}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700">Sizes & giá</h2>
            <Button type="button" size="sm" variant="outline" onClick={addSize} icon={<Plus size={14} />}>
              Thêm size
            </Button>
          </div>
          <div className="space-y-2">
            {sizes.map((s, i) => (
              <div key={s._tempKey} className="grid grid-cols-12 gap-2 rounded-lg border border-gray-100 p-2">
                <input
                  placeholder="Size"
                  value={s.sizeName ?? ""}
                  onChange={(e) => updateSize(i, { sizeName: e.target.value })}
                  className="col-span-3 rounded border border-gray-200 px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Giá"
                  value={s.price ?? 0}
                  onChange={(e) => updateSize(i, { price: Number(e.target.value) })}
                  className="col-span-3 rounded border border-gray-200 px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="% giảm"
                  value={s.discount ?? 0}
                  onChange={(e) => updateSize(i, { discount: Number(e.target.value) })}
                  className="col-span-2 rounded border border-gray-200 px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Số lượng"
                  value={s.quantity ?? 0}
                  onChange={(e) => updateSize(i, { quantity: Number(e.target.value) })}
                  className="col-span-3 rounded border border-gray-200 px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSize(i)}
                  className="col-span-1 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-rose-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Hủy
          </Button>
          <Button type="submit" loading={creating || updating || savingSizes}>
            {isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </Button>
        </div>
      </form>
    </div>
  );
}
