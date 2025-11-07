



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../service/axiosInstance";

const DatawrapperMap = () => {
  const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [dynamicHeight, setDynamicHeight] = useState("350px");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const chartId = "fGzC6";
  const version = 1;

  // Shared width classes for perfect alignment (map + controls)
  const widthClasses = "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[60%]";

  // 🔁 Refresh iframe (forces reload of map)
  const refreshMap = () => {
    setIframeKey(Date.now());
  };

  // 📡 Fetch district data before refreshing map
  const getDistrictMapData = async () => {
    setIsLoading(true);
    setIsMapLoading(true);
    try {
      await axiosInstance.get("/districts/get-district-map-data");
      refreshMap();
    } catch (error) {
      console.error("Error fetching district map data:", error);
      setIsMapLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Handle Datawrapper height messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data["datawrapper-height"]) {
        const iframes = document.querySelectorAll("iframe");
        for (const key in event.data["datawrapper-height"]) {
          for (let i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow === event.source) {
              const newHeight = event.data["datawrapper-height"][key] + "px";
              iframes[i].style.height = newHeight;
              setDynamicHeight(newHeight);
              setIsMapLoading(false);
            }
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      className="
        w-full flex flex-col items-center
        min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px]
        px-4 sm:px-6 lg:px-8 py-8
      "
    >
      {/* 🛠️ Controls bar – aligned to map width, no overlap guaranteed */}
      <div className={`${widthClasses} flex justify-between mb-5`}>
        {/* ⬅️ Back Button */}
        <button
          onClick={() => navigate("/reports")}
          className="
            flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 rounded-lg
            bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white
            text-xs sm:text-sm font-medium shadow-lg transition-all
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* 🔁 Refresh Button */}
        <button
          onClick={getDistrictMapData}
          disabled={isLoading}
          className={`
            flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 rounded-lg
            text-xs sm:text-sm font-medium shadow-lg transition-all duration-200
            ${isLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
            }
          `}
        >
          {isLoading ? (
            <>
              <ClipLoader color="#ffffff" size={14} />
              <span className="hidden sm:inline">Updating...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* 🗺️ Map container – fully responsive */}
      <div className={`${widthClasses} relative overflow-hidden rounded-xl shadow-xl`}>
        {/* 🔄 Loading overlay */}
        {(isLoading || isMapLoading) && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center z-10">
            <ClipLoader color="#3b82f6" size={48} />
            <p className="mt-3 text-base text-gray-700 font-medium">
              {isLoading ? "Updating map data..." : "Loading map..."}
            </p>
          </div>
        )}

        {/* 🗺️ Responsive iframe */}
        <iframe
          key={iframeKey}
          title={`Datawrapper-${chartId}`}
          src={`https://datawrapper.dwcdn.net/${chartId}/${version}/?lang=en`}
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          className="w-full transition-all duration-500 ease-out"
          style={{
            height: dynamicHeight,
            minHeight: "350px",
          }}
          onLoad={() => setTimeout(() => setIsMapLoading(false), 1000)}
        />
      </div>

      {/* 💡 Optional tip for even cleaner look */}
      {/* <p className="mt-6 text-xs text-gray-500 max-w-3xl text-center px-4">
        * For zero header/footer (no Datawrapper branding), republish the chart in Datawrapper with 
        <span className="font-medium"> "Plain" mode</span> enabled in Step 4 → Embed → Plain. 
        Then replace the src URL with the plain version.
      </p> */}
    </div>
  );
};

export default DatawrapperMap;
