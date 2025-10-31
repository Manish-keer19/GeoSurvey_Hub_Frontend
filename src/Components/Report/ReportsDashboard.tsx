import { useState } from "react";
import { BlockReportPage } from "./BlockReportPage";    
import { DistrictReportPage } from "./DistrictReportPage";
import { FullPageLoader } from "./LoaderComponents";
import { ErrorMessage } from "./ErrorComponents";
type Tab = "block" | "district" | "vidhansabha" | "loksabha";

const tabLabels: Record<Tab, string> = {
  block: "Block Report",
  district: "District Report",
  vidhansabha: "Vidhan Sabha",
  loksabha: "Lok Sabha",
};

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("block");
  const [loadingTab, setLoadingTab] = useState(false);
  const [tabError, setTabError] = useState<string | null>(null);

  const TabButton = ({ tab }: { tab: Tab }) => {
    const handleTabClick = () => {
      if (tab !== activeTab) {
        setLoadingTab(true);
        setTabError(null);
        setTimeout(() => {
          try {
            setActiveTab(tab);
          } catch (err) {
            setTabError("Failed to load report section");
          } finally {
            setLoadingTab(false);
          }
        }, 300);
      }
    };

    return (
      <button
        onClick={handleTabClick}
        disabled={loadingTab}
        className={`px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 ${
          activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {tabLabels[tab]}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 mt-[12vh] md:mt-[20vh]">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Reports Dashboard</h1>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <TabButton tab="block" />
          <TabButton tab="district" />
          <TabButton tab="vidhansabha" />
          <TabButton tab="loksabha" />
        </div>

        <div className="min-h-[500px]">
          {loadingTab ? (
            <FullPageLoader message="Loading report section..." />
          ) : tabError ? (
            <ErrorMessage 
              message={tabError} 
              onRetry={() => {
                setTabError(null);
                setActiveTab(activeTab);
              }} 
            />
          ) : (
            <>
              {activeTab === "block" && <BlockReportPage />}
              {activeTab === "district" && <DistrictReportPage />}
              {activeTab === "vidhansabha" && (
                <div className="text-center py-20">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-xl border border-yellow-200">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Vidhan Sabha Reports</h3>
                    <p className="text-gray-500">This section is under development and will be available soon.</p>
                  </div>
                </div>
              )}
              {activeTab === "loksabha" && (
                <div className="text-center py-20">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Lok Sabha Reports</h3>
                    <p className="text-gray-500">This section is under development and will be available soon.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}