import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import CustomerLayout from "./components/layouts/CustomerLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import { RequireAdmin, RequireAuth } from "./components/common/RequireAuth";
import { FullPageSpinner } from "./components/common/Spinner";

const HomePage = lazy(() => import("./pages/customer/HomePage"));
const ProductListPage = lazy(() => import("./pages/customer/ProductListPage"));
const ProductDetailPage = lazy(() => import("./pages/customer/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/customer/CartPage"));
const CheckoutPage = lazy(() => import("./pages/customer/CheckoutPage"));
const OrderListPage = lazy(() => import("./pages/customer/OrderListPage"));
const OrderDetailPage = lazy(() => import("./pages/customer/OrderDetailPage"));
const ProfilePage = lazy(() => import("./pages/customer/ProfilePage"));
const AddressesPage = lazy(() => import("./pages/customer/AddressesPage"));
const FavouritesPage = lazy(() => import("./pages/customer/FavouritesPage"));
const NotificationsPage = lazy(() => import("./pages/customer/NotificationsPage"));
const PaymentResultPage = lazy(() => import("./pages/customer/PaymentResultPage"));

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));

const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const AdminProductFormPage = lazy(() => import("./pages/admin/ProductFormPage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const AdminBannersPage = lazy(() => import("./pages/admin/BannersPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const AdminVouchersPage = lazy(() => import("./pages/admin/VouchersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AdminNotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));

const wrap = (el: React.ReactNode) => (
  <Suspense fallback={<FullPageSpinner />}>{el}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: wrap(<HomePage />) },
      { path: "products", element: wrap(<ProductListPage />) },
      { path: "products/:id", element: wrap(<ProductDetailPage />) },
      { path: "cart", element: wrap(<CartPage />) },
      {
        path: "checkout",
        element: <RequireAuth>{wrap(<CheckoutPage />)}</RequireAuth>,
      },
      {
        path: "orders",
        element: <RequireAuth>{wrap(<OrderListPage />)}</RequireAuth>,
      },
      {
        path: "orders/:id",
        element: <RequireAuth>{wrap(<OrderDetailPage />)}</RequireAuth>,
      },
      {
        path: "profile",
        element: <RequireAuth>{wrap(<ProfilePage />)}</RequireAuth>,
      },
      {
        path: "addresses",
        element: <RequireAuth>{wrap(<AddressesPage />)}</RequireAuth>,
      },
      {
        path: "favourites",
        element: <RequireAuth>{wrap(<FavouritesPage />)}</RequireAuth>,
      },
      {
        path: "notifications",
        element: <RequireAuth>{wrap(<NotificationsPage />)}</RequireAuth>,
      },
      { path: "payment/result", element: wrap(<PaymentResultPage />) },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: wrap(<LoginPage />) },
      { path: "/register", element: wrap(<RegisterPage />) },
      { path: "/forgot-password", element: wrap(<ForgotPasswordPage />) },
      { path: "/reset-password", element: wrap(<ResetPasswordPage />) },
      { path: "/verify-email", element: wrap(<VerifyEmailPage />) },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: wrap(<DashboardPage />) },
      { path: "products", element: wrap(<AdminProductsPage />) },
      { path: "products/new", element: wrap(<AdminProductFormPage />) },
      { path: "products/:id", element: wrap(<AdminProductFormPage />) },
      { path: "categories", element: wrap(<AdminCategoriesPage />) },
      { path: "banners", element: wrap(<AdminBannersPage />) },
      { path: "orders", element: wrap(<AdminOrdersPage />) },
      { path: "vouchers", element: wrap(<AdminVouchersPage />) },
      { path: "users", element: wrap(<AdminUsersPage />) },
      { path: "notifications", element: wrap(<AdminNotificationsPage />) },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
