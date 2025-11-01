// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { userService } from "./service/user.service";
// import EconomicStatusChart from "./Components/EconomicStatusChart";
// import SchemeSpendingAndSavingChart from "./Components/SchemeInfoMediumChart";
// import MinisterReachImpactChart from "./Components/MinisterReachImpactChart";
// import MinisterYearPerformanceChart from "./Components/MinisterYearPerformanceChart";
// import CooperativeSchemesAwareness from "./Components/CooperativeSchemesAwareness";
// import BjpGovernmentSatisfactionChart from "./Components/BjpGovernmentSatisfactionChart";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// interface Block {
//   bolck_Id: number;
//   block_name: string;
//   Block_Type: "R" | "U";
//   [key: string]: number | string | null | undefined;
// }

// interface District {
//   district_id: number;
//   district_name: string;
//   districtblockmap?: { block_vd: Block }[];
// }

// type TabType = "block" | "district" | "loksabha" | "vishansabha";

// const ReportsPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TabType>("block");
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [allBlocks, setAllBlocks] = useState<Block[]>([]);
//   const [blocks, setBlocks] = useState<Block[]>([]);
//   const [selectedType, setSelectedType] = useState<"ALL" | "R" | "U">("ALL");
//   const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
//   const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [blockData, setBlockData] = useState<Block | null>(null);
//   const [showReport, setShowReport] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const reportRef = useRef<HTMLDivElement>(null);

//   // Fetch districts
//   const fetchDistricts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const json = await userService.getAllDistrict();
//       if (!json.success) throw new Error(json.message);
//       setDistricts(json.data);
//     } catch (err: any) {
//       setError(err.message || "Failed to load districts");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDistricts();
//   }, [fetchDistricts]);

//   // Filter blocks by type
//   useEffect(() => {
//     if (selectedDistrict && allBlocks.length > 0) {
//       const filtered = selectedType === "ALL"
//         ? allBlocks
//         : allBlocks.filter(b => b.Block_Type === selectedType);
//       setBlocks(filtered);
//       setSelectedBlock(null);
//       setShowReport(false);
//       setBlockData(null);
//     }
//   }, [selectedType, allBlocks, selectedDistrict]);

//   // Handle district change
//   const handleDistrictChange = async (districtId: number) => {
//     try {
//       setSelectedDistrict(districtId);
//       setLoading(true);
//       setError(null);
//       setSelectedType("ALL");
//       setAllBlocks([]);
//       setBlocks([]);
//       setSelectedBlock(null);
//       setShowReport(false);
//       setBlockData(null);

//       const json = await userService.getAllBlockByDistrict(districtId);
//       if (!json.success) throw new Error(json.message || "Failed to load blocks");
//       const fetchedBlocks = json.data.districtblockmap.map((db: any) => db.block_vd) as Block[];
//       setAllBlocks(fetchedBlocks);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle block selection change
//   const handleBlockChange = (blockId: number) => {
//     setSelectedBlock(blockId);
//     setShowReport(false);
//     setBlockData(null);
//   };

//   // Handle Submit → Show report immediately
//   const handleSubmit = () => {
//     if (selectedBlock) {
//       const found = blocks.find(b => b.bolck_Id === selectedBlock);
//       if (found) {
//         setBlockData(found);
//         setShowReport(true);
//       }
//     }
//   };

//   // Compute summary
//   const computeSummary = (data: Block) => {
//     let decimalSum = 0, decimalCount = 0, percSum = 0, percCount = 0;
//     Object.entries(data).forEach(([key, value]) => {
//       if (key.startsWith("c") && key !== "c84" && value != null) {
//         const val = Number(value);
//         if (!isNaN(val)) {
//           if (val % 1 !== 0 && val >= 0 && val <= 100) {
//             percSum += val; percCount++;
//           } else if (Number.isInteger(val)) {
//             decimalSum += val; decimalCount++;
//           }
//         }
//       }
//     });
//     return { decimalSum, decimalCount, percSum, percCount };
//   };

//   const blockSummary = blockData ? computeSummary(blockData) : null;

//   // Download PDF
//   const downloadPDF = async () => {
//     if (!reportRef.current || !blockData) return;

//     setLoading(true);
//     try {
//       const canvas = await html2canvas(reportRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff',
//       });

//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'px',
//         format: [canvas.width, canvas.height],
//       });

//       pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
//       pdf.save(`${blockData.block_name}_Report.pdf`);
//     } catch (err) {
//       setError("Failed to generate PDF. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tab Button
//   const TabButton: React.FC<{ tab: TabType; label: string }> = ({ tab, label }) => (
//     <button
//       onClick={() => setActiveTab(tab)}
//       className={`px-3 py-2 text-xs sm:text-sm md:text-base font-medium rounded-md transition-all whitespace-nowrap ${
//         activeTab === tab
//           ? "bg-indigo-600 text-white shadow-md"
//           : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
//       }`}
//     >
//       {label}
//     </button>
//   );

//   // Loader Component
//   const Loader = () => (
//     <div className="flex flex-col items-center justify-center py-16 space-y-4">
//       <div className="relative">
//         <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
//         <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
//       </div>
//       <p className="text-indigo-600 font-medium animate-pulse">Loading data, please wait...</p>
//     </div>
//   );

//   const BlockReportContent = () => (
//     <div className="space-y-6">
//       {/* District Select */}
//       <div>
//         <label className="block text-sm font-semibold mb-2 text-gray-700">Select District</label>
//         <select
//           className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//           value={selectedDistrict || ""}
//           onChange={(e) => handleDistrictChange(Number(e.target.value))}
//           disabled={loading}
//         >
//           <option value="">-- Choose District --</option>
//           {districts.map(d => (
//             <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
//           ))}
//         </select>
//       </div>

//       {/* Show loader when fetching blocks */}
//       {loading && selectedDistrict && <Loader />}

//       {/* Block Stats */}
//       {selectedDistrict && allBlocks.length > 0 && !loading && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
//           {[
//             { label: "Total", value: allBlocks.length, color: "indigo" },
//             { label: "Rural", value: allBlocks.filter(b => b.Block_Type === "R").length, color: "green" },
//             { label: "Urban", value: allBlocks.filter(b => b.Block_Type === "U").length, color: "purple" },
//           ].map((stat, i) => (
//             <div key={i} className="text-center p-3 bg-white rounded-lg shadow">
//               <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
//               <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Block Type */}
//       {selectedDistrict && allBlocks.length > 0 && !loading && (
//         <div className="flex justify-center gap-4 flex-wrap">
//           {(["ALL", "R", "U"] as const).map(type => (
//             <label key={type} className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="type"
//                 checked={selectedType === type}
//                 onChange={() => setSelectedType(type)}
//                 className="w-4 h-4 text-indigo-600"
//               />
//               <span className="text-sm font-medium">
//                 {type === "ALL" ? "All" : type === "R" ? "Rural" : "Urban"}
//               </span>
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Block Select */}
//       {blocks.length > 0 && !loading && (
//         <div>
//           <label className="block text-sm font-semibold mb-2 text-gray-700">Select Block</label>
//           <select
//             className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//             value={selectedBlock || ""}
//             onChange={(e) => handleBlockChange(Number(e.target.value))}
//           >
//             <option value="">-- Choose Block --</option>
//             {blocks.map(b => (
//               <option key={b.bolck_Id} value={b.bolck_Id}>
//                 {b.block_name} ({b.Block_Type})
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Submit Button */}
//       {selectedBlock && !loading && (
//         <div className="text-center">
//           <button
//             onClick={handleSubmit}
//             className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all font-medium"
//             disabled={loading}
//           >
//             Submit & View Report
//           </button>
//         </div>
//       )}

//       {/* Report Content */}
//       {showReport && blockData && (
//         <div ref={reportRef} className="space-y-8 bg-white p-6 rounded-xl shadow-lg border">
//           <div className="text-center border-b pb-4">
//             <h2 className="text-2xl font-bold text-indigo-700">{blockData.block_name} - Analytics Report</h2>
//             <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
//           </div>

//           {/* Summary */}
//           {blockSummary && (
//             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
//               <h3 className="font-bold text-indigo-700 mb-2">Summary</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                 <p><strong>Decimal Sum:</strong> {blockSummary.decimalSum.toLocaleString()} ({blockSummary.decimalCount} fields)</p>
//                 <p><strong>Percentage Sum:</strong> {blockSummary.percSum.toFixed(2)}% ({blockSummary.percCount} fields)</p>
//               </div>
//             </div>
//           )}

//           {/* Charts */}
//           <div className="space-y-12">
//             {blockData.c20 !== undefined && <EconomicStatusChart data={{
//               first: { c20: Number(blockData.c20), c21: Number(blockData.c21), c22: Number(blockData.c22), c23: Number(blockData.c23) },
//               second: { c25: Number(blockData.c25), c26: Number(blockData.c26), c27: Number(blockData.c27), c28: Number(blockData.c28) }
//             }} />}

//             <SchemeSpendingAndSavingChart data={{
//               first: { c31: Number(blockData.c31), c30: Number(blockData.c30), c33: Number(blockData.c33), c32: Number(blockData.c32) },
//               second: { c35: Number(blockData.c35), c38: Number(blockData.c38), c36: Number(blockData.c36), c37: Number(blockData.c37) }
//             }} />

//             <MinisterReachImpactChart data={{
//               first: { c40: Number(blockData.c40), c41: Number(blockData.c41), c42: Number(blockData.c42), c43: Number(blockData.c43) },
//               second: { c45: Number(blockData.c45), c46: Number(blockData.c46), c47: Number(blockData.c47), c48: Number(blockData.c48) }
//             }} />

//             <MinisterYearPerformanceChart data={{
//               first: { c51: Number(blockData.c51), c50: Number(blockData.c50), c52: Number(blockData.c52), c53: Number(blockData.c53) },
//               second: { c57: Number(blockData.c57), c56: Number(blockData.c56), c58: Number(blockData.c58), c59: Number(blockData.c59) }
//             }} />

//             <CooperativeSchemesAwareness data={{
//               first: { c63: Number(blockData.c63), c62: Number(blockData.c62), c65: Number(blockData.c65), c64: Number(blockData.c64), c66: Number(blockData.c66) },
//               second: { c69: Number(blockData.c69), c68: Number(blockData.c68), c71: Number(blockData.c71), c70: Number(blockData.c70), c72: Number(blockData.c72) }
//             }} />

//             <BjpGovernmentSatisfactionChart data={{
//               first: { c75: Number(blockData.c75), c74: Number(blockData.c74), c77: Number(blockData.c77), c76: Number(blockData.c76) },
//               second: { c80: Number(blockData.c80), c79: Number(blockData.c79), c82: Number(blockData.c82), c81: Number(blockData.c81) }
//             }} />
//           </div>

//           {/* PDF Button */}
//           <div className="text-center pt-6 border-t">
//             <button
//               onClick={downloadPDF}
//               disabled={loading}
//               className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
//             >
//               {loading ? "Generating PDF..." : "Download PDF"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-[12vh] md:mt-[20vh]">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-indigo-700">
//             Reports Dashboard
//           </h1>

//           {/* Tabs */}
//           <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-100 p-2 rounded-xl w-fit mx-auto">
//             <TabButton tab="block" label="Block" />
//             <TabButton tab="district" label="District" />
//             <TabButton tab="vishansabha" label="Vidhan Sabha" />
//             <TabButton tab="loksabha" label="Lok Sabha" />
//           </div>

//           {/* Content */}
//           <div className="min-h-[400px]">
//             {activeTab === "block" && (
//               <>
//                 {loading && districts.length === 0 ? <Loader /> : <BlockReportContent />}
//               </>
//             )}
//             {activeTab === "district" && <div className="text-center py-20 text-gray-500">Coming Soon...</div>}
//             {activeTab === "vishansabha" && <div className="text-center py-20 text-gray-500">Coming Soon...</div>}
//             {activeTab === "loksabha" && <div className="text-center py-20 text-gray-500">Coming Soon...</div>}
//           </div>

//           {/* Global Messages */}
//           {error && <p className="text-center text-red-600 mt-6">{error}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsPage;








import React, { useEffect, useState, useRef } from "react";
import { userService } from "./service/user.service";
import EconomicStatusChart from "./Components/EconomicStatusChart";
import SchemeSpendingAndSavingChart from "./Components/SchemeInfoMediumChart";
import MinisterReachImpactChart from "./Components/MinisterReachImpactChart";
import MinisterYearPerformanceChart from "./Components/MinisterYearPerformanceChart";
import CooperativeSchemesAwareness from "./Components/CooperativeSchemesAwareness";
import BjpGovernmentSatisfactionChart from "./Components/BjpGovernmentSatisfactionChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

interface Block {
  bolck_Id: number;
  block_name: string;
  Block_Type: "R" | "U";
  [key: string]: any;
}

interface District {
  district_id: number;
  district_name: string;
}

interface DistrictReport {
  district_id: number;
  district_name: string;
  type: "ALL" | "R" | "U";
  blockCount: number;
  aggregated: Record<string, number>;
}

type TabType = "block" | "district";

const ReportsPage: React.FC = () => {

  const token = useSelector((state: any) => state.auth.token);
  const [activeTab, setActiveTab] = useState<TabType>("block");
  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"ALL" | "R" | "U">("ALL");

  const [blockData, setBlockData] = useState<Block | null>(null);
  const [districtReport, setDistrictReport] = useState<DistrictReport | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch districts
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      if(!token){
        toast.error("token not found");
        return;
      }
      try {
        const res = await userService.getAllDistrict(token);
        if (res.success) setDistricts(res.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // === BLOCK TAB: Load blocks when district changes ===
  const handleDistrictChange = async (districtId: number) => {
    setSelectedDistrict(districtId);
    setSelectedBlock(null);
    setBlockData(null);
    setBlocks([]);
    setLoading(true);
    try {
      const res = await userService.getDistrictMeta(districtId,token);
      if (res.success) setBlocks(res.data.blocks);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // === BLOCK TAB: Submit → fetch full block data ===
  const handleBlockSubmit = async () => {
    if (!selectedBlock) return;
    setLoading(true);
    setBlockData(null);
    try {
      const res = await userService.getBlockById(selectedBlock,token);
      if (res.success) setBlockData(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // === DISTRICT TAB: Auto-fetch report when district or type changes ===
  useEffect(() => {
    if (activeTab !== "district" || !selectedDistrict) return;

    const fetchReport = async () => {
      setLoading(true);
      setDistrictReport(null);
      try {
        const res = await userService.getDistrictReport(selectedDistrict,token,selectedType);
        if (res.success) setDistrictReport(res.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedDistrict, selectedType, activeTab]);

  // PDF Download
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${activeTab === "block" ? blockData?.block_name : "District"}_${selectedType}_Report.pdf`);
    } catch {
      setError("PDF generation failed");
    } finally {
      setLoading(false);
    }
  };

  // Summary
  const computeSummary = (data: Record<string, any>) => {
    let decSum = 0, decCnt = 0, percSum = 0, percCnt = 0;
    Object.entries(data).forEach(([k, v]) => {
      if (k.startsWith("c") && k !== "c84" && typeof v === "number") {
        if (v % 1 !== 0 && v >= 0 && v <= 100) { percSum += v; percCnt++; }
        else if (Number.isInteger(v)) { decSum += v; decCnt++; }
      }
    });
    return { decSum, decCnt, percSum, percCnt };
  };

  const blockSummary = blockData ? computeSummary(blockData) : null;
  const districtSummary = districtReport ? computeSummary(districtReport.aggregated) : null;

  const Loader = () => (
    <div className="flex flex-col items-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-indigo-600 font-medium animate-pulse">Loading report...</p>
    </div>
  );

  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-md font-medium transition-all ${
        activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 mt-[12vh] md:mt-[20vh]">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Reports Dashboard</h1>

        <div className="flex justify-center gap-4 mb-8">
          <TabButton tab="block" label="Block Report" />
          <TabButton tab="district" label="District Report" />
        </div>

        {/* ====== BLOCK TAB ====== */}
        {activeTab === "block" && (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Select District</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={selectedDistrict || ""}
                onChange={(e) => handleDistrictChange(Number(e.target.value))}
                disabled={loading}
              >
                <option value="">-- Choose --</option>
                {districts.map(d => (
                  <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
                ))}
              </select>
            </div>

            {selectedDistrict && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Select Block</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={selectedBlock || ""}
                    onChange={(e) => setSelectedBlock(Number(e.target.value))}
                  >
                    <option value="">-- Choose Block --</option>
                    {blocks.map(b => (
                      <option key={b.bolck_Id} value={b.bolck_Id}>
                        {b.block_name} ({b.Block_Type})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleBlockSubmit}
                  disabled={!selectedBlock || loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Submit & View Report"}
                </button>
              </>
            )}

            {loading && <Loader />}

            {blockData && !loading && (
              <div ref={reportRef} className="bg-white p-6 rounded-xl shadow-lg border space-y-10">
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold text-indigo-700">{blockData.block_name}</h2>
                  <p>Generated: {new Date().toLocaleDateString()}</p>
                </div>

                {blockSummary && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p><strong>Decimal Sum:</strong> {blockSummary.decSum} ({blockSummary.decCnt} fields)</p>
                    <p><strong>Avg %:</strong> {blockSummary.percCnt > 0 ? (blockSummary.percSum / blockSummary.percCnt).toFixed(2) : 0}%</p>
                  </div>
                )}

                {/* === ALL 6 CHARTS === */}
                <div className="space-y-12">
                  {/* 1. Economic Status */}
                  <EconomicStatusChart data={{
                    first: {
                      c20: Number(blockData.c20) || 0,
                      c21: Number(blockData.c21) || 0,
                      c22: Number(blockData.c22) || 0,
                      c23: Number(blockData.c23) || 0,
                    },
                    second: {
                      c25: Number(blockData.c25) || 0,
                      c26: Number(blockData.c26) || 0,
                      c27: Number(blockData.c27) || 0,
                      c28: Number(blockData.c28) || 0,
                    },
                  }} />

                  {/* 2. Scheme Spending & Saving */}
                  <SchemeSpendingAndSavingChart data={{
                    first: {
                      c31: Number(blockData.c31) || 0,
                      c30: Number(blockData.c30) || 0,
                      c33: Number(blockData.c33) || 0,
                      c32: Number(blockData.c32) || 0,
                    },
                    second: {
                      c35: Number(blockData.c35) || 0,
                      c38: Number(blockData.c38) || 0,
                      c36: Number(blockData.c36) || 0,
                      c37: Number(blockData.c37) || 0,
                    },
                  }} />

                  {/* 3. Minister Reach Impact */}
                  <MinisterReachImpactChart data={{
                    first: {
                      c40: Number(blockData.c40) || 0,
                      c41: Number(blockData.c41) || 0,
                      c42: Number(blockData.c42) || 0,
                      c43: Number(blockData.c43) || 0,
                    },
                    second: {
                      c45: Number(blockData.c45) || 0,
                      c46: Number(blockData.c46) || 0,
                      c47: Number(blockData.c47) || 0,
                      c48: Number(blockData.c48) || 0,
                    },
                  }} />

                  {/* 4. Minister Year Performance */}
                  <MinisterYearPerformanceChart data={{
                    first: {
                      c51: Number(blockData.c51) || 0,
                      c50: Number(blockData.c50) || 0,
                      c52: Number(blockData.c52) || 0,
                      c53: Number(blockData.c53) || 0,
                    },
                    second: {
                      c57: Number(blockData.c57) || 0,
                      c56: Number(blockData.c56) || 0,
                      c58: Number(blockData.c58) || 0,
                      c59: Number(blockData.c59) || 0,
                    },
                  }} />

                  {/* 5. Cooperative Schemes Awareness */}
                  <CooperativeSchemesAwareness data={{
                    first: {
                      c63: Number(blockData.c63) || 0,
                      c62: Number(blockData.c62) || 0,
                      c65: Number(blockData.c65) || 0,
                      c64: Number(blockData.c64) || 0,
                      c66: Number(blockData.c66) || 0,
                    },
                    second: {
                      c69: Number(blockData.c69) || 0,
                      c68: Number(blockData.c68) || 0,
                      c71: Number(blockData.c71) || 0,
                      c70: Number(blockData.c70) || 0,
                      c72: Number(blockData.c72) || 0,
                    },
                  }} />

                  {/* 6. BJP Government Satisfaction */}
                  <BjpGovernmentSatisfactionChart data={{
                    first: {
                      c75: Number(blockData.c75) || 0,
                      c74: Number(blockData.c74) || 0,
                      c77: Number(blockData.c77) || 0,
                      c76: Number(blockData.c76) || 0,
                    },
                    second: {
                      c80: Number(blockData.c80) || 0,
                      c79: Number(blockData.c79) || 0,
                      c82: Number(blockData.c82) || 0,
                      c81: Number(blockData.c81) || 0,
                    },
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====== DISTRICT TAB ====== */}
        {activeTab === "district" && (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Select District</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={selectedDistrict || ""}
                onChange={(e) => setSelectedDistrict(Number(e.target.value))}
                disabled={loading}
              >
                <option value="">-- Choose --</option>
                {districts.map(d => (
                  <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
                ))}
              </select>
            </div>

            {selectedDistrict && (
              <div className="flex justify-center gap-6">
                {(["ALL", "R", "U"] as const).map(t => (
                  <label key={t} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      checked={selectedType === t}
                      onChange={() => setSelectedType(t)}
                      className="text-indigo-600"
                    />
                    <span>{t === "ALL" ? "All" : t === "R" ? "Rural" : "Urban"}</span>
                  </label>
                ))}
              </div>
            )}

            {loading && <Loader />}

            {districtReport && !loading && (
              <div ref={reportRef} className="bg-white p-6 rounded-xl shadow-lg border space-y-10">
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold text-indigo-700">
                    {districtReport.district_name} ({selectedType})
                  </h2>
                  <p>Blocks: {districtReport.blockCount} | {new Date().toLocaleDateString()}</p>
                </div>

                {districtSummary && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p><strong>Decimal Sum:</strong> {districtSummary.decSum}</p>
                    <p><strong>Avg %:</strong> {districtSummary.percCnt > 0 ? (districtSummary.percSum / districtSummary.percCnt).toFixed(2) : 0}%</p>
                  </div>
                )}

                {/* === ALL 6 CHARTS (Aggregated) === */}
                <div className="space-y-12">
                  <EconomicStatusChart data={{
                    first: {
                      c20: Number(districtReport.aggregated.c20) || 0,
                      c21: Number(districtReport.aggregated.c21) || 0,
                      c22: Number(districtReport.aggregated.c22) || 0,
                      c23: Number(districtReport.aggregated.c23) || 0,
                    },
                    second: {
                      c25: Number(districtReport.aggregated.c25) || 0,
                      c26: Number(districtReport.aggregated.c26) || 0,
                      c27: Number(districtReport.aggregated.c27) || 0,
                      c28: Number(districtReport.aggregated.c28) || 0,
                    },
                  }} />

                  <SchemeSpendingAndSavingChart data={{
                    first: {
                      c31: Number(districtReport.aggregated.c31) || 0,
                      c30: Number(districtReport.aggregated.c30) || 0,
                      c33: Number(districtReport.aggregated.c33) || 0,
                      c32: Number(districtReport.aggregated.c32) || 0,
                    },
                    second: {
                      c35: Number(districtReport.aggregated.c35) || 0,
                      c38: Number(districtReport.aggregated.c38) || 0,
                      c36: Number(districtReport.aggregated.c36) || 0,
                      c37: Number(districtReport.aggregated.c37) || 0,
                    },
                  }} />

                  <MinisterReachImpactChart data={{
                    first: {
                      c40: Number(districtReport.aggregated.c40) || 0,
                      c41: Number(districtReport.aggregated.c41) || 0,
                      c42: Number(districtReport.aggregated.c42) || 0,
                      c43: Number(districtReport.aggregated.c43) || 0,
                    },
                    second: {
                      c45: Number(districtReport.aggregated.c45) || 0,
                      c46: Number(districtReport.aggregated.c46) || 0,
                      c47: Number(districtReport.aggregated.c47) || 0,
                      c48: Number(districtReport.aggregated.c48) || 0,
                    },
                  }} />

                  <MinisterYearPerformanceChart data={{
                    first: {
                      c51: Number(districtReport.aggregated.c51) || 0,
                      c50: Number(districtReport.aggregated.c50) || 0,
                      c52: Number(districtReport.aggregated.c52) || 0,
                      c53: Number(districtReport.aggregated.c53) || 0,
                    },
                    second: {
                      c57: Number(districtReport.aggregated.c57) || 0,
                      c56: Number(districtReport.aggregated.c56) || 0,
                      c58: Number(districtReport.aggregated.c58) || 0,
                      c59: Number(districtReport.aggregated.c59) || 0,
                    },
                  }} />

                  <CooperativeSchemesAwareness data={{
                    first: {
                      c63: Number(districtReport.aggregated.c63) || 0,
                      c62: Number(districtReport.aggregated.c62) || 0,
                      c65: Number(districtReport.aggregated.c65) || 0,
                      c64: Number(districtReport.aggregated.c64) || 0,
                      c66: Number(districtReport.aggregated.c66) || 0,
                    },
                    second: {
                      c69: Number(districtReport.aggregated.c69) || 0,
                      c68: Number(districtReport.aggregated.c68) || 0,
                      c71: Number(districtReport.aggregated.c71) || 0,
                      c70: Number(districtReport.aggregated.c70) || 0,
                      c72: Number(districtReport.aggregated.c72) || 0,
                    },
                  }} />

                  <BjpGovernmentSatisfactionChart data={{
                    first: {
                      c75: Number(districtReport.aggregated.c75) || 0,
                      c74: Number(districtReport.aggregated.c74) || 0,
                      c77: Number(districtReport.aggregated.c77) || 0,
                      c76: Number(districtReport.aggregated.c76) || 0,
                    },
                    second: {
                      c80: Number(districtReport.aggregated.c80) || 0,
                      c79: Number(districtReport.aggregated.c79) || 0,
                      c82: Number(districtReport.aggregated.c82) || 0,
                      c81: Number(districtReport.aggregated.c81) || 0,
                    },
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* PDF Button */}
        {(blockData || districtReport) && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={downloadPDF}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all font-medium"
            >
              Download PDF
            </button>
          </div>
        )}

        {error && <p className="text-red-600 text-center mt-6">{error}</p>}
      </div>
    </div>
  );
};

export default ReportsPage;
