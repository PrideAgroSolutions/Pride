import React from "react";

const CropCard = ({ name, image }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <p className="text-sm mt-2 text-gray-700">{name}</p>
    </div>
  );
};

export default CropCard;
