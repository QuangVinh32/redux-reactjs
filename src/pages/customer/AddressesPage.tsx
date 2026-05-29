import { useState } from "react";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import {
  useListAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "../../api/miscApi";
import { FullPageSpinner } from "../../components/common/Spinner";
import Empty from "../../components/common/Empty";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAppDispatch } from "../../redux/Store";
import { showToast } from "../../redux/slices/uiSlice";
import type { ShippingAddress } from "../../types/backend";

type FormValues = Omit<ShippingAddress, "shippingAddressId">;
const empty: FormValues = {
  receiverName: "",
  receiverPhone: "",
  addressLine: "",
  ward: "",
  district: "",
  province: "",
  default: false,
};

export default function AddressesPage() {
  const { data, isLoading } = useListAddressesQuery();
  const [create, { isLoading: creating }] = useCreateAddressMutation();
  const [update, { isLoading: updating }] = useUpdateAddressMutation();
  const [del] = useDeleteAddressMutation();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingAddress | null>(null);
  const [form, setForm] = useState<FormValues>(empty);

  const startNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const startEdit = (a: ShippingAddress) => {
    setEditing(a);
    const { shippingAddressId: _, ...rest } = a;
    setForm(rest);
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await update({ id: editing.shippingAddressId, body: form }).unwrap();
        dispatch(showToast({ message: "Đã cập nhật địa chỉ", kind: "success" }));
      } else {
        await create(form).unwrap();
        dispatch(showToast({ message: "Đã thêm địa chỉ", kind: "success" }));
      }
      setOpen(false);
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  const onDelete = async (a: ShippingAddress) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    try {
      await del(a.shippingAddressId).unwrap();
      dispatch(showToast({ message: "Đã xóa", kind: "success" }));
    } catch (e: any) {
      dispatch(showToast({ message: e?.data?.message ?? "Lỗi", kind: "error" }));
    }
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-800">Sổ địa chỉ</h1>
        <Button onClick={startNew} icon={<Plus size={16} />} size="sm">
          Thêm địa chỉ
        </Button>
      </div>

      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((a) => (
            <div key={a.shippingAddressId} className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-rose-500" size={18} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {a.receiverName} • {a.receiverPhone}
                    {a.default && (
                      <span className="ml-2 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                        Mặc định
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {a.addressLine}, {a.ward}, {a.district}, {a.province}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(a)}
                    className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(a)}
                    className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon="📍"
          title="Chưa có địa chỉ nào"
          action={<Button onClick={startNew}>Thêm địa chỉ đầu tiên</Button>}
        />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Sửa địa chỉ" : "Thêm địa chỉ"}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Tên người nhận"
              value={form.receiverName}
              onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
              required
            />
            <Input
              label="Số điện thoại"
              value={form.receiverPhone}
              onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
              required
            />
          </div>
          <Input
            label="Số nhà, tên đường"
            value={form.addressLine}
            onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
            required
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Phường/Xã"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              required
            />
            <Input
              label="Quận/Huyện"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              required
            />
            <Input
              label="Tỉnh/Thành phố"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.default}
              onChange={(e) => setForm({ ...form, default: e.target.checked })}
              className="accent-rose-500"
            />
            Đặt làm địa chỉ mặc định
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
