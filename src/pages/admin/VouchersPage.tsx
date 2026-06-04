import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  useListVouchersAdminQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} from "../../api/miscApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import { formatDate, formatVND } from "../../utils/format";
import type { DiscountType, Voucher, VoucherStatus, VoucherTarget } from "../../types/backend";

const empty: Partial<Voucher> = {
  code: "",
  description: "",
  discountType: "PERCENT",
  discountValue: 10,
  maxDiscount: 50000,
  minOrderValue: 100000,
  usageLimitGlobal: 100,
  usageLimitPerUser: 1,
  target: "ALL",
  status: "ACTIVE",
  startDate: "",
  endDate: "",
};

export default function VouchersPage() {
  const { data, isLoading } = useListVouchersAdminQuery();
  const [create, { isLoading: creating }] = useCreateVoucherMutation();
  const [update, { isLoading: updating }] = useUpdateVoucherMutation();
  const [del] = useDeleteVoucherMutation();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [form, setForm] = useState<Partial<Voucher>>(empty);

  const startNew = () => {
    setEditing(null);
    setForm({ ...empty, startDate: new Date().toISOString().slice(0, 16) });
    setOpen(true);
  };
  const startEdit = (v: Voucher) => {
    setEditing(v);
    setForm({
      ...v,
      startDate: v.startDate?.slice(0, 16),
      endDate: v.endDate?.slice(0, 16),
    });
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await update({ id: editing.voucherId, body: form }).unwrap();
      else await create(form).unwrap();
      dispatch(showToast({ message: "Đã lưu voucher", kind: "success" }));
      setOpen(false);
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  const onDelete = async (v: Voucher) => {
    if (!confirm(`Xóa voucher "${v.code}"?`)) return;
    try {
      await del(v.voucherId).unwrap();
      dispatch(showToast({ message: "Đã xóa", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-800">Voucher</h1>
        <Button onClick={startNew} icon={<Plus size={16} />}>Tạo voucher</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((v) => (
          <div
            key={v.voucherId}
            className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-5 text-white shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold opacity-80">
                  {v.discountType === "PERCENT" ? "% Giảm" : "Giảm tiền cố định"}
                </p>
                <p className="mt-1 text-3xl font-extrabold">
                  {v.discountType === "PERCENT" ? `${v.discountValue}%` : formatVND(v.discountValue)}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(v)} className="rounded bg-white/20 p-1 hover:bg-white/30">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => onDelete(v)} className="rounded bg-white/20 p-1 hover:bg-white/30">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <p className="mt-2 font-bold tracking-widest">{v.code}</p>
            <p className="text-xs opacity-80 line-clamp-2">{v.description}</p>
            <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2 text-[10px] opacity-80">
              <span>
                Đã dùng: {v.usedCount}/{v.usageLimitGlobal ?? "∞"}
              </span>
              <span>HSD: {v.endDate ? formatDate(v.endDate) : "—"}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] opacity-80">
              <span>Đơn tối thiểu: {formatVND(v.minOrderValue ?? 0)}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 font-bold uppercase">
                {v.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? `Sửa "${editing.code}"` : "Tạo voucher mới"}
        width="max-w-2xl"
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Mã code"
              value={form.code ?? ""}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              required
            />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Loại</span>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as DiscountType })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="PERCENT">% Phần trăm</option>
                <option value="FIXED">Giảm tiền cố định (₫)</option>
              </select>
            </label>
          </div>

          <Input
            label="Mô tả"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Giá trị"
              type="number"
              value={form.discountValue ?? 0}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
              required
            />
            <Input
              label="Giảm tối đa"
              type="number"
              value={form.maxDiscount ?? 0}
              onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
            />
            <Input
              label="Đơn tối thiểu"
              type="number"
              value={form.minOrderValue ?? 0}
              onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Tổng lượt dùng"
              type="number"
              value={form.usageLimitGlobal ?? 0}
              onChange={(e) => setForm({ ...form, usageLimitGlobal: Number(e.target.value) })}
            />
            <Input
              label="Lượt / user"
              type="number"
              value={form.usageLimitPerUser ?? 0}
              onChange={(e) => setForm({ ...form, usageLimitPerUser: Number(e.target.value) })}
            />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Trạng thái</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as VoucherStatus })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="DRAFT">Bản nháp (DRAFT)</option>
                <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
                <option value="EXPIRED">Hết hạn (EXPIRED)</option>
                <option value="DISABLED">Tắt (DISABLED)</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Đối tượng áp dụng</span>
            <select
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value as VoucherTarget })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Tất cả (ALL)</option>
              <option value="USER">User được gán (USER)</option>
              <option value="NEW_USER">User mới (NEW_USER)</option>
              <option value="VIP">User VIP (VIP)</option>
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Bắt đầu"
              type="datetime-local"
              value={form.startDate ?? ""}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
            <Input
              label="Kết thúc"
              type="datetime-local"
              value={form.endDate ?? ""}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>

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
