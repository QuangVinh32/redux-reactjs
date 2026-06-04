import { useState } from "react";
import { Plus, Edit2, Trash2, Camera } from "lucide-react";
import {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../api/catalogApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { fileUrl } from "../../utils/format";
import type { Category, CategoryStatus } from "../../types/backend";

const STATUS_OPTIONS: CategoryStatus[] = ["CAFFE", "SODA", "TEA"];

export default function CategoriesPage() {
  const { data, isLoading } = useListCategoriesQuery({});
  const [create, { isLoading: creating }] = useCreateCategoryMutation();
  const [update, { isLoading: updating }] = useUpdateCategoryMutation();
  const [del] = useDeleteCategoryMutation();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [categoryStatus, setCategoryStatus] = useState<CategoryStatus>("CAFFE");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const startNew = () => {
    setEditing(null);
    setCategoryStatus("CAFFE");
    setImage(null);
    setPreview(null);
    setOpen(true);
  };
  const startEdit = (c: Category) => {
    setEditing(c);
    setCategoryStatus((c.categoryStatus as CategoryStatus) ?? "CAFFE");
    setImage(null);
    setPreview(c.categoryImage ? fileUrl(c.categoryImage) : null);
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("categoryStatus", categoryStatus);
    if (image) fd.append("categoryImage", image);
    try {
      if (editing) {
        await update({ id: Number(editing.categoryId), body: fd }).unwrap();
        dispatch(showToast({ message: "Đã cập nhật", kind: "success" }));
      } else {
        await create(fd).unwrap();
        dispatch(showToast({ message: "Đã tạo danh mục", kind: "success" }));
      }
      setOpen(false);
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  const onDelete = async (c: Category) => {
    if (!confirm(`Xóa "${c.categoryStatus}"?`)) return;
    try {
      await del(Number(c.categoryId)).unwrap();
      dispatch(showToast({ message: "Đã xóa", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-800">Danh mục</h1>
        <Button onClick={startNew} icon={<Plus size={16} />}>
          Thêm danh mục
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.content.map((c) => (
          <div key={String(c.categoryId)} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="aspect-video overflow-hidden bg-gray-100">
              {c.categoryImage && <img src={fileUrl(c.categoryImage)} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="p-3">
              <p className="font-bold text-gray-800">{c.categoryStatus}</p>
              <div className="mt-2 flex justify-end gap-1">
                <button
                  onClick={() => startEdit(c)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(c)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Sửa danh mục" : "Thêm danh mục"}>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Ảnh danh mục</span>
            <label className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-rose-400">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Camera size={24} />
                  <span className="mt-1 text-xs">Tải ảnh lên</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setImage(f);
                  setPreview(URL.createObjectURL(f));
                }}
              />
            </label>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Loại danh mục</span>
            <select
              value={categoryStatus}
              onChange={(e) => setCategoryStatus(e.target.value as CategoryStatus)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              required
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={creating || updating}>
              {editing ? "Cập nhật" : "Tạo"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
