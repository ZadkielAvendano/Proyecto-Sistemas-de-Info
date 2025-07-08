import React, { useState } from 'react';
import './css/ImageCarousel.css';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="carousel-container">No hay imágenes para mostrar.</div>;
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="carousel-container" style={{ position: 'relative', height: '300px' }}>
      <button className="carousel-button" onClick={prevSlide}>‹</button>
      <div className="carousel-image-wrapper">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <button className="carousel-button" onClick={nextSlide}>›</button>
    </div>

  );
};



export default ImageCarousel;
