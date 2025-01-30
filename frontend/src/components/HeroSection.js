import React from "react";
import Button from "./Button";
import front1 from "../assets/front1.jpg";
import front2 from "../assets/front2.jpg";
import front3 from "../assets/front3.jpg";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-between bg-gray-50 p-6 md:p-12 lg:p-16 font-ysabeau text-lg space-y-8 md:space-y-0 md:flex-row">
      {/* Text Content */}
      <div className="text-center md:text-left max-w-xl space-y-6 animate-fade-in-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-800">
          Improve your crop yield with sustainable and innovative solutions
        </h1>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
          <a href="/Products">
            <Button label="Our products" primary />
          </a>
          <a href="/results">
            <Button label="Our Results" />
          </a>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 w-full md:flex-nowrap animate-fade-in-right">
        {/* Image 1 */}
        <div className="group flex-1 transition-all duration-300 hover:flex-[3] sm:hover:flex-[2]">
          <img
            src={front1}
            alt="Landscape"
            className="w-full h-64 sm:h-80 md:h-96 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Image 2 */}
        <div className="group flex-1 transition-all duration-300 hover:flex-[3] sm:hover:flex-[2]">
          <img
            src={front2}
            alt="Landscape"
            className="w-full h-64 sm:h-80 md:h-96 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Image 3 */}
        <div className="group flex-1 transition-all duration-300 hover:flex-[3] sm:hover:flex-[2]">
          <img
            src={front3}
            alt="Landscape"
            className="w-full h-64 sm:h-80 md:h-96 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
