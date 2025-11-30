import { HomePage } from "./Page/HomePage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Route, Routes, Outlet } from "react-router-dom";
import ProductDetails from "./Page/ProductDetail";
import SearchResultPage from "./Page/SearchResultPage";
import CartAndCheckout from "./Page/CartAndCheckout";
import { AppInitializer } from "./AppInitializer";
import LoginPage from "./Page/LoginPage";
import SignupPage from "./Page/SignupPage";
import { ToastProvider } from "@/components/ui/toast";
import OrderAddressPage from "./Page/OrderAdressPage";
import PaymentSuccessPage from "./Page/PaymentSuccessPage";
import TrackOrderPage from "./Page/TrackOrder";
import NotFoundPage from "./Page/NotFoundPage";
import { Toaster } from "./components/ui/sonner";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
declare global {
  interface Window {
    ChapaCheckout?: any;
  }
}
const App = () => {
  return (
    <ToastProvider>
      <AppInitializer />
      <Toaster />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/cart" element={<CartAndCheckout />} />
          <Route path="/order" element={<OrderAddressPage />} />
          <Route path="/orders/track" element={<TrackOrderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        {/* Fallback for any route not matched above (outside MainLayout) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;
