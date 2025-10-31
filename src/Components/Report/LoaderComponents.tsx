import React from "react";

// Skeleton loader for charts
export const ChartSkeleton: React.FC = () => (
  <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
    <div className="h-64 bg-gray-300 rounded"></div>
  </div>
);

// Skeleton loader for report sections
export const ReportSectionSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-gray-50 p-4 rounded-lg">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);

// Spinner loader
export const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600`}></div>
  );
};

// Full page loader with message
export const FullPageLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <Spinner size="lg" />
    <p className="text-indigo-600 font-medium animate-pulse">{message}</p>
  </div>
);

// Data fetching loader overlay
export const DataFetchLoader: React.FC<{ message?: string }> = ({ message = "Fetching data..." }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-4">
      <Spinner size="lg" />
      <p className="text-gray-700 font-medium">{message}</p>
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Inline loader for buttons
export const ButtonLoader: React.FC = () => (
  <div className="flex items-center space-x-2">
    <Spinner size="sm" />
    <span>Loading...</span>
  </div>
);

// Chart loading placeholder with shimmer effect
export const ChartLoadingPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-semibold text-indigo-700 mb-3">{title}</h3>
    <div className="relative h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
    </div>
  </div>
);

// Stats loading skeleton
export const StatsLoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="text-center p-3 bg-white rounded-lg shadow">
        <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>
    ))}
  </div>
);

// District fetching loader
export const DistrictFetchingLoader: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="text-indigo-600 font-medium mt-4">Fetching districts...</p>
      <p className="text-gray-500 text-sm mt-2">Please wait while we load available districts</p>
    </div>
  </div>
);

// Block fetching loader
export const BlockFetchingLoader: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="text-indigo-600 font-medium mt-4">Loading blocks...</p>
      <p className="text-gray-500 text-sm mt-2">Fetching blocks for selected district</p>
    </div>
  </div>
);