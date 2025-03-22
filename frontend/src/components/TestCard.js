import React from "react";

const TestCard = ({ title, location, percentage, description, image, isImage }) => {
  return (
    <div className="w-full mt-2 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      {isImage ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full aspect-square object-cover border border-gray-300 transition-transform duration-300 hover:scale-95"
        />
      ) : (
        <div className="relative w-full aspect-square flex flex-col items-start justify-center bg-[#d1ad0e] text-left border border-gray-300 transition-transform duration-300 hover:scale-95">
          <div className="p-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {title}
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-white/80 mt-2">
              {location}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                {percentage}%
              </span>
              <p className="text-lg sm:text-xl md:text-2xl text-white">
                {description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCard;
