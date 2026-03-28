import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "./ProductDetail.css";

const RelatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันช่วยจัดการ URL รูปภาพให้ถูกต้อง
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300?text=No+Image"; 
    if (imagePath.startsWith("http") || imagePath.startsWith("data:image")) {
      return imagePath;
    }
    return `${window.location.origin}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ดึงข้อมูลจาก API เดียวกับหน้าหลักของคุณ
        const response = await fetch("/api/product");
        
        if (!response.ok) {
          throw new Error(`API failed with status: ${response.status}`);
        }

        const data = await response.json();
        let productsList = [];

        // เช็กโครงสร้างข้อมูลเพื่อดึง Array ออกมา
        if (Array.isArray(data)) {
          productsList = data;
        } else if (data.products && Array.isArray(data.products)) {
          productsList = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          productsList = data.data; 
        }

        // 🎯 สับเปลี่ยนลำดับสินค้าแบบสุ่ม (Random Shuffle)
        const shuffledProducts = productsList.sort(() => 0.5 - Math.random());

        // 🎯 ตัดมาแค่ 4 ชิ้นแรกที่ถูกสุ่มแล้ว
        setProducts(shuffledProducts.slice(0, 4));

      } catch (err) {
        console.error("ดึงข้อมูลจริงไม่สำเร็จ โค้ดเลยใช้ Mock Data แทน:", err);
        // Fallback: ข้อมูลจำลอง
        setProducts([
          {
            _id: "mock1",
            sellerName: "Alice",
            sellerImage: "https://i.pravatar.cc/150?img=2",
            images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
            name: "Smart Watch",
            price: "45"
          },
          {
            _id: "mock2",
            sellerName: "Emma",
            sellerImage: "https://i.pravatar.cc/150?img=5",
            images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
            name: "Headphones",
            price: "25"
          },
          {
            _id: "mock3",
            sellerName: "Frank",
            sellerImage: "https://i.pravatar.cc/150?img=11",
            images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
            name: "T-Shirt",
            price: "55"
          },
          {
            _id: "mock4",
            sellerName: "Grace",
            sellerImage: "https://i.pravatar.cc/150?img=44",
            images: ["https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500"],
            name: "Sneakers",
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
      <h2>Products You Might Like</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      ) : products.length > 0 ? (
        <div 
          className="related" 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "24px", 
            flexWrap: "nowrap"
          }}
        >
          {products.map((product) => (
            <ProductCard 
              key={product._id}
              id={product._id}
              sellerId={product.seller?._id}
              sellerName={product.seller?.username || product.sellerName || 'Seller'}
            
              sellerImage={getImageUrl(product.seller?.images?.[0] || product.sellerImage || 'https://i.pravatar.cc/150?u=default')}
              
              productImage={getImageUrl(product.images?.[0])}
              itemName={product.name}
              itemPrice={product.price}
              stock={product.stock}
              sellerRating={product.seller?.rating || product.sellerRating || 0}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No related products found.
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;