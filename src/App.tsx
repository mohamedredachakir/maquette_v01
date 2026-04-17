import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/Home';
import ProductListingPage from '@/pages/Products';
import ProductDetailPage from '@/pages/ProductDetail';
import DiscoverPage from '@/pages/Discover';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<ProductListingPage />} />
          <Route path="/collections/:collectionId" element={<ProductListingPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
