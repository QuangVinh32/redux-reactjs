import { Outlet, Link } from "react-router-dom";
import TopBar from "./TopBar";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <Header />
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating button back to counter app */}
      <Link
        to="/"
        className="fixed bottom-4 right-4 z-50 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-md shadow-lg"
      >
        ← Counter App
      </Link>
    </div>
  );
}
