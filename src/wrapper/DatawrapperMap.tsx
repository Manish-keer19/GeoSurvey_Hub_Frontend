import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Install: npm install react-spinners
import axiosInstance from "../service/axiosInstance";

const DatawrapperMap = () => {
  const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [dynamicHeight, setDynamicHeight] = useState("300px"); // Initial height; will be overridden by Datawrapper
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

  // Removed resize listener to prevent unnecessary refreshes and improve performance on mobile/desktop

  return (
    <div 
      className="w-full max-w-full overflow-hidden relative min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]" // Responsive min-heights for better scaling across devices
    >
      {/* Loading Overlay for Map - Full coverage with subtle backdrop */}
      {(isLoading || isMapLoading) && (
        <div 
          className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center z-10"
        >
          <ClipLoader color="#3b82f6" size={40} />
          <p className="mt-2 text-sm text-gray-600 px-4 text-center leading-relaxed">
            {isLoading ? "Updating map..." : "Loading map..."}
          </p>
        </div>
      )}

      {/* Responsive iframe wrapper - Full width, centered content, minimal top margin for better mobile fit */}
      <div className="w-full flex items-center justify-center p-2 sm:p-4 mt-16 sm:mt-4   ">
        <iframe
          key={iframeKey}
          title={`Datawrapper-${chartId}`}
          src={`https://datawrapper.dwcdn.net/${chartId}/${version}/?lang=en`} // Force English language
          scrolling="no"
          frameBorder="0"
          className="w-[70%] md:w-[60%] rounded-lg shadow-sm transition-all duration-300" // Full width, responsive, with subtle shadow for depth
          loading="lazy"
          onLoad={() => setTimeout(() => setIsMapLoading(false), 1000)} // Fallback delay to ensure content loads
          style={{ 
            height: dynamicHeight, // Use dynamic height from Datawrapper
            minHeight: '250px', // Responsive min-height fallback
            aspectRatio: '16/9' // Maintain a sensible aspect ratio on small screens if height not set yet
          }}
        />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/reports')}
        className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-lg bg-gray-600 text-white border-none cursor-pointer text-xs sm:text-sm font-medium shadow-lg flex justify-center items-center gap-1 sm:gap-1.5 hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 ease-in-out min-w-[70px] sm:min-w-[90px]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Refresh Button */}
      <button
        onClick={getdisctrictMapData}
        disabled={isLoading}
        className={`
          absolute top-2 right-2 sm:top-4 sm:right-4 z-20 px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-lg bg-blue-500 text-white border-none cursor-pointer text-xs sm:text-sm font-medium shadow-lg
          flex justify-center items-center gap-1 sm:gap-1.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70
          hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 ease-in-out
          min-w-[70px] sm:min-w-[90px]
          ${isLoading ? 'opacity-90 scale-95' : ''}
        `}
      >
        {isLoading ? (
          <>
            <ClipLoader color="#ffffff" size={14} />
            <span className="hidden sm:inline">Updating...</span>
            <span className="sm:hidden">Updating</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </>
        )}
      </button>
    </div>
  );
};

export default DatawrapperMap;