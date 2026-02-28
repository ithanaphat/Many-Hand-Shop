import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "../components/ProductDetail.css";

const RelatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/products");
        if (response.ok) {
          const data = await response.json();
          // Get first 4 products as related products
          setProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
        // Fallback to mock data if API fails
        setProducts([
          {
            _id: 1,
            sellerName: "Alice",
            sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
            name: "Casual Shirt",
            price: "45"
          },
          {
            _id: 2,
            sellerName: "Emma",
            sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026812d",
            images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
            name: "Summer T-Shirt",
            price: "25"
          },
          {
            _id: 3,
            sellerName: "Frank",
            sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026512d",
            images: ["https://images.unsplash.com/photo-1441553062407-b8d5e235e4d9?w=500"],
            name: "Polo Shirt",
            price: "55"
          },
          {
            _id: 4,
            sellerName: "Grace",
            sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026912d",
            images: ["https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500"],
            name: "Denim Jacket",
            price: "85"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="related-products-section">
      <h2>Related Products You Might Like</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      ) : (
        <div className="related">
          {products.map((product) => (
            <ProductCard 
              key={product._id}
              id={product._id}
              sellerName={product.sellerName || "Unknown"}
              sellerImage={product.sellerImage || "https://i.pravatar.cc/150"}
              productImage={product.images?.[0] || product.productImage}
              itemName={product.name || product.itemName}
              itemPrice={product.price || "0"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;