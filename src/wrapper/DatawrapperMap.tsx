import { useEffect, useState } from "react";

import { ClipLoader } from "react-spinners"; // Install: npm install react-spinners
import axiosInstance from "../service/axiosInstance";

const DatawrapperMap = () => {
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [dynamicHeight, setDynamicHeight] = useState("300px"); // Reduced initial height for shorter view
  const [isLoading, setIsLoading] = useState(false); // Loading state for update
  const [isMapLoading, setIsMapLoading] = useState(true); // Loading state for map (initial and refresh)
  const chartId = "fGzC6";
  const version = 1;

  const refreshMap = () => {
    setIframeKey(Date.now());
  };

  const getdisctrictMapData = async () => {
    setIsLoading(true);
    setIsMapLoading(true);
    try {
      await axiosInstance.get("/districts/get-district-map-data");
      refreshMap();
    } catch (error) {
      console.error("Error fetching district map data:", error);
      setIsMapLoading(false); // Hide loader if API fails (no refresh)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data["datawrapper-height"]) {
        const iframes = document.querySelectorAll("iframe");
        for (const key in event.data["datawrapper-height"]) {
          for (let i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow === event.source) {
              const newHeight = event.data["datawrapper-height"][key] + "px";
              iframes[i].style.height = newHeight;
              setDynamicHeight(newHeight); // Update state for re-renders if needed
              setIsMapLoading(false); // Mark as loaded once height is set
            }
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Optional: Listen for window resize to potentially refresh if needed (e.g., orientation change)
  useEffect(() => {
    const handleResize = () => {
      // Throttle resize if needed, but for now, refresh on resize for better mobile responsiveness
      const timeoutId = setTimeout(() => refreshMap(), 250);
      return () => clearTimeout(timeoutId);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div 
      className="w-full max-w-full overflow-hidden relative min-h-[300px]" // Responsive container with min-height
    >
      {/* Loading Overlay for Map */}
      {(isLoading || isMapLoading) && (
        <div 
          className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center z-10"
        >
          <ClipLoader color="#3b82f6" size={50} />
          <p className="mt-2.5 text-sm text-gray-600">
            {isLoading ? "Updating map..." : "Loading map..."}
          </p>
        </div>
      )}

      <iframe
        key={iframeKey}
        title={`Datawrapper-${chartId}`}
        src={`https://datawrapper.dwcdn.net/${chartId}/${version}/?lang=en`} // Force English language
        scrolling="no"
        frameBorder="0"
        className={`w-full border-none h-[${dynamicHeight}] transition-all duration-300 ease-in-out `} // Dynamic height with Tailwind transition
        loading="lazy"
        onLoad={() => setTimeout(() => setIsMapLoading(false), 1000)} // Fallback delay to ensure content loads
      />

      {/* Refresh Button - Positioned in top center for better UI/UX */}
      <button
        onClick={getdisctrictMapData}
        disabled={isLoading}
        className={`
          absolute top-0 right-[2vw] -translate-x-1/2 z-20 px-3 py-1.5 rounded-md bg-blue-500 text-white border-none cursor-pointer text-sm
          flex justify-center items-center gap-1.5 disabled:bg-gray-400 disabled:cursor-not-allowed
          hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200
          ${isLoading ? 'opacity-80' : ''}
        `}
      >
        {isLoading ? (
          <>
            <ClipLoader color="#ffffff" size={16} />
            Updating...
          </>
        ) : (
          "Refresh"
        )}
      </button>
    </div>
  );
};

export default DatawrapperMap;