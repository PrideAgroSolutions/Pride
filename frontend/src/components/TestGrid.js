import React from "react";
import TestCard from "./TestCard";
import bananaImg from "../assets/Banana.png"; // Replace with actual image paths
import cauliflowerImg from "../assets/Cauliflower.png";
import sugarcane from "../assets/Sugarcane.png";

const TestGrid = () => {
  const trials = [
    {
      title: "Banana cost benefit...",
      location: "Nandore, Pandharpur...",
      percentage: 17,
      description: "Banana Yield",
      image: bananaImg,
      isImage: false,
    },
    {
      title: "",
      location: "",
      percentage: "",
      description: "",
      image: cauliflowerImg,
      isImage: true,
    },
    {
      title: "SugarCane Trial",
      location: "Madha, Maharashtra...",
      percentage: 35,
      description: "Seed Yield Increase",
      image: "",
      isImage: false,
    },
    {
      title: "",
      location: "",
      percentage: "",
      description: "",
      image: bananaImg,
      isImage: true,
    },
    {
      title: "Cauliflower Trails ",
      location: "Nevare, Malshiras",
      percentage: 39,
      description: "Yield Increase",
      image: "",
      isImage: false,
    },
    {
      title: "",
      location: "",
      percentage: "",
      description: "",
      image: sugarcane,
      isImage: true,
    },
  ];

  return (
    <section className="p-6 bg-gray-100 w-full flex flex-col items-center">
      <h2 className="text-3xl font-ysabeau font-bold mb-8 text-center animate-fade-in-left">
        Our Trials
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-6xl animate-fade-in-right">
        {trials.map((trial, index) => (
          <TestCard key={index} {...trial} />
        ))}
      </div>
    </section>
  );
};

export default TestGrid;
