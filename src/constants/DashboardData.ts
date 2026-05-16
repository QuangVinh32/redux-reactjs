export interface BM {
  id: string;
  status: "Live" | "Off";
  accountName: string;
  accountSubId: string;
  avatarColor: string;
  avatarLetter: string;
  bmId: string;
  bmType: string;
  createdAt: string;
  permission: "FINANCE_EDITOR" | "DEVELOPER" | "ADMIN";
  bm: string;
  accountBM: string;
  accountShare: string;
  doiTac: string;
  progress: "READY" | "PENDING";
}

export interface Utility {
  id: string;
  name: string;
  enabled: boolean;
  iconColor: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export const initialBMs: BM[] = [
  { id: "bm-1", status: "Live", accountName: "Hoa 99999", accountSubId: "111870954339806", avatarColor: "bg-orange-400", avatarLetter: "H", bmId: "1118709543339806", bmType: "BM50", createdAt: "07/04/2021", permission: "FINANCE_EDITOR", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-2", status: "Live", accountName: "Hoa008", accountSubId: "111146864413699", avatarColor: "bg-orange-400", avatarLetter: "H", bmId: "111146864413699", bmType: "BM50", createdAt: "07/04/2021", permission: "FINANCE_EDITOR", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-3", status: "Live", accountName: "Hoa005", accountSubId: "109640051232345", avatarColor: "bg-orange-400", avatarLetter: "H", bmId: "109640051232345", bmType: "BM50", createdAt: "07/04/2021", permission: "DEVELOPER", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-4", status: "Live", accountName: "Baby Girl", accountSubId: "108878124701899", avatarColor: "bg-blue-400", avatarLetter: "B", bmId: "108878124701899", bmType: "BM50", createdAt: "10/05/2021", permission: "ADMIN", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-5", status: "Live", accountName: "Dinh06", accountSubId: "105310841672921", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "105310841672921", bmType: "BM50", createdAt: "08/04/2021", permission: "DEVELOPER", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-6", status: "Live", accountName: "Girl Friend", accountSubId: "104284905173349", avatarColor: "bg-red-400", avatarLetter: "G", bmId: "104284905173349", bmType: "BM50", createdAt: "10/05/2021", permission: "ADMIN", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-7", status: "Live", accountName: "Dinh 11", accountSubId: "103770451828075", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "103770451828075", bmType: "BM50", createdAt: "09/04/2021", permission: "FINANCE_EDITOR", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-8", status: "Live", accountName: "Dinh 12", accountSubId: "102195091991310", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "102195091991310", bmType: "BM50", createdAt: "09/04/2021", permission: "DEVELOPER", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-9", status: "Live", accountName: "Hoa002", accountSubId: "101756472030011", avatarColor: "bg-orange-400", avatarLetter: "H", bmId: "101756472030011", bmType: "BM50", createdAt: "07/04/2021", permission: "FINANCE_EDITOR", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-10", status: "Live", accountName: "Dinh 09", accountSubId: "101346652077504", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "101346652077504", bmType: "BM50", createdAt: "09/04/2021", permission: "DEVELOPER", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-11", status: "Live", accountName: "Dinh 13", accountSubId: "101259152087053", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "101259152087053", bmType: "BM50", createdAt: "09/04/2021", permission: "FINANCE_EDITOR", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-12", status: "Live", accountName: "Dinh 10", accountSubId: "100628852153224", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "100628852153224", bmType: "BM50", createdAt: "09/04/2021", permission: "FINANCE_EDITOR", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-13", status: "Live", accountName: "Dinh 14", accountSubId: "100614322155626", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "100614322155626", bmType: "BM50", createdAt: "09/04/2021", permission: "FINANCE_EDITOR", bm: "BM50", accountBM: "", accountShare: "", doiTac: "", progress: "READY" },
  { id: "bm-14", status: "Live", accountName: "Dinh 15", accountSubId: "100250312192984", avatarColor: "bg-blue-400", avatarLetter: "D", bmId: "100250312192984", bmType: "BM50", createdAt: "09/04/2021", permission: "DEVELOPER", bm: "BM50", accountBM: "", accountShare: "Total 1", doiTac: "", progress: "READY" },
];

export const initialUtilities: Utility[] = [
  { id: "backup-bm", name: "Backup BM", enabled: false, iconColor: "bg-blue-500" },
  { id: "nhom-tai-san", name: "Nhóm tài sản BM", enabled: false, iconColor: "bg-purple-500" },
  { id: "huy-loi-moi", name: "Hủy lời mời", enabled: false, iconColor: "bg-red-500" },
  { id: "tao-tkqc-ro", name: "Tạo TKQC Read-Only", enabled: false, iconColor: "bg-green-500" },
  { id: "tao-tkqc", name: "Tạo TKQC", enabled: false, iconColor: "bg-green-600" },
  { id: "nhat-dong-bm", name: "Nhật động 1 BM", enabled: false, iconColor: "bg-yellow-500" },
  { id: "xoa-bm-vv", name: "Xóa BM vĩnh viễn", enabled: false, iconColor: "bg-red-600" },
  { id: "thoat-bm", name: "Thoát BM", enabled: false, iconColor: "bg-orange-500" },
  { id: "kich-hoat-page", name: "Kích hoạt Page", enabled: false, iconColor: "bg-blue-600" },
  { id: "xoa-tk-ig", name: "Xóa TK IG", enabled: false, iconColor: "bg-pink-500" },
  { id: "xoa-doi-tac", name: "Xóa Đối Tác", enabled: false, iconColor: "bg-red-400" },
  { id: "xoa-qtv", name: "Xóa QTV", enabled: false, iconColor: "bg-red-500" },
  { id: "xoa-tk-share", name: "Xóa TK Share", enabled: false, iconColor: "bg-red-500" },
  { id: "doi-ten-bm", name: "Đổi tên BM & User", enabled: false, iconColor: "bg-indigo-500" },
  { id: "hien-tkqc-ro", name: "Hiện TKQC Read-Only", enabled: false, iconColor: "bg-cyan-500" },
  { id: "cap-nhat-quyen", name: "Cập nhật quyền", enabled: false, iconColor: "bg-teal-500" },
  { id: "tach-tk", name: "Tách tài khoản", enabled: false, iconColor: "bg-purple-600" },
];

export const menuSections: MenuSection[] = [
  {
    id: "main",
    title: "MAIN",
    items: [{ id: "trang-chu", label: "Trang chủ", icon: "🏠" }],
  },
  {
    id: "quan-ly",
    title: "QUẢN LÝ",
    items: [
      { id: "tk-qc", label: "Tài khoản QC", icon: "📊" },
      { id: "tk-bm", label: "Tài khoản BM", icon: "💼" },
      { id: "fanpage", label: "Fanpage", icon: "📄" },
    ],
  },
  {
    id: "tien-ich",
    title: "TIỆN ÍCH",
    items: [{ id: "email-tam", label: "Email tạm thời", icon: "✉️" }],
  },
  {
    id: "tai-khoan",
    title: "TÀI KHOẢN",
    items: [{ id: "ql-phien", label: "Quản lý phiên", icon: "🔐" }],
  },
  {
    id: "ho-tro",
    title: "HỖ TRỢ",
    items: [
      { id: "nhom-ht", label: "Nhóm hỗ trợ", icon: "💬" },
      { id: "cai-dat", label: "Cài đặt", icon: "⚙️" },
    ],
  },
];
