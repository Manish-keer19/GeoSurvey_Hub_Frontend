
import React, { useEffect, useState } from "react";
import { userService } from "./service/user.service";
import EconomicStatusChart from "./Components/EconomicStatusChart";
import SchemeSpendingAndSavingChart from "./Components/SchemeInfoMediumChart";
import MinisterReachImpactChart from "./Components/MinisterReachImpactChart";
import MinisterYearPerformanceChart from "./Components/MinisterYearPerformanceChart";
import CooperativeSchemesAwareness from "./Components/CooperativeSchemesAwareness";
import BjpGovernmentSatisfactionChart from "./Components/BjpGovernmentSatisfactionChart";

interface Block {
  bolck_Id: number;
  block_name: string;
  Block_Type: "R" | "U";
  [key: string]: number | string | null | undefined;
}

interface District {
  district_id: number;
  district_name: string;
  districtblockmap?: {
    block_vd: Block;
  }[];
}

type TabType = "block" | "district" | "loksabha" | "vishansabha";

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("block");
  const [districts, setDistricts] = useState<District[]>([]);
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedType, setSelectedType] = useState<"ALL" | "R" | "U">("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [blockData, setBlockData] = useState<Block | null>(null);
  const [showBlockData, setShowBlockData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      setError(null);
      const json = await userService.getAllDistrict();
      setDistricts(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict && allBlocks.length > 0) {
      if (selectedType === "ALL") {
        setBlocks(allBlocks);
      } else {
        setBlocks(allBlocks.filter((b) => b.Block_Type === selectedType));
      }
      setSelectedBlock(null);
      setShowBlockData(false);
    }
  }, [selectedType, allBlocks, selectedDistrict]);

  const handleDistrictChange = async (districtId: number) => {
    try {
      setSelectedDistrict(districtId);
      setLoading(true);
      setError(null);
      setSelectedType("ALL");
      setAllBlocks([]);
      setBlocks([]);
      setSelectedBlock(null);
      setShowBlockData(false);

      const json = await userService.getAllBlockByDistrict(districtId);
      if (!json.success) throw new Error(json.message || "Failed to load blocks");
      const fetchedBlocks = json.data.districtblockmap.map(
        (db: any) => db.block_vd
      ) as Block[];

      setAllBlocks(fetchedBlocks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedBlock) {
      const found = blocks.find((b) => b.bolck_Id === selectedBlock);
      setBlockData(found || null);
      setShowBlockData(true);
    }
  };

  const computeSummary = (data: Block) => {
    let decimalSum = 0;
    let decimalCount = 0;
    let percSum = 0;
    let percCount = 0;

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("c") && key !== "c84" && value !== null && value !== undefined) {
        const val = Number(value);
        if (!isNaN(val)) {
          if (val % 1 !== 0) {
            if (val >= 0 && val <= 100) {
              percSum += val;
              percCount++;
            }
          } else {
            decimalSum += val;
            decimalCount++;
          }
        }
      }
    });

    return { decimalSum, decimalCount, percSum, percCount };
  };

  const blockSummary = blockData ? computeSummary(blockData) : null;

  // Responsive tab navigation
  const TabButton: React.FC<{ 
    tab: TabType; 
    currentTab: TabType; 
    onClick: (tab: TabType) => void;
    label: string;
  }> = ({ tab, currentTab, onClick, label }) => (
    <button
      onClick={() => onClick(tab)}
      className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-md font-medium transition-colors text-xs sm:text-sm ${
        currentTab === tab
          ? "bg-indigo-600 text-white"
          : "text-gray-600 hover:text-indigo-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  const LoksabhaReportContent = () => (
   <div className="text-center py-12 sm:py-20">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">Loksabha Report</h2>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">Coming Soon...</p>
    </div>
  );

  const BlockReportContent = () => (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select District:</label>
        <select
          className="w-full p-2 border rounded-md text-sm sm:text-base"
          value={selectedDistrict || ""}
          onChange={(e) => handleDistrictChange(Number(e.target.value))}
        >
          <option value="">-- Choose a District --</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_id}>
              {d.district_name}
            </option>
          ))}
        </select>
      </div>

      {selectedDistrict && allBlocks.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border rounded-md">
          <h3 className="text-lg font-medium mb-3 text-indigo-600 text-center">
            {districts.find(d => d.district_id === selectedDistrict)?.district_name} Block Distribution
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-gray-800 font-semibold text-xs sm:text-sm">Total Blocks</p>
              <p className="text-xl sm:text-2xl text-indigo-600 font-bold">{allBlocks.length}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-gray-800 font-semibold text-xs sm:text-sm">Rural Blocks</p>
              <p className="text-xl sm:text-2xl text-green-600 font-bold">{allBlocks.filter(b => b.Block_Type === "R").length}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-gray-800 font-semibold text-xs sm:text-sm">Urban Blocks</p>
              <p className="text-xl sm:text-2xl text-purple-600 font-bold">{allBlocks.filter(b => b.Block_Type === "U").length}</p>
            </div>
          </div>
        </div>
      )}

      {selectedDistrict && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-center">Select Block Type:</label>
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
            {["ALL", "R", "U"].map((type) => (
              <label key={type} className="flex items-center gap-1 sm:gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="type"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  checked={selectedType === type}
                  onChange={() => setSelectedType(type as "ALL" | "R" | "U")}
                />
                <span className="text-xs sm:text-sm">
                  {type === "R" ? "Rural" : type === "U" ? "Urban" : "All"}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedDistrict && blocks.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Block:</label>
          <select
            className="w-full p-2 border rounded-md text-sm sm:text-base"
            value={selectedBlock || ""}
            onChange={(e) => setSelectedBlock(Number(e.target.value))}
          >
            <option value="">-- Choose a Block --</option>
            {blocks.map((b) => (
              <option key={b.bolck_Id} value={b.bolck_Id}>
                {b.block_name} ({b.Block_Type})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedBlock && (
        <div className="mb-6 text-center">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            Submit
          </button>
        </div>
      )}

      {showBlockData && blockData && (
        <div className="mt-6 sm:mt-8 border-t pt-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-indigo-600">
            Block Details: {blockData.block_name}
          </h2>
          <div className="overflow-x-auto mb-6 -mx-2 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full border border-gray-200 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left font-medium text-gray-700">Attribute</th>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left font-medium text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(blockData)
                    .filter(([k]) => k.startsWith("c"))
                    .sort(([a], [b]) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
                    .map(([key, value]) => (
                      <tr key={key} className="border-t even:bg-gray-50">
                        <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-600 font-medium">{key}</td>
                        <td className="px-2 py-1 sm:px-4 sm:py-2 text-gray-800">{value ?? "N/A"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          
          {blockSummary && (
            <div className="p-3 sm:p-4 bg-gray-50 border rounded-md">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-indigo-600">Block Summary</h3>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <p className="text-gray-800">
                  <strong>Total Decimal Value:</strong> {blockSummary.decimalSum.toLocaleString()} (from {blockSummary.decimalCount} columns)
                </p>
                <p className="text-gray-800">
                  <strong>Total Percentage:</strong> {blockSummary.percSum.toFixed(2)}% (from {blockSummary.percCount} columns)
                </p>
              </div>
            </div>
          )}
            {typeof blockData.c20 !== "undefined" && (
      <EconomicStatusChart
        data={{
         first:{ c20: Number(blockData.c20),
                c21: Number(blockData.c21),
                c22: Number(blockData.c22),
                c23: Number(blockData.c23),
         },
         second:{ 
                  c25: Number(blockData.c25),
                  c26: Number(blockData.c26),
                  c27: Number(blockData.c27),
                  c28: Number(blockData.c28),
        }
       
      }  
      }
      />

      
    )}
    {
      <SchemeSpendingAndSavingChart
  data={{
    first: {
      c31: Number(blockData.c31), // हाँ
      c30: Number(blockData.c30), // परिवार के साथ
      c33: Number(blockData.c33), // नहीं
      c32: Number(blockData.c32), // कभी-कभी
    },
    second: {
      c35: Number(blockData.c35), // हाँ
      c38: Number(blockData.c38), // सोच रही हूँ
      c36:  Number(blockData.c36),  // नहीं
      c37: Number(blockData.c37), // पहले से बचत
    },
  }}
/>
    }
    {
      <MinisterReachImpactChart
  data={{
    first: {
      c40: Number(blockData.c40), // correctName
      c41: Number(blockData.c41), // wrongName
      c42: Number(blockData.c42), // notKnow
      c43: Number(blockData.c43), // noResponse
    },
    second: {
      c45: Number(blockData.c45), // correctName
      c46: Number(blockData.c46), // wrongName
      c47: Number(blockData.c47), // notKnow
      c48: Number(blockData.c48), // noResponse
    },
  }}
/>
    }
    {
      <MinisterYearPerformanceChart
  data={{
    first: {
      c51: Number(blockData.c51), // बहुत अच्छा
      c50: Number(blockData.c50), // अच्छा
      c52: Number(blockData.c52), // ख़राब
      c53: Number(blockData.c53), // कोई प्रतिक्रिया नहीं
    },
    second: {
      c57: Number(blockData.c57), // बहुत अच्छा
      c56: Number(blockData.c56), // अच्छा
      c58: Number(blockData.c58), // ख़राब
      c59: Number(blockData.c59), // कोई प्रतिक्रिया नहीं
    },
  }}
/>
    }

    {
      <CooperativeSchemesAwareness
  data={{
    first: {
      c63: Number(blockData.c63), // अखबार/विज्ञापन
      c62: Number(blockData.c62), // सोशल मीडिया
      c65: Number(blockData.c65), // सरकारी कर्मचारी
      c64: Number(blockData.c64), // परिवार
      c66: Number(blockData.c66), // कोई जानकारी नहीं
    },
    second: {
      c69: Number(blockData.c69),
      c68: Number(blockData.c68),
      c71: Number(blockData.c71),
      c70: Number(blockData.c70),
      c72: Number(blockData.c72),
    },
  }}
/>
    }

    {<BjpGovernmentSatisfactionChart
  data={{
    first: {
      c75: Number(blockData.c75), // कुछ हद तक संतुष्ट
      c74: Number(blockData.c74), // पूरी तरह से संतुष्ट
      c77: Number(blockData.c77), // कुछ हद तक असंतुष्ट
      c76: Number(blockData.c76), // पूरी तरह से असंतुष्ट
    },
    second: {
      c80: Number(blockData.c80),
      c79: Number(blockData.c79),
      c82: Number(blockData.c82),
      c81: Number(blockData.c81),
    },
  }}
/>

    }

        </div>
      )}
    </div>
  );

  const DistrictReportContent = () => (
    <div className="text-center py-12 sm:py-20">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">District Report</h2>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">Coming Soon...</p>
    </div>
  );

  const VishansabhaReportContent = () => (
    <div className="text-center py-12 sm:py-20">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">Vishansabha Report</h2>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">Coming Soon...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-10 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 text-indigo-700">
          Reports Dashboard
        </h1>

        {/* Responsive Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto w-full max-w-md sm:max-w-full">
            <TabButton 
              tab="block" 
              currentTab={activeTab} 
              onClick={setActiveTab}
              label="Block Report"
            />
            <TabButton 
              tab="district" 
              currentTab={activeTab} 
              onClick={setActiveTab}
              label="District Report"
            />
            
            <TabButton 
              tab="vishansabha" 
              currentTab={activeTab} 
              onClick={setActiveTab}
              label="Vishansabha Report"
            />
            <TabButton 
              tab="loksabha" 
              currentTab={activeTab} 
              onClick={setActiveTab}
              label="Loksabha Report"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "block" && <BlockReportContent />}
          {activeTab === "district" && <DistrictReportContent />}
          {activeTab === "loksabha" && <LoksabhaReportContent />}
          {activeTab === "vishansabha" && <VishansabhaReportContent />}
        </div>

        {loading && (
          <div className="text-center mt-6 text-indigo-500 text-sm sm:text-base">Loading...</div>
        )}
        {error && (
          <div className="text-center mt-6 text-red-500 text-sm sm:text-base">Error: {error}</div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;