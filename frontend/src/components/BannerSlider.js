import React, { useState, useEffect } from "react";

import Product1 from "../assets/Banana.png";
import Product2 from "../assets/Cauliflower.png";
import Product4 from "../assets/Pomegranate.png";
import Product5 from "../assets/Potato.png";
import Product6 from "../assets/Apple.png";
import Product7 from "../assets/Carrot.png";
import Product8 from "../assets/Sugarcane.png";
import Product9 from "../assets/Rice.png";

const BannerSlider = () => {
  const images = [
    { src: Product1, alt: "Banana" },
    { src: Product2, alt: "Cauliflower" },
    { src: Product4, alt: "Tomato" },
    { src: Product5, alt: "Potato" },
    { src: Product6, alt: "Apple" },
    { src: Product7, alt: "Carrot" },
    { src: Product8, alt: "Orange" },
    { src: Product9, alt: "Rice" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);

  return (
    <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg">
      {/* Desktop Layout */}
      <div className="hidden sm:flex space-x-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group flex-1 transition-all duration-300 hover:flex-[3] sm:hover:flex-[2]"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-64 sm:h-80 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="relative flex sm:hidden overflow-hidden">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-64 rounded-lg object-cover transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default BannerSlider;
