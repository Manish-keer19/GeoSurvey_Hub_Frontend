import React from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onDownload?: () => void;
  loading?: boolean;
}

export const ReportLayout: React.FC<Props> = ({ title, subtitle, children, onDownload, loading }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border space-y-8">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-indigo-700">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {children}
      {onDownload && (
        <div className="text-center pt-6 border-t">
          <button
            onClick={onDownload}
            disabled={loading}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      )}
    </div>
  );
};