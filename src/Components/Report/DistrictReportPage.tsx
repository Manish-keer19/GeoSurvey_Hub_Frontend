import React, { useState, useRef } from "react";
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
import { useSelector } from "react-redux";

interface DistrictReport {
  district_name: string;
  type: "ALL" | "R" | "U";
  blockCount: number;
  aggregated: Record<string, number>;
}

export const DistrictReportPage: React.FC = () => {
    // const user = useSelector((state: any) => state.auth.user);
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
      const res = await userService.getDistrictReport(selectedDistrict,token,type);
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
    } finally {
      setLoading(false);
    }
  };

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

      {loading && !report && <FullPageLoader message="Loading district report..." />}
      
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={handleSubmit} 
        />
      )}

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
                <EconomicStatusChart data={{
                  first: {
                    c20: Number(report.aggregated.c20) || 0,
                    c21: Number(report.aggregated.c21) || 0,
                    c22: Number(report.aggregated.c22) || 0,
                    c23: Number(report.aggregated.c23) || 0,
                  },
                  second: {
                    c25: Number(report.aggregated.c25) || 0,
                    c26: Number(report.aggregated.c26) || 0,
                    c27: Number(report.aggregated.c27) || 0,
                    c28: Number(report.aggregated.c28) || 0,
                  },
                }} />
              </ChartSection>

              <ChartSection title="Scheme Spending & Saving" loading={loading}>
                <SchemeSpendingAndSavingChart data={{
                  first: {
                    c31: Number(report.aggregated.c31) || 0,
                    c30: Number(report.aggregated.c30) || 0,
                    c33: Number(report.aggregated.c33) || 0,
                    c32: Number(report.aggregated.c32) || 0,
                  },
                  second: {
                    c35: Number(report.aggregated.c35) || 0,
                    c38: Number(report.aggregated.c38) || 0,
                    c36: Number(report.aggregated.c36) || 0,
                    c37: Number(report.aggregated.c37) || 0,
                  },
                }} />
              </ChartSection>

              <ChartSection title="Minister Reach Impact" loading={loading}>
                <MinisterReachImpactChart data={{
                  first: {
                    c40: Number(report.aggregated.c40) || 0,
                    c41: Number(report.aggregated.c41) || 0,
                    c42: Number(report.aggregated.c42) || 0,
                    c43: Number(report.aggregated.c43) || 0,
                  },
                  second: {
                    c45: Number(report.aggregated.c45) || 0,
                    c46: Number(report.aggregated.c46) || 0,
                    c47: Number(report.aggregated.c47) || 0,
                    c48: Number(report.aggregated.c48) || 0,
                  },
                }} />
              </ChartSection>

              <ChartSection title="Minister Year Performance" loading={loading}>
                <MinisterYearPerformanceChart data={{
                  first: {
                    c51: Number(report.aggregated.c51) || 0,
                    c50: Number(report.aggregated.c50) || 0,
                    c52: Number(report.aggregated.c52) || 0,
                    c53: Number(report.aggregated.c53) || 0,
                  },
                  second: {
                    c57: Number(report.aggregated.c57) || 0,
                    c56: Number(report.aggregated.c56) || 0,
                    c58: Number(report.aggregated.c58) || 0,
                    c59: Number(report.aggregated.c59) || 0,
                  },
                }} />
              </ChartSection>

              <ChartSection title="Cooperative Schemes Awareness" loading={loading}>
                <CooperativeSchemesAwareness data={{
                  first: {
                    c63: Number(report.aggregated.c63) || 0,
                    c62: Number(report.aggregated.c62) || 0,
                    c65: Number(report.aggregated.c65) || 0,
                    c64: Number(report.aggregated.c64) || 0,
                    c66: Number(report.aggregated.c66) || 0,
                  },
                  second: {
                    c69: Number(report.aggregated.c69) || 0,
                    c68: Number(report.aggregated.c68) || 0,
                    c71: Number(report.aggregated.c71) || 0,
                    c70: Number(report.aggregated.c70) || 0,
                    c72: Number(report.aggregated.c72) || 0,
                  },
                }} />
              </ChartSection>

              <ChartSection title="BJP Government Satisfaction" loading={loading}>
                <BjpGovernmentSatisfactionChart data={{
                  first: {
                    c75: Number(report.aggregated.c75) || 0,
                    c74: Number(report.aggregated.c74) || 0,
                    c77: Number(report.aggregated.c77) || 0,
                    c76: Number(report.aggregated.c76) || 0,
                  },
                  second: {
                    c80: Number(report.aggregated.c80) || 0,
                    c79: Number(report.aggregated.c79) || 0,
                    c82: Number(report.aggregated.c82) || 0,
                    c81: Number(report.aggregated.c81) || 0,
                  },
                }} />
              </ChartSection>
            </div>
          </ReportLayout>
        </div>
      )}
    </div>
  );
};