import { Outlet } from "react-router-dom";
import Sidebar from "../admin/Sidebar";
import TopBar from "../admin/TopBar";
import { useAppSelector } from "../../redux/Store";
import Toast from "../common/Toast";

export default function AdminLayout() {
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={open} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}
