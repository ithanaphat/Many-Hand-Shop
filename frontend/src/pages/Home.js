import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

function Home({ isLoggedIn }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          // Fallback to mock data
          setProducts([
            {
              _id: 1,
              sellerName: "Alice",
              sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
              images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
              name: "Vintage T-Shirt is very nice shirt my mom gave me when i as child",
              price: "1545448"
            },
            {
              _id: 2,
              sellerName: "Bob",
              sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
              images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"],
              name: "Film Camera",
              price: "85"
            },
            {
              _id: 3,
              sellerName: "Charlie",
              sellerImage: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
              images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"],
              name: "Jeans",
              price: "30"
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // Use mock data as fallback
        setProducts([
          {
            _id: 1,
            sellerName: "Alice",
            sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
            name: "Vintage T-Shirt is very nice shirt my mom gave me when i as child",
            price: "1545448"
          },
          {
            _id: 2,
            sellerName: "Bob",
            sellerImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"],
            name: "Film Camera",
            price: "85"
          },
          {
            _id: 3,
            sellerName: "Charlie",
            sellerImage: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
            images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"],
            name: "Jeans",
            price: "30"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="App" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header
        isLoggedIn={isLoggedIn}
        onSignIn={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
      
      <div style={{ padding: '100px 20px', display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product._id}
              id={product._id}
              sellerName={product.sellerName}
              sellerImage={product.sellerImage}
              productImage={product.images?.[0]}
              itemName={product.name}
              itemPrice={product.price}
            />
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;