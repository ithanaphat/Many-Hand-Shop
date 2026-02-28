import { useState } from "react";
import "./ProductGallery.css";

const ProductGallery = ({ productImage }) => {
  // Handle both old format (productImage string) and new format (images array)
  let images = [];
  if (productImage) {
    images = [productImage, productImage, productImage, productImage];
  } else {
    images = [
      "https://via.placeholder.com/350",
      "https://via.placeholder.com/70",
      "https://via.placeholder.com/70",
      "https://via.placeholder.com/70"
    ];
  }

  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="gallery">
      <div className="main-image">
        <img src={mainImage} alt="Main Product" onError={(e) => e.target.src = "https://via.placeholder.com/400"} />
      </div>

      <div className="thumbnail-row">
        {images.map((img, idx) => (
          <div 
            key={idx}
            className="thumb" 
            onClick={() => setMainImage(img)}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} onError={(e) => e.target.src = "https://via.placeholder.com/70"} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;