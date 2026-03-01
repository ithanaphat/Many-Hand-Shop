import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import RelatedProducts from "../components/RelatedProducts";
import "../components/ProductDetail.css";

const ProductDetail = ({ isLoggedIn = false, onLogout }) => {
  const { productId } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) return; // If product already loaded from navigation state, don't fetch

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9000/api/products/${productId}`);
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

    if (productId) {
      fetchProduct();
    }
  }, [productId, product]);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <div className="product-detail-container">
        {loading && <div className="loading">Loading product...</div>}
        {error && <div className="error">Error: {error}</div>}
        {product && (
          <>
            <div className="product-detail">
              <ProductGallery productImage={product.productImage || product.images?.[0]} />
              <ProductInfo product={product} />
            </div>
            <RelatedProducts />
          </>
        )}
      </div>
      <footer className="footer-simple">
        <p>&copy; 2026 Many Hand Shop. All rights reserved.</p>
      </footer>
    </>
  );
};

export default ProductDetail;