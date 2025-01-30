import React, { useState, useEffect } from "react";
import axios from "axios";
import { Audio } from "react-loader-spinner";

import { BACKEND_URL_LINK } from '../routes/url'

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading

  // Fetch all results
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${BACKEND_URL_LINK}/api/v5/getAllResults`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="relative flex flex-col w-[80%] mx-auto">
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Audio height="80" width="80" color="green" ariaLabel="loading" />
        </div>
      )}

      {/* Main Content */}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {results.map((result) => (
            <div key={result._id} className="p-4 my-4  border border-2 bg-white rounded-lg">
                <h2 className="font-bold mb-4">{result.name}</h2>
              {/* Image Section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 w-full md:flex-nowrap animate-fade-in-right">
                {result.image && result.image.slice(0, 4).map((imgSrc, index) => (
                  <div
                    key={index}
                    className="group flex-1 transition-all duration-300 hover:flex-[3] sm:hover:flex-[2]"
                  >
                    <img
                      src={imgSrc}
                      alt={`Result ${index + 1}`}
                      className="w-full h-64 sm:h-80 md:h-96 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              <p className="w-full h-60 text-justify overflow-auto my-4">{result.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
