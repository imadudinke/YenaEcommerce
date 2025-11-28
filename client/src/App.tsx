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

const App = () => {
  return (
    <>
      <AppInitializer />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/cart" element={<CartAndCheckout />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
};

export default App;
