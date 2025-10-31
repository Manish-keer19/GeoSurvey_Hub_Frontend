import React from "react";
import { ChartLoadingPlaceholder } from "./LoaderComponents";

interface ChartSectionProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ title, children, loading = false }) => {
  if (loading) {
    return <ChartLoadingPlaceholder title={title} />;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-indigo-700 mb-3">{title}</h3>
      {children}
    </div>
  );
};