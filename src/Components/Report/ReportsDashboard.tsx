import { useState } from "react";
import { BlockReportPage } from "./BlockReportPage";
import { DistrictReportPage } from "./DistrictReportPage";
import { FullPageLoader } from "./LoaderComponents";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
type Tab = "block" | "district" | "vidhansabha" | "loksabha";



export default function ReportsDashboard() {
  const user = useSelector((state: any) => state.auth.user);
  const { t } = useTranslation();
  // const token = useSelector((state: any) => state.auth.token);

  // Role-based tab access
  const getAvailableTabs = (): Tab[] => {
    switch (user?.role) {
      case "DISTRICT_USER":
        return ["block", "district"];
      case "VIDHANSABHA_USER":

        return ["block", "district", "vidhansabha"];
      case "LOKSABHA_USER":
        return ["block", "district", "vidhansabha", "loksabha"];
      case "ADMIN":
        return ["block", "district", "vidhansabha", "loksabha"];
      default:
        return ["block", "district"];
    }
  };

  const availableTabs = getAvailableTabs();
  const [activeTab, setActiveTab] = useState<Tab>(availableTabs[0]);
  const [loadingTab, setLoadingTab] = useState(false);


  const TabButton = ({ tab }: { tab: Tab }) => {
    const handleTabClick = () => {
      if (tab !== activeTab) {
        setLoadingTab(true);
        setTimeout(() => {
          setActiveTab(tab);
          setLoadingTab(false);
        }, 300);
      }
    };

    // Don't render if tab not available for user role
    if (!availableTabs.includes(tab)) {
      return null;
    }

    return (
      <button
        onClick={handleTabClick}
        disabled={loadingTab}
        className={`px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 ${activeTab === tab ? "text-white" : "hover:bg-gray-100"
          }`}
        style={activeTab === tab ? {backgroundColor: '#3b954b'} : {color: '#3b954b'}}
      >
        {tab === 'block' ? t('reports.blockReport') : tab === 'district' ? t('reports.districtReport') : tab === 'vidhansabha' ? t('reports.vidhansabha') : t('reports.loksabha')}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 mt-[12vh] md:mt-[20vh]">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-8" style={{color: '#3b954b'}}>{t('reports.title')}</h1>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {availableTabs.map(tab => (
            <TabButton key={tab} tab={tab} />
          ))}
        </div>

        <div className="min-h-[500px]">
          {loadingTab ? (
            <FullPageLoader message={t('reports.loading')} />
          ) : (
            <>
              {activeTab === "block" && <BlockReportPage />}
              {activeTab === "district" && <DistrictReportPage />}
              {activeTab === "vidhansabha" && (
                <div className="text-center py-20">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-xl border border-yellow-200">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('reports.vidhansabha')}</h3>
                    <p className="text-gray-500">{t('reports.vidhansabhaDesc')}</p>
                  </div>
                </div>
              )}
              {activeTab === "loksabha" && (
                <div className="text-center py-20">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('reports.loksabha')}</h3>
                    <p className="text-gray-500">{t('reports.loksabhaDesc')}</p>
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