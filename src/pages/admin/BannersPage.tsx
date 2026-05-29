import { useState } from "react";
import { Plus, Edit2, Trash2, Camera } from "lucide-react";
import {
  useListBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "../../api/catalogApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { fileUrl } from "../../utils/format";
import type { Banner } from "../../types/backend";

export default function BannersPage() {
  const { data, isLoading } = useListBannersQuery({ size: 50 });
  const [create, { isLoading: creating }] = useCreateBannerMutation();
  const [update, { isLoading: updating }] = useUpdateBannerMutation();
  const [del] = useDeleteBannerMutation();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const startNew = () => {
    setEditing(null);
    setTitle(""); setUrl(""); setImage(null); setPreview(null);
    setOpen(true);
  };
  const startEdit = (b: Banner) => {
    setEditing(b);
    setTitle(b.title); setUrl(b.redirectUrl ?? "");
    setImage(null); setPreview(fileUrl(b.image));
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("redirectUrl", url);
    if (image) fd.append("image", image);
    try {
      if (editing) await update({ id: editing.bannerId, body: fd }).unwrap();
      else await create(fd).unwrap();
      dispatch(showToast({ message: "Đã lưu banner", kind: "success" }));
      setOpen(false);
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  const onDelete = async (b: Banner) => {
    if (!confirm(`Xóa banner "${b.title}"?`)) return;
    try {
      await del(b.bannerId).unwrap();
      dispatch(showToast({ message: "Đã xóa", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-800">Banner</h1>
        <Button onClick={startNew} icon={<Plus size={16} />}>Thêm banner</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.content.map((b) => (
          <div key={b.bannerId} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={fileUrl(b.image)} alt="" className="aspect-[2/1] w-full object-cover" />
            <div className="p-3">
              <p className="line-clamp-1 font-bold text-gray-800">{b.title}</p>
              {b.redirectUrl && (
                <p className="mt-1 line-clamp-1 text-xs text-blue-500">{b.redirectUrl}</p>
              )}
              <div className="mt-2 flex justify-end gap-1">
                <button onClick={() => startEdit(b)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => onDelete(b)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-rose-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Sửa banner" : "Thêm banner"}>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Ảnh</span>
            <label className="relative flex aspect-[2/1] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-rose-400">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Camera size={24} />
                  <span className="mt-1 text-xs">Tải ảnh banner (2:1)</span>
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
          <Input label="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Link redirect" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/promotion/june" />
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" loading={creating || updating}>
              {editing ? "Cập nhật" : "Tạo"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
