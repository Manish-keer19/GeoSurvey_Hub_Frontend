// import React, { useState, useRef } from "react";
// import { userService } from "../../service/user.service";
// import { DistrictSelect } from "./DistrictSelect";
// import { ReportLayout } from "./ReportLayout";
// import { ChartSection } from "./ChartSection";
// import { FullPageLoader, ButtonLoader } from "./LoaderComponents";
// import { ErrorMessage } from "./ErrorComponents";
// import EconomicStatusChart from "../../Components/EconomicStatusChart";
// import SchemeSpendingAndSavingChart from "../SchemeInfoMediumChart";
// import MinisterReachImpactChart from "../MinisterReachImpactChart";
// import MinisterYearPerformanceChart from "../../Components/MinisterYearPerformanceChart";
// import CooperativeSchemesAwareness from "../../Components/CooperativeSchemesAwareness";
// import BjpGovernmentSatisfactionChart from "../../Components/BjpGovernmentSatisfactionChart";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useSelector } from "react-redux";

// interface DistrictReport {
//   district_name: string;
//   type: "ALL" | "R" | "U";
//   blockCount: number;
//   data: Record<string, number>;
// }

// export const DistrictReportPage: React.FC = () => {
//     const user = useSelector((state: any) => state.auth.user);
//   const token = useSelector((state: any) => state.auth.token);

//   const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
//   const [type, setType] = useState<"ALL" | "R" | "U">("ALL");
//   const [report, setReport] = useState<DistrictReport | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const reportRef = useRef<HTMLDivElement>(null);

//   const handleSubmit = async () => {
//     if (!selectedDistrict) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await userService.getDistrictReport(selectedDistrict,token,type);
//       if (res.success) {
//         setReport(res.data);
//       } else {
//         setError("Failed to load district report");
//       }
//     } catch (err) {
//       setError("Network error while loading district report");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const downloadPDF = async () => {
//     if (!reportRef.current || !report) return;
//     setLoading(true);
//     try {
//       const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
//       const img = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
//       pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
//       pdf.save(`District_${report.district_name}_${type}_Report.pdf`);
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <DistrictSelect selected={selectedDistrict} onChange={setSelectedDistrict} />

//       {selectedDistrict && (
//         <div className="flex justify-center gap-6">
//           {(["ALL", "R", "U"] as const).map((t) => (
//             <label key={t} className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="type"
//                 checked={type === t}
//                 onChange={() => setType(t)}
//                 className="text-indigo-600"
//               />
//               <span className="text-sm font-medium">
//                 {t === "ALL" ? "All" : t === "R" ? "Rural" : "Urban"}
//               </span>
//             </label>
//           ))}
//         </div>
//       )}

//       {selectedDistrict && (
//         <div className="flex justify-center">
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {loading ? <ButtonLoader /> : "Generate Report"}
//           </button>
//         </div>
//       )}

//       {loading && !report && <FullPageLoader message="Loading district report..." />}
      
//       {error && (
//         <ErrorMessage 
//           message={error} 
//           onRetry={handleSubmit} 
//         />
//       )}

//       {report && (
//         <div ref={reportRef}>
//           <ReportLayout
//             title={`${report.district_name} (${type})`}
//             subtitle={`Blocks: ${report.blockCount} | ${new Date().toLocaleDateString()}`}
//             onDownload={downloadPDF}
//             loading={loading}
//           >
//             <div className="space-y-12">
//               <ChartSection title="Economic Status" loading={loading}>
//                 <EconomicStatusChart data={{
//                   first: {
//                     c20: Number(report.data.c20) || 0,
//                     c21: Number(report.data.c21) || 0,
//                     c22: Number(report.data.c22) || 0,
//                     c23: Number(report.data.c23) || 0,
//                   },
//                   second: {
//                     c25: Number(report.data.c25) || 0,
//                     c26: Number(report.data.c26) || 0,
//                     c27: Number(report.data.c27) || 0,
//                     c28: Number(report.data.c28) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               <ChartSection title="Scheme Spending & Saving" loading={loading}>
//                 <SchemeSpendingAndSavingChart data={{
//                   first: {
//                     c31: Number(report.data.c31) || 0,
//                     c30: Number(report.data.c30) || 0,
//                     c33: Number(report.data.c33) || 0,
//                     c32: Number(report.data.c32) || 0,
//                   },
//                   second: {
//                     c35: Number(report.data.c35) || 0,
//                     c38: Number(report.data.c38) || 0,
//                     c36: Number(report.data.c36) || 0,
//                     c37: Number(report.data.c37) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               <ChartSection title="Minister Reach Impact" loading={loading}>
//                 <MinisterReachImpactChart data={{
//                   first: {
//                     c40: Number(report.data.c40) || 0,
//                     c41: Number(report.data.c41) || 0,
//                     c42: Number(report.data.c42) || 0,
//                     c43: Number(report.data.c43) || 0,
//                   },
//                   second: {
//                     c45: Number(report.data.c45) || 0,
//                     c46: Number(report.data.c46) || 0,
//                     c47: Number(report.data.c47) || 0,
//                     c48: Number(report.data.c48) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               <ChartSection title="Minister Year Performance" loading={loading}>
//                 <MinisterYearPerformanceChart data={{
//                   first: {
//                     c51: Number(report.data.c51) || 0,
//                     c50: Number(report.data.c50) || 0,
//                     c52: Number(report.data.c52) || 0,
//                     c53: Number(report.data.c53) || 0,
//                   },
//                   second: {
//                     c57: Number(report.data.c57) || 0,
//                     c56: Number(report.data.c56) || 0,
//                     c58: Number(report.data.c58) || 0,
//                     c59: Number(report.data.c59) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               <ChartSection title="Cooperative Schemes Awareness" loading={loading}>
//                 <CooperativeSchemesAwareness data={{
//                   first: {
//                     c63: Number(report.data.c63) || 0,
//                     c62: Number(report.data.c62) || 0,
//                     c65: Number(report.data.c65) || 0,
//                     c64: Number(report.data.c64) || 0,
//                     c66: Number(report.data.c66) || 0,
//                   },
//                   second: {
//                     c69: Number(report.data.c69) || 0,
//                     c68: Number(report.data.c68) || 0,
//                     c71: Number(report.data.c71) || 0,
//                     c70: Number(report.data.c70) || 0,
//                     c72: Number(report.data.c72) || 0,
//                   },
//                 }} />
//               </ChartSection>

//               <ChartSection title="BJP Government Satisfaction" loading={loading}>
//                 <BjpGovernmentSatisfactionChart data={{
//                   first: {
//                     c75: Number(report.data.c75) || 0,
//                     c74: Number(report.data.c74) || 0,
//                     c77: Number(report.data.c77) || 0,
//                     c76: Number(report.data.c76) || 0,
//                   },
//                   second: {
//                     c80: Number(report.data.c80) || 0,
//                     c79: Number(report.data.c79) || 0,
//                     c82: Number(report.data.c82) || 0,
//                     c81: Number(report.data.c81) || 0,
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







import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { userService } from "../../service/user.service";
import { DistrictSelect } from "./DistrictSelect";
import { ReportLayout } from "./ReportLayout";
import { ChartSection } from "./ChartSection";
import { FullPageLoader, ButtonLoader } from "./LoaderComponents";
import { ErrorMessage } from "./ErrorComponents";
import EconomicStatusChart from "../../Components/EconomicStatusChart";
import SchemeSpendingAndSavingChart from "../SchemeInfoMediumChart";
import MinisterReachImpactChart from "../MinisterReachImpactChart";
import MinisterYearPerformanceChart from "../../Components/MinisterYearPerformanceChart";
import CooperativeSchemesAwareness from "../../Components/CooperativeSchemesAwareness";
import BjpGovernmentSatisfactionChart from "../../Components/BjpGovernmentSatisfactionChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DistrictReport {
  district_name: string;
  type: "ALL" | "R" | "U";
  blockCount: number;
  data: Record<string, number>;
}

interface ChartData {
  first: Record<string, number>;
  second: Record<string, number>;
}

export const DistrictReportPage: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);

  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [type, setType] = useState<"ALL" | "R" | "U">("ALL");
  const [report, setReport] = useState<DistrictReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!selectedDistrict) return;
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getDistrictReport(selectedDistrict, token, type);
      if (res.success) {
        setReport(res.data);
      } else {
        setError("Failed to load district report");
      }
    } catch (err) {
      setError("Network error while loading district report");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current || !report) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`District_${report.district_name}_${type}_Report.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract chart data safely
  const getChartData = (firstFields: string[], secondFields: string[]): ChartData => ({
    first: firstFields.reduce((acc, field) => ({ ...acc, [field]: report?.data[field] ?? 0 }), {} as Record<string, number>),
    second: secondFields.reduce((acc, field) => ({ ...acc, [field]: report?.data[field] ?? 0 }), {} as Record<string, number>),
  });

  if (loading && !report) {
    return <FullPageLoader message="Loading district report..." />;
  }

  return (
    <div className="space-y-6">
      <DistrictSelect selected={selectedDistrict} onChange={setSelectedDistrict} />

      {selectedDistrict && (
        <div className="flex justify-center gap-6">
          {(["ALL", "R", "U"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={type === t}
                onChange={() => setType(t)}
                className="text-indigo-600"
              />
              <span className="text-sm font-medium">
                {t === "ALL" ? "All" : t === "R" ? "Rural" : "Urban"}
              </span>
            </label>
          ))}
        </div>
      )}

      {selectedDistrict && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <ButtonLoader /> : "Generate Report"}
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={handleSubmit} />}

      {report && (
        <div ref={reportRef}>
          <ReportLayout
            title={`${report.district_name} (${type})`}
            subtitle={`Blocks: ${report.blockCount} | ${new Date().toLocaleDateString()}`}
            onDownload={downloadPDF}
            loading={loading}
          >
            <div className="space-y-12">
              <ChartSection title="Economic Status" loading={loading}>
                <EconomicStatusChart data={getChartData(["c20", "c21", "c22", "c23"], ["c25", "c26", "c27", "c28"])} />
              </ChartSection>

              <ChartSection title="Scheme Spending & Saving" loading={loading}>
                <SchemeSpendingAndSavingChart data={getChartData(["c31", "c30", "c33", "c32"], ["c35", "c38", "c36", "c37"])} />
              </ChartSection>

              <ChartSection title="Minister Reach Impact" loading={loading}>
                <MinisterReachImpactChart data={getChartData(["c40", "c41", "c42", "c43"], ["c45", "c46", "c47", "c48"])} />
              </ChartSection>

              <ChartSection title="Minister Year Performance" loading={loading}>
                <MinisterYearPerformanceChart data={getChartData(["c51", "c50", "c52", "c53"], ["c57", "c56", "c58", "c59"])} />
              </ChartSection>

              <ChartSection title="Cooperative Schemes Awareness" loading={loading}>
                <CooperativeSchemesAwareness
                  data={getChartData(
                    ["c63", "c62", "c65", "c64", "c66"],
                    ["c69", "c68", "c71", "c70", "c72"]
                  )}
                />
              </ChartSection>

              <ChartSection title="BJP Government Satisfaction" loading={loading}>
                <BjpGovernmentSatisfactionChart data={getChartData(["c75", "c74", "c77", "c76"], ["c80", "c79", "c82", "c81"])} />
              </ChartSection>
            </div>
          </ReportLayout>
        </div>
      )}
    </div>
  );
};