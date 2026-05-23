import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/Store.ts'
import ShopLayout from './component/shop/ShopLayout.tsx'
import Home from './pages/shop/Home.tsx'
import Products from './pages/shop/Products.tsx'
import History from './pages/shop/History.tsx'
import Recharge from './pages/shop/Recharge.tsx'
import Affiliate from './pages/shop/Affiliate.tsx'
import SimplePage from './pages/shop/SimplePage.tsx'
import Login from './pages/shop/Login.tsx'
import Register from './pages/shop/Register.tsx'
import Settings from './pages/shop/Settings.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/shop" element={<ShopLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="history" element={<History />} />
            <Route path="recharge" element={<Recharge />} />
            <Route path="affiliate" element={<Affiliate />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="settings" element={<Settings />} />
            <Route path="blog" element={<SimplePage title="Bài Viết Hướng Dẫn" icon="📝" description="Tổng hợp bài viết hướng dẫn sử dụng BM, kháng XMDT, nuôi via..." />} />
            <Route path="tools" element={<SimplePage title="Công Cụ Miễn Phí" icon="🛠️" description="Bộ công cụ check Live, watermark, random avatar, ePhotor..." />} />
            <Route path="faq" element={<SimplePage title="Câu Hỏi Thường Gặp" icon="❓" description="Tổng hợp các thắc mắc phổ biến về dịch vụ và sản phẩm." />} />
            <Route path="api" element={<SimplePage title="API Documentation" icon="🔌" description="Tài liệu tích hợp API cho khách hàng số lượng lớn." />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </Provider>,
)
