import QuantitySelector from "./QuantitySelector";
import "../components/ProductDetail.css";

const ProductInfo = ({ product }) => {
  const displayProduct = product || {
    name: "Product Name",
    sellerName: "Unknown Seller",
    price: "0",
    sellerImage: "https://i.pravatar.cc/150?u=default"
  };

  // Map database fields to component display
  const productName = displayProduct.name || displayProduct.itemName;
  const productPrice = displayProduct.price || displayProduct.itemPrice;
  const sellerName = displayProduct.sellerName || displayProduct.seller?.username || "Unknown";
  const sellerImage = displayProduct.sellerImage || "https://i.pravatar.cc/150?u=default";
  const rating = displayProduct.rating || 4.2;
  const reviews = displayProduct.reviews || 124;
  const description = displayProduct.description || "Authentic pre-loved item in excellent condition. Perfect for collectors and fashion enthusiasts.";

  return (
    <div className="info">
      <h2>{productName}</h2>
      <p className="seller">Seller: {sellerName}</p>
      <p className="rating">{rating} ★★★★☆ ({reviews} reviews)</p>
      <h3 className="price">${productPrice}</h3>

      <div className="product-description">
        <p>{description}</p>
      </div>

      <QuantitySelector />

      <div className="buttons">
        <button className="add">ADD TO CART</button>
        <button className="buy">BUY NOW</button>
      </div>

      <div className="seller-info">
        <img src={sellerImage} alt="Seller" className="seller-avatar" />
        <div>
          <p className="seller-name">{sellerName}</p>
          <p className="seller-status">Verified Seller</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;