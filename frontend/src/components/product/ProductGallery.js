import { useEffect, useState, useMemo } from "react";
import "./ProductDetail.css";

const ProductGallery = ({ productImages = [] }) => {

  const images = useMemo(() => {
      return productImages && productImages.length > 0 
        ? productImages 
        : ["https://via.placeholder.com/350"];
  }, [productImages]);

  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    } else {
      setMainImage("https://via.placeholder.com/350");
    }
  }, [images]);

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