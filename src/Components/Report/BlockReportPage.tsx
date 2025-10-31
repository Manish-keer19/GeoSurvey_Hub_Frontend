// import React, { useState, useRef } from "react";
// import { userService } from "../../service/user.service";
// import { DistrictSelect } from "./DistrictSelect";
// import { ReportLayout } from "./ReportLayout";
// import { ChartSection } from "./ChartSection";
// import EconomicStatusChart from "../../Components/EconomicStatusChart";
// import SchemeSpendingAndSavingChart from "../SchemeInfoMediumChart";
// import MinisterReachImpactChart from "../MinisterReachImpactChart";
// import MinisterYearPerformanceChart from "../../Components/MinisterYearPerformanceChart";
// import CooperativeSchemesAwareness from "../../Components/CooperativeSchemesAwareness";
// import BjpGovernmentSatisfactionChart from "../../Components/BjpGovernmentSatisfactionChart";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// interface Block {
//   bolck_Id: number;
//   block_name: string;
//   Block_Type: "R" | "U";
//   [key: string]: any;
// }

// export const BlockReportPage: React.FC = () => {
//   const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
//   const [allBlocks, setAllBlocks] = useState<Block[]>([]);
//   const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
//   const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
//   const [blockData, setBlockData] = useState<Block | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [blockType, setBlockType] = useState<"ALL" | "R" | "U">("ALL");
//   const reportRef = useRef<HTMLDivElement>(null);

//   // Load blocks when district changes
//   const handleDistrictChange = async (id: number) => {
//     setSelectedDistrict(id);
//     setSelectedBlock(null);
//     setBlockData(null);
//     setAllBlocks([]);
//     setFilteredBlocks([]);
//     setLoading(true);
//     try {
//       const res = await userService.getDistrictMeta(id);
//       if (res.success) {
//         const blocks = res.data.blocks;
//         setAllBlocks(blocks);
//         filterBlocks(blocks, blockType);
//       }
//     } catch (err) {
//       console.error("Failed to load blocks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter blocks by type
//   const filterBlocks = (blocks: Block[], type: "ALL" | "R" | "U") => {
//     if (type === "ALL") {
//       setFilteredBlocks(blocks);
//     } else {
//       setFilteredBlocks(blocks.filter((b) => b.Block_Type === type));
//     }
//   };

//   // Re-filter when type changes
//   React.useEffect(() => {
//     if (allBlocks.length > 0) {
//       filterBlocks(allBlocks, blockType);
//     }
//     setSelectedBlock(null);
//     setBlockData(null);
//   }, [blockType, allBlocks]);

//   const handleSubmit = async () => {
//     if (!selectedBlock) return;
//     setLoading(true);
//     try {
//       const res = await userService.getBlockById(selectedBlock);
//       if (res.success) setBlockData(res.data);
//     } catch (err) {
//       console.error("Failed to load block data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = async () => {
//     if (!reportRef.current || !blockData) return;
//     setLoading(true);
//     try {
//       const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
//       const img = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
//       pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
//       pdf.save(`${blockData.block_name}_Report.pdf`);
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Stats
//   const totalBlocks = allBlocks.length;
//   const ruralCount = allBlocks.filter((b) => b.Block_Type === "R").length;
//   const urbanCount = allBlocks.filter((b) => b.Block_Type === "U").length;

//   return (
//     <div className="space-y-6">
//       {/* District Select */}
//       <DistrictSelect selected={selectedDistrict} onChange={handleDistrictChange} />

//       {/* Block Type Filter + Stats */}
//       {selectedDistrict && allBlocks.length > 0 && (
//         <div className="space-y-4">
//           {/* Type Filter */}
//           <div className="flex justify-center gap-6">
//             {(["ALL", "R", "U"] as const).map((t) => (
//               <label key={t} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="blockType"
//                   checked={blockType === t}
//                   onChange={() => setBlockType(t)}
//                   className="text-indigo-600"
//                 />
//                 <span className="text-sm font-medium">
//                   {t === "ALL" ? "All" : t === "R" ? "Rural" : "Urban"}
//                 </span>
//               </label>
//             ))}
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
//             {[
//               { label: "Total Blocks", value: totalBlocks, color: "indigo" },
//               { label: "Rural", value: ruralCount, color: "green" },
//               { label: "Urban", value: urbanCount, color: "purple" },
//             ].map((stat, i) => (
//               <div key={i} className="text-center p-3 bg-white rounded-lg shadow">
//                 <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
//                 <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Block Select */}
//       {filteredBlocks.length > 0 && (
//         <select
//           className="w-full p-3 border rounded-lg"
//           value={selectedBlock || ""}
//           onChange={(e) => setSelectedBlock(Number(e.target.value))}
//         >
//           <option value="">-- Select Block --</option>
//           {filteredBlocks.map((b) => (
//             <option key={b.bolck_Id} value={b.bolck_Id}>
//               {b.block_name} ({b.Block_Type})
//             </option>
//           ))}
//         </select>
//       )}

//       {/* Submit Button */}
//       {selectedBlock && (
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
//         >
//           {loading ? "Loading Report..." : "View Report"}
//         </button>
//       )}

//       {/* Loading */}
//       {loading && !blockData && (
//         <p className="text-center text-indigo-600 font-medium animate-pulse">
//           Loading...
//         </p>
//       )}

//       {/* Report */}
//       {blockData && (
//         <div ref={reportRef}>
//           <ReportLayout
//             title={`${blockData.block_name} - Block Report`}
//             subtitle={`Generated: ${new Date().toLocaleDateString()}`}
//             onDownload={downloadPDF}
//             loading={loading}
//           >
//             <div className="space-y-12">

//               {/* 1. Economic Status */}
//               <ChartSection title="Economic Status">
//                 <EconomicStatusChart data={{
//                   first: {
//                     c20: Number(blockData.c20) || 0,
//                     c21: Number(blockData.c21) || 0,
//                     c22: Number(blockData.c22) || 0,
//                     c23: Number(blockData.c23) || 0,
//                   },
//                   second: {
//                     c25: Number(blockData.c25) || 0,
//                     c26: Number(blockData.c26) || 0,
//                     c27: Number(blockData.c27) || 0,
//                     c28: Number(blockData.c28) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               {/* 2. Scheme Spending & Saving */}
//               <ChartSection title="Scheme Spending & Saving">
//                 <SchemeSpendingAndSavingChart data={{
//                   first: {
//                     c31: Number(blockData.c31) || 0,
//                     c30: Number(blockData.c30) || 0,
//                     c33: Number(blockData.c33) || 0,
//                     c32: Number(blockData.c32) || 0,
//                   },
//                   second: {
//                     c35: Number(blockData.c35) || 0,
//                     c38: Number(blockData.c38) || 0,
//                     c36: Number(blockData.c36) || 0,
//                     c37: Number(blockData.c37) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               {/* 3. Minister Reach Impact */}
//               <ChartSection title="Minister Reach Impact">
//                 <MinisterReachImpactChart data={{
//                   first: {
//                     c40: Number(blockData.c40) || 0,
//                     c41: Number(blockData.c41) || 0,
//                     c42: Number(blockData.c42) || 0,
//                     c43: Number(blockData.c43) || 0,
//                   },
//                   second: {
//                     c45: Number(blockData.c45) || 0,
//                     c46: Number(blockData.c46) || 0,
//                     c47: Number(blockData.c47) || 0,
//                     c48: Number(blockData.c48) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               {/* 4. Minister Year Performance */}
//               <ChartSection title="Minister Year Performance">
//                 <MinisterYearPerformanceChart data={{
//                   first: {
//                     c51: Number(blockData.c51) || 0,
//                     c50: Number(blockData.c50) || 0,
//                     c52: Number(blockData.c52) || 0,
//                     c53: Number(blockData.c53) || 0,
//                   },
//                   second: {
//                     c57: Number(blockData.c57) || 0,
//                     c56: Number(blockData.c56) || 0,
//                     c58: Number(blockData.c58) || 0,
//                     c59: Number(blockData.c59) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               {/* 5. Cooperative Schemes Awareness */}
//               <ChartSection title="Cooperative Schemes Awareness">
//                 <CooperativeSchemesAwareness data={{
//                   first: {
//                     c63: Number(blockData.c63) || 0,
//                     c62: Number(blockData.c62) || 0,
//                     c65: Number(blockData.c65) || 0,
//                     c64: Number(blockData.c64) || 0,
//                     c66: Number(blockData.c66) || 0,
//                   },
//                   second: {
//                     c69: Number(blockData.c69) || 0,
//                     c68: Number(blockData.c68) || 0,
//                     c71: Number(blockData.c71) || 0,
//                     c70: Number(blockData.c70) || 0,
//                     c72: Number(blockData.c72) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               {/* 6. BJP Government Satisfaction */}
//               <ChartSection title="BJP Government Satisfaction">
//                 <BjpGovernmentSatisfactionChart data={{
//                   first: {
//                     c75: Number(blockData.c75) || 0,
//                     c74: Number(blockData.c74) || 0,
//                     c77: Number(blockData.c77) || 0,
//                     c76: Number(blockData.c76) || 0,
//                   },
//                   second: {
//                     c80: Number(blockData.c80) || 0,
//                     c79: Number(blockData.c79) || 0,
//                     c82: Number(blockData.c82) || 0,
//                     c81: Number(blockData.c81) || 0,
//                   },
//                 }} />
//               </ChartSection>

//             </div>
//           </ReportLayout>
//         </div>
//       )}
//     </div>
//   );
// };






import React, { useState, useRef, useMemo } from "react";
import { userService } from "../../service/user.service";
import { DistrictSelect } from "./DistrictSelect";
import { ReportLayout } from "./ReportLayout";
import { ChartSection } from "./ChartSection";
import { FullPageLoader, ButtonLoader, BlockFetchingLoader } from "./LoaderComponents";
import { ErrorMessage } from "./ErrorComponents";
import EconomicStatusChart from "../../Components/EconomicStatusChart";
import SchemeSpendingAndSavingChart from "../SchemeInfoMediumChart";
import MinisterReachImpactChart from "../MinisterReachImpactChart";
import MinisterYearPerformanceChart from "../../Components/MinisterYearPerformanceChart";
import CooperativeSchemesAwareness from "../../Components/CooperativeSchemesAwareness";
import BjpGovernmentSatisfactionChart from "../../Components/BjpGovernmentSatisfactionChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Block {
  bolck_Id: number;
  block_name: string;
  Block_Type: "R" | "U";
  [key: string]: any;
}

export const BlockReportPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [selectedBlockName, setSelectedBlockName] = useState<string>("");
  const [blockData, setBlockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [blockType, setBlockType] = useState<"ALL" | "R" | "U">("ALL");
  const [blocksError, setBlocksError] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Load blocks
  const handleDistrictChange = async (id: number) => {
    setSelectedDistrict(id);
    setSelectedBlockName("");
    setBlockData(null);
    setAllBlocks([]);
    setFilteredBlocks([]);
    setBlocksError(null);
    setLoadingBlocks(true);
    try {
      const res = await userService.getDistrictMeta(id);
      if (res.success) {
        const blocks = res.data.blocks;
        setAllBlocks(blocks);
        filterBlocks(blocks, blockType);
      } else {
        setBlocksError("Failed to load blocks for selected district");
      }
    } catch (err) {
      setBlocksError("Network error while loading blocks");
    } finally {
      setLoadingBlocks(false);
    }
  };

  const filterBlocks = (blocks: Block[], type: "ALL" | "R" | "U") => {
    if (type === "ALL") {
      setFilteredBlocks(blocks);
    } else {
      setFilteredBlocks(blocks.filter((b) => b.Block_Type === type));
    }
  };

  React.useEffect(() => {
    if (allBlocks.length > 0) {
      filterBlocks(allBlocks, blockType);
    }
    setSelectedBlockName("");
    setBlockData(null);
    setReportError(null);
  }, [blockType, allBlocks]);

  // === GROUP BLOCKS BY CLEAN NAME ===
  const groupedBlockNames = useMemo(() => {
    const map = new Map<string, Block[]>();
    filteredBlocks.forEach(b => {
      const cleanName = b.block_name.replace(/\s*\([RU]\)$/, "").trim();
      if (!map.has(cleanName)) map.set(cleanName, []);
      map.get(cleanName)!.push(b);
    });
    return Array.from(map.keys()).sort();
  }, [filteredBlocks]);

  // === SUBMIT: Send block name to backend ===
  const handleSubmit = async () => {
    if (!selectedBlockName) return;
    setLoadingReport(true);
    setReportError(null);
    try {
      const res = await userService.getCombinedBlockReport(selectedBlockName, selectedDistrict!);
      if (res.success) {
        setBlockData(res.data);
      } else {
        setReportError("Failed to generate report for selected block");
      }
    } catch (err) {
      setReportError("Network error while generating report");
    } finally {
      setLoadingReport(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current || !blockData) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${blockData.block_name}_Report.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalBlocks = allBlocks.length;
  const ruralCount = allBlocks.filter((b) => b.Block_Type === "R").length;
  const urbanCount = allBlocks.filter((b) => b.Block_Type === "U").length;

  return (
    <div className="space-y-6">
      <DistrictSelect selected={selectedDistrict} onChange={handleDistrictChange} />

      {/* Loading blocks */}
      {loadingBlocks && <BlockFetchingLoader />}
      
      {/* Blocks error */}
      {blocksError && (
        <ErrorMessage 
          message={blocksError} 
          onRetry={() => selectedDistrict && handleDistrictChange(selectedDistrict)} 
        />
      )}

      {selectedDistrict && allBlocks.length > 0 && !loadingBlocks && (
        <div className="space-y-4">
          <div className="flex justify-center gap-6">
            {(["ALL", "R", "U"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="blockType"
                  checked={blockType === t}
                  onChange={() => setBlockType(t)}
                  className="text-indigo-600"
                />
                <span className="text-sm font-medium">
                  {t === "ALL" ? "All" : t === "R" ? "Rural" : "Urban"}
                </span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            {[
              { label: "Total Blocks", value: totalBlocks, color: "indigo" },
              { label: "Rural", value: ruralCount, color: "green" },
              { label: "Urban", value: urbanCount, color: "purple" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCK SELECT – ONLY CLEAN NAME */}
      {groupedBlockNames.length > 0 && !loadingBlocks && !blocksError && (
        <select
          className="w-full p-3 border rounded-lg"
          value={selectedBlockName}
          onChange={(e) => setSelectedBlockName(e.target.value)}
        >
          <option value="">-- Select Block --</option>
          {groupedBlockNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
      
      {/* No blocks available */}
      {selectedDistrict && !loadingBlocks && !blocksError && groupedBlockNames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blocks available for selected district
        </div>
      )}

      {/* SUBMIT */}
      {selectedBlockName && !loadingBlocks && !blocksError && (
        <button
          onClick={handleSubmit}
          disabled={loadingReport}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loadingReport ? <ButtonLoader /> : "View Report"}
        </button>
      )}

      {/* Loading report */}
      {loadingReport && <FullPageLoader message="Generating report..." />}
      
      {/* Report error */}
      {reportError && (
        <ErrorMessage 
          message={reportError} 
          onRetry={handleSubmit} 
        />
      )}

      {/* REPORT */}
      {blockData && !reportError && (
        <div ref={reportRef}>
          <ReportLayout
            title={`${blockData.block_name} - Block Report`}
            subtitle={`Generated: ${new Date().toLocaleDateString()}`}
            onDownload={downloadPDF}
            loading={loading}
          >
            <div className="space-y-12">
              <ChartSection title="Economic Status" loading={loadingReport}>
                <EconomicStatusChart data={{
                  first: { c20: Number(blockData.c20) || 0, c21: Number(blockData.c21) || 0, c22: Number(blockData.c22) || 0, c23: Number(blockData.c23) || 0 },
                  second: { c25: Number(blockData.c25) || 0, c26: Number(blockData.c26) || 0, c27: Number(blockData.c27) || 0, c28: Number(blockData.c28) || 0 },
                }} />
              </ChartSection>

              <ChartSection title="Scheme Spending & Saving" loading={loadingReport}>
                <SchemeSpendingAndSavingChart data={{
                  first: { c31: Number(blockData.c31), c30: Number(blockData.c30), c33: Number(blockData.c33), c32: Number(blockData.c32) },
                  second: { c35: Number(blockData.c35), c38: Number(blockData.c38), c36: Number(blockData.c36), c37: Number(blockData.c37) }
                }} />
              </ChartSection>

              <ChartSection title="Minister Reach Impact" loading={loadingReport}>
                <MinisterReachImpactChart data={{
                  first: { c40: Number(blockData.c40), c41: Number(blockData.c41), c42: Number(blockData.c42), c43: Number(blockData.c43) },
                  second: { c45: Number(blockData.c45), c46: Number(blockData.c46), c47: Number(blockData.c47), c48: Number(blockData.c48) }
                }} />
              </ChartSection>

              <ChartSection title="Minister Year Performance" loading={loadingReport}>
                <MinisterYearPerformanceChart data={{
                  first: { c51: Number(blockData.c51), c50: Number(blockData.c50), c52: Number(blockData.c52), c53: Number(blockData.c53) },
                  second: { c57: Number(blockData.c57), c56: Number(blockData.c56), c58: Number(blockData.c58), c59: Number(blockData.c59) }
                }} />
              </ChartSection>

              <ChartSection title="Cooperative Schemes Awareness" loading={loadingReport}>
                <CooperativeSchemesAwareness data={{
                  first: { c63: Number(blockData.c63), c62: Number(blockData.c62), c65: Number(blockData.c65), c64: Number(blockData.c64), c66: Number(blockData.c66) },
                  second: { c69: Number(blockData.c69), c68: Number(blockData.c68), c71: Number(blockData.c71), c70: Number(blockData.c70), c72: Number(blockData.c72) }
                }} />
              </ChartSection>

              <ChartSection title="BJP Government Satisfaction" loading={loadingReport}>
                <BjpGovernmentSatisfactionChart data={{
                  first: { c75: Number(blockData.c75), c74: Number(blockData.c74), c77: Number(blockData.c77), c76: Number(blockData.c76) },
                  second: { c80: Number(blockData.c80), c79: Number(blockData.c79), c82: Number(blockData.c82), c81: Number(blockData.c81) }
                }} />
              </ChartSection>
            </div>
          </ReportLayout>
        </div>
      )}
    </div>
  );
};