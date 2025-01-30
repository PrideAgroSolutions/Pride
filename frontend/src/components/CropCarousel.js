import React from "react";
import CropCard from "./CropCard";
import './CropCarousel.css';
const crops = [
  { name: "Wheat" },
  { name: "Apple" },
  { name: "Banana" },
  { name: "Potato" },
  { name: "Pomegranate" },
  { name: "Sugarcane" },
  { name: "Grapes" },
  { name: "Carrot" },
  { name: "Soybean" },
  { name: "Rice" },
  { name: "Mango" },
];

const CropCarousel = () => {

  return (
    <div className="py-6 relative">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Crop guides</h2>
      <p className="text-sm text-gray-600 mb-4">
        How to grow the strongest, healthiest crops
      </p>

      {/* Carousel with buttons */}
      <div className="relative mx-auto">

        <div
          className="flex space-x-4 mx-auto overflow-x-auto w-[70%] scrollbarhide"
        >
          {crops.map((crop, index) => (
            <CropCard key={index} name={crop.name} image={require('../assets/' + crop.name + '.png')} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropCarousel;
