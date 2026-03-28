import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import RelatedProducts from "../components/product/RelatedProducts";
import "../components/product/ProductDetail.css";

const ProductDetail = ({ isLoggedIn = false, onLogout }) => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  useEffect(() => {
    if (!productId) return;

    window.scrollTo(0, 0);

    setError(null);
    setProduct(location.state?.product || null);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, location.state]);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onSignIn={handleSignIn} onRegister={handleRegister} onLogout={onLogout} />
      <div className="product-detail-container">
        <div className="product-detail-card">
          {loading && <div className="loading">Loading product...</div>}
          {error && <div className="error">Error: {error}</div>}
          {product && (
            <div className="product-detail">
              <ProductGallery productImages={product.images || [product.productImage]?.filter(Boolean)} />
              <ProductInfo product={product} />
            </div>
          )}
        </div>
        <RelatedProducts key={productId} />
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;