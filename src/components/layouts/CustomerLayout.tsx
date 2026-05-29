import { Outlet } from "react-router-dom";
import Header from "../customer/Header";
import Footer from "../customer/Footer";
import Toast from "../common/Toast";

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-rose-50/40 via-white to-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
