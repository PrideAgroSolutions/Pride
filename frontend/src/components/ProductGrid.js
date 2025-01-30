import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

import { BACKEND_URL_LINK } from '../routes/url'

const ProductGrid = () => {
  // console.log(BACKEND_URL_LINK);
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v2/getSixProduct`);
        setProducts(response.data); // Assuming the response data contains the product array
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Fallback to empty array if the request fails
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="p-6 bg-gray-100 w-full flex flex-col items-center py-12 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center sm:text-4xl">
        Our Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-3 w-full max-w-7xl px-4">
      {/* <div className="grid grid-cols-2 items-center gap-8 "> */}
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
