import React, { useEffect, useRef } from 'react';
import Chart, { Chart as ChartType } from 'chart.js/auto';

interface TableRow {
  sno: number | string;
  type: string;
  femaleBeneficiary: string;
}

const SchemeSpendingAndSavingChart: React.FC = () => {
  const firstChartRef = useRef<HTMLCanvasElement>(null);
  const secondChartRef = useRef<HTMLCanvasElement>(null);
  const firstChartInstanceRef = useRef<ChartType | null>(null);
  const secondChartInstanceRef = useRef<ChartType | null>(null);

  useEffect(() => {
    // First Chart: Spending Decision
    if (firstChartRef.current) {
      const ctx = firstChartRef.current.getContext('2d');
      if (!ctx) return;

      if (firstChartInstanceRef.current) {
        firstChartInstanceRef.current.destroy();
      }

      firstChartInstanceRef.current = new Chart(ctx, {
        type: 'pie' as const,
        data: {
          labels: ['हाँ', 'परिवार के साथ मिलकर', 'नहीं', 'कबी-कबी'],
          datasets: [{
            data: [375, 345, 3, 5],
            backgroundColor: [
              '#f97316', // Orange for हाँ
              '#22c55e', // Green for family
              '#ef4444', // Red for नहीं
              '#6b7280'  // Gray for कबी-कबी
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(0);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Second Chart: Saving
    if (secondChartRef.current) {
      const ctx = secondChartRef.current.getContext('2d');
      if (!ctx) return;

      if (secondChartInstanceRef.current) {
        secondChartInstanceRef.current.destroy();
      }

      secondChartInstanceRef.current = new Chart(ctx, {
        type: 'pie' as const,
        data: {
          labels: ['हाँ', 'सोच रही हू', 'नहीं', 'पहले से बचत करती हू'],
          datasets: [{
            data: [367, 23, 328, 10],
            backgroundColor: [
              '#ec4899', // Pink for हाँ
              '#f59e0b', // Amber for सोच रही हू
              '#3b82f6', // Blue for नहीं
              '#10b981'  // Emerald for पहले से
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(0);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (firstChartInstanceRef.current) {
        firstChartInstanceRef.current.destroy();
      }
      if (secondChartInstanceRef.current) {
        secondChartInstanceRef.current.destroy();
      }
    };
  }, []);

  // First Table Data: Spending Decision
  const spendingTableData: TableRow[] = [
    { sno: 1, type: 'हाँ', femaleBeneficiary: '375 (52%)' },
    { sno: 2, type: 'परिवार के साथ मिलकर', femaleBeneficiary: '345 (47%)' },
    { sno: 3, type: 'नहीं', femaleBeneficiary: '3 (0%)' },
    { sno: 4, type: 'कबी-कबी', femaleBeneficiary: '5 (1%)' },
    { sno: 6, type: 'Total', femaleBeneficiary: '728' }
  ];

  // Second Table Data: Saving
  const savingTableData: TableRow[] = [
    { sno: 1, type: 'हाँ', femaleBeneficiary: '367 (51%)' },
    { sno: 2, type: 'सोच रही हू', femaleBeneficiary: '23 (3%)' },
    { sno: 3, type: 'नहीं', femaleBeneficiary: '328 (45%)' },
    { sno: 4, type: 'पहले से बचत करती हू', femaleBeneficiary: '10 (1%)' },
    { sno: 6, type: 'Total', femaleBeneficiary: '728' }
  ];

  const commonHeaders: string[] = ['SNO', 'टाइप', 'महिला लाभार्थी'];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">योजना की राशि खर्च करने का निर्णय एवं बचत</h1>

      {/* First Section: Spending Decision */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">योजना की राशि खर्च करने का निर्णय</h2>
        {/* First Table */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-green-50 border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-green-100">
                {commonHeaders.map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-green-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spendingTableData.map((row, index) => (
                <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.sno}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200 font-medium">{row.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.femaleBeneficiary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* First Pie Chart */}
        <div className="relative h-80 mb-4 bg-green-50 rounded-md p-4 border border-green-200 flex justify-center">
          <canvas ref={firstChartRef} />
        </div>
        {/* First Legend */}
        <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>हाँ: 375; 52%</span>
            </div>
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>परिवार के साथ मिलकर: 345; 47%</span>
            </div>
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>नहीं: 3; 0%</span>
            </div>
            <div className="inline-flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span>कबी-कबी: 5; 1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section: Saving */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">योजना राशि की बचत</h2>
        {/* Second Table */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-blue-50 border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-blue-100">
                {commonHeaders.map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-blue-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {savingTableData.map((row, index) => (
                <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-blue-200">{row.sno}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-blue-200 font-medium">{row.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-blue-200">{row.femaleBeneficiary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Second Pie Chart */}
        <div className="relative h-80 mb-4 bg-blue-50 rounded-md p-4 border border-blue-200 flex justify-center">
          <canvas ref={secondChartRef} />
        </div>
        {/* Second Legend */}
        <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              <span>हाँ: 367; 51%</span>
            </div>
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span>सोच रही हू: 23; 3%</span>
            </div>
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>नहीं: 328; 45%</span>
            </div>
            <div className="inline-flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <span>पहले से बचत करती हू: 10; 1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeSpendingAndSavingChart;

