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
interface Window {
  ChapaCheckout?: any;
}
const App = () => {
  return (
    <ToastProvider>
      <AppInitializer />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/cart" element={<CartAndCheckout />} />
          <Route path="/order" element={<OrderAddressPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;
