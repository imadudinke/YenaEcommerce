import { HomePage } from "./Page/HomePage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Route, Routes } from "react-router-dom";
import ProductDetails from "./Page/ProductDetail";
import SearchResultPage from "./Page/SearchResultPage";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
