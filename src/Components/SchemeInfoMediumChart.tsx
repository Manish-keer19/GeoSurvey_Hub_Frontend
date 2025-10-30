// import React, { useEffect, useRef } from 'react';
// import Chart, { Chart as ChartType } from 'chart.js/auto';

// interface TableRow {
//   sno: number | string;
//   type: string;
//   femaleBeneficiary: string;
// }

// const SchemeSpendingAndSavingChart: React.FC = () => {
//   const firstChartRef = useRef<HTMLCanvasElement>(null);
//   const secondChartRef = useRef<HTMLCanvasElement>(null);
//   const firstChartInstanceRef = useRef<ChartType | null>(null);
//   const secondChartInstanceRef = useRef<ChartType | null>(null);

//   useEffect(() => {
//     // First Chart: Spending Decision
//     if (firstChartRef.current) {
//       const ctx = firstChartRef.current.getContext('2d');
//       if (!ctx) return;

//       if (firstChartInstanceRef.current) {
//         firstChartInstanceRef.current.destroy();
//       }

//       firstChartInstanceRef.current = new Chart(ctx, {
//         type: 'pie' as const,
//         data: {
//           labels: ['हाँ', 'परिवार के साथ मिलकर', 'नहीं', 'कबी-कबी'],
//           datasets: [{
//             data: [375, 345, 3, 5],
//             backgroundColor: [
//               '#f97316', // Orange for हाँ
//               '#22c55e', // Green for family
//               '#ef4444', // Red for नहीं
//               '#6b7280'  // Gray for कबी-कबी
//             ],
//             borderWidth: 2,
//             borderColor: '#ffffff'
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               display: false
//             },
//             tooltip: {
//               callbacks: {
//                 label: function(context: any) {
//                   const label = context.label || '';
//                   const value = context.parsed;
//                   const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
//                   const percentage = ((value / total) * 100).toFixed(0);
//                   return `${label}: ${value} (${percentage}%)`;
//                 }
//               }
//             }
//           }
//         }
//       });
//     }

//     // Second Chart: Saving
//     if (secondChartRef.current) {
//       const ctx = secondChartRef.current.getContext('2d');
//       if (!ctx) return;

//       if (secondChartInstanceRef.current) {
//         secondChartInstanceRef.current.destroy();
//       }

//       secondChartInstanceRef.current = new Chart(ctx, {
//         type: 'pie' as const,
//         data: {
//           labels: ['हाँ', 'सोच रही हू', 'नहीं', 'पहले से बचत करती हू'],
//           datasets: [{
//             data: [367, 23, 328, 10],
//             backgroundColor: [
//               '#ec4899', // Pink for हाँ
//               '#f59e0b', // Amber for सोच रही हू
//               '#3b82f6', // Blue for नहीं
//               '#10b981'  // Emerald for पहले से
//             ],
//             borderWidth: 2,
//             borderColor: '#ffffff'
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               display: false
//             },
//             tooltip: {
//               callbacks: {
//                 label: function(context: any) {
//                   const label = context.label || '';
//                   const value = context.parsed;
//                   const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
//                   const percentage = ((value / total) * 100).toFixed(0);
//                   return `${label}: ${value} (${percentage}%)`;
//                 }
//               }
//             }
//           }
//         }
//       });
//     }

//     return () => {
//       if (firstChartInstanceRef.current) {
//         firstChartInstanceRef.current.destroy();
//       }
//       if (secondChartInstanceRef.current) {
//         secondChartInstanceRef.current.destroy();
//       }
//     };
//   }, []);

//   // First Table Data: Spending Decision
//   const spendingTableData: TableRow[] = [
//     { sno: 1, type: 'हाँ', femaleBeneficiary: '375 (52%)' },
//     { sno: 2, type: 'परिवार के साथ मिलकर', femaleBeneficiary: '345 (47%)' },
//     { sno: 3, type: 'नहीं', femaleBeneficiary: '3 (0%)' },
//     { sno: 4, type: 'कबी-कबी', femaleBeneficiary: '5 (1%)' },
//     { sno: 6, type: 'Total', femaleBeneficiary: '728' }
//   ];

//   // Second Table Data: Saving
//   const savingTableData: TableRow[] = [
//     { sno: 1, type: 'हाँ', femaleBeneficiary: '367 (51%)' },
//     { sno: 2, type: 'सोच रही हू', femaleBeneficiary: '23 (3%)' },
//     { sno: 3, type: 'नहीं', femaleBeneficiary: '328 (45%)' },
//     { sno: 4, type: 'पहले से बचत करती हू', femaleBeneficiary: '10 (1%)' },
//     { sno: 6, type: 'Total', femaleBeneficiary: '728' }
//   ];

//   const commonHeaders: string[] = ['SNO', 'टाइप', 'महिला लाभार्थी'];

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
//       {/* Title */}
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">योजना की राशि खर्च करने का निर्णय एवं बचत</h1>

//       {/* First Section: Spending Decision */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">योजना की राशि खर्च करने का निर्णय</h2>
//         {/* First Table */}
//         <div className="overflow-x-auto mb-4">
//           <table className="min-w-full bg-green-50 border border-gray-300 rounded-md">
//             <thead>
//               <tr className="bg-green-100">
//                 {commonHeaders.map((header, index) => (
//                   <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-green-200">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {spendingTableData.map((row, index) => (
//                 <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.sno}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200 font-medium">{row.type}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.femaleBeneficiary}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* First Pie Chart */}
//         <div className="relative h-80 mb-4 bg-green-50 rounded-md p-4 border border-green-200 flex justify-center">
//           <canvas ref={firstChartRef} />
//         </div>
//         {/* First Legend */}
//         <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
//           <div className="text-center">
//             <div className="inline-flex items-center space-x-2 mb-2">
//               <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//               <span>हाँ: 375; 52%</span>
//             </div>
//             <div className="inline-flex items-center space-x-2 mb-2">
//               <div className="w-4 h-4 bg-green-500 rounded-full"></div>
//               <span>परिवार के साथ मिलकर: 345; 47%</span>
//             </div>
//             <div className="inline-flex items-center space-x-2 mb-2">
//               <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               <span>नहीं: 3; 0%</span>
//             </div>
//             <div className="inline-flex items-center space-x-2">
//               <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
//               <span>कबी-कबी: 5; 1%</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Second Section: Saving */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">योजना राशि की बचत</h2>
//         {/* Second Table */}
//         <div className="overflow-x-auto mb-4">
//           <table className="min-w-full bg-blue-50 border border-gray-300 rounded-md">
//             <thead>
//               <tr className="bg-blue-100">
//                 {commonHeaders.map((header, index) => (
//                   <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-blue-200">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {savingTableData.map((row, index) => (
//                 <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-blue-200">{row.sno}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-blue-200 font-medium">{row.type}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-blue-200">{row.femaleBeneficiary}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* Second Pie Chart */}
//         <div className="relative h-80 mb-4 bg-blue-50 rounded-md p-4 border border-blue-200 flex justify-center">
//           <canvas ref={secondChartRef} />
//         </div>
//         {/* Second Legend */}
//         <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
//           <div className="text-center">
//             <div className="inline-flex items-center space-x-2 mb-2">
//               <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
//               <span>हाँ: 367; 51%</span>
//             </div>
//             <div className="inline-flex items-center space-x-2 mb-2">
//               <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
//               <span>सोच रही हू: 23; 3%</span>
//             </div>
//             <div className="inline-flex items-center space-x-2 mb-2">
//               <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//               <span>नहीं: 328; 45%</span>
//             </div>
//             <div className="inline-flex items-center space-x-2">
//               <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
//               <span>पहले से बचत करती हू: 10; 1%</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchemeSpendingAndSavingChart;







import React, { useEffect, useRef, useMemo, memo } from 'react';
import Chart, { Chart as ChartJS } from 'chart.js/auto';

// === Types ===
interface ApiData {
  first?: {
    c31?: number | string; // हाँ
    c30?: number | string; // परिवार के साथ मिलकर
    c33?: number | string; // नहीं
    c32?: number | string; // कभी-कभी
  };
  second?: {
    c35?: number | string; // हाँ
    c38?: number | string; // सोच रही हूँ
    c36?: number | string;  // नहीं
    c37?: number | string; // पहले से बचत करती हूँ
  };
}

interface SchemeSpendingAndSavingChartProps {
  data: ApiData;
}

// === Safe Number Conversion ===
const toNumber = (val: any): number => {
  const num = Number(val);
  return isNaN(num) || num < 0 ? 0 : Math.floor(num);
};

// === Main Component ===
const SchemeSpendingAndSavingChart: React.FC<SchemeSpendingAndSavingChartProps> = memo(({ data }) => {
  console.log("Rendering SchemeSpendingAndSavingChart with data:", data);
  const firstChartRef = useRef<HTMLCanvasElement>(null);
  const secondChartRef = useRef<HTMLCanvasElement>(null);
  const firstChartInstanceRef = useRef<ChartJS | null>(null);
  const secondChartInstanceRef = useRef<ChartJS | null>(null);

  // === First Chart: Spending Decision (c31, c30, c33, c32) ===
  const spending = useMemo(() => {
    const d = data.first || {};
    return {
      yes: toNumber(d.c31),
      withFamily: toNumber(d.c30),
      no: toNumber(d.c33),
      sometimes: toNumber(d.c32),
    };
  }, [data.first]);

  const spendingTotal = spending.yes + spending.withFamily + spending.no + spending.sometimes;

  const spendingData = [
    spending.yes,
    spending.withFamily,
    spending.no,
    spending.sometimes,
  ];

  const spendingLabels = ['हाँ', 'परिवार के साथ मिलकर', 'नहीं', 'कभी-कभी'];
  const spendingColors = ['#f97316', '#22c55e', '#ef4444', '#6b7280'];

  // === Second Chart: Saving (c35, c38, c36, c37) ===
  const saving = useMemo(() => {
    const d = data.second || {};
    return {
      yes: toNumber(d.c35),
      thinking: toNumber(d.c38),
      no: toNumber(d.c36),
      alreadySaving: toNumber(d.c37),
    };
  }, [data.second]);

  const savingTotal = saving.yes + saving.thinking + saving.no + saving.alreadySaving;

  const savingData = [
    saving.yes,
    saving.thinking,
    saving.no,
    saving.alreadySaving,
  ];

  const savingLabels = ['हाँ', 'सोच रही हूँ', 'नहीं', 'पहले से बचत करती हूँ'];
  const savingColors = ['#ec4899', '#f59e0b', '#3b82f6', '#10b981'];

  // === Table Data Helper ===
  const calcPercent = (value: number, total: number) =>
    total > 0 ? ((value / total) * 100).toFixed(0) : '0';

  // Spending Table
  const spendingTableData = [
    { sno: 1, type: 'हाँ', femaleBeneficiary: `${spending.yes} (${calcPercent(spending.yes, spendingTotal)}%)` },
    { sno: 2, type: 'परिवार के साथ मिलकर', femaleBeneficiary: `${spending.withFamily} (${calcPercent(spending.withFamily, spendingTotal)}%)` },
    { sno: 3, type: 'नहीं', femaleBeneficiary: `${spending.no} (${calcPercent(spending.no, spendingTotal)}%)` },
    { sno: 4, type: 'कभी-कभी', femaleBeneficiary: `${spending.sometimes} (${calcPercent(spending.sometimes, spendingTotal)}%)` },
    { sno: '#', type: 'Total', femaleBeneficiary: `${spendingTotal}` },
  ];

  // Saving Table
  const savingTableData = [
    { sno: 1, type: 'हाँ', femaleBeneficiary: `${saving.yes} (${calcPercent(saving.yes, savingTotal)}%)` },
    { sno: 2, type: 'सोच रही हूँ', femaleBeneficiary: `${saving.thinking} (${calcPercent(saving.thinking, savingTotal)}%)` },
    { sno: 3, type: 'नहीं', femaleBeneficiary: `${saving.no} (${calcPercent(saving.no, savingTotal)}%)` },
    { sno: 4, type: 'पहले से बचत करती हूँ', femaleBeneficiary: `${saving.alreadySaving} (${calcPercent(saving.alreadySaving, savingTotal)}%)` },
    { sno: '#', type: 'Total', femaleBeneficiary: `${savingTotal}` },
  ];

  // === Legend Items ===
  const renderLegend = (labels: string[], data: number[], colors: string[], total: number) => {
    return labels.map((label, i) => {
      const value = data[i];
      const percent = calcPercent(value, total);
      return (
        <div key={i} className="inline-flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[i] }} />
          <span>
            {label}: <strong>{value}</strong> ({percent}%)
          </span>
        </div>
      );
    });
  };

  // === Chart Effect ===
  useEffect(() => {
    // First Chart
    if (firstChartRef.current && spendingTotal > 0) {
      const ctx = firstChartRef.current.getContext('2d');
      if (!ctx) return;

      firstChartInstanceRef.current?.destroy();

      firstChartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: spendingLabels,
          datasets: [{
            data: spendingData,
            backgroundColor: spendingColors,
            borderColor: '#ffffff',
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const value = ctx.parsed;
                  const percent = spendingTotal > 0 ? ((value / spendingTotal) * 100).toFixed(1) : '0';
                  return `${ctx.label}: ${value} (${percent}%)`;
                },
              },
            },
          },
        },
      });
    }

    // Second Chart
    if (secondChartRef.current && savingTotal > 0) {
      const ctx = secondChartRef.current.getContext('2d');
      if (!ctx) return;

      secondChartInstanceRef.current?.destroy();

      secondChartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: savingLabels,
          datasets: [{
            data: savingData,
            backgroundColor: savingColors,
            borderColor: '#ffffff',
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const value = ctx.parsed;
                  const percent = savingTotal > 0 ? ((value / savingTotal) * 100).toFixed(1) : '0';
                  return `${ctx.label}: ${value} (${percent}%)`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      firstChartInstanceRef.current?.destroy();
      secondChartInstanceRef.current?.destroy();
      firstChartInstanceRef.current = null;
      secondChartInstanceRef.current = null;
    };
  }, [spendingData, savingData, spendingTotal, savingTotal]);

  // === Render ===
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        योजना की राशि खर्च करने का निर्णय एवं बचत
      </h1>

      {/* === First Section: Spending Decision === */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          योजना की राशि खर्च करने का निर्णय
        </h2>

        {/* Table */}
        <div className="overflow-x-auto mb-4 rounded-md border border-gray-300">
          <table className="min-w-full bg-green-50">
            <thead>
              <tr className="bg-green-100">
                {['SNO', 'टाइप', 'महिला लाभार्थी'].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-green-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spendingTableData.map((row, i) => (
                <tr
                  key={i}
                  className={`${i % 2 === 0 ? 'bg-green-50' : 'bg-white'} hover:bg-green-100 transition-colors`}
                >
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-green-200">
                    {row.sno}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-green-200">
                    {row.type}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">
                    {row.femaleBeneficiary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="relative h-80 mb-4 bg-green-50 rounded-md p-4 border border-green-200">
          {spendingTotal === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>कोई डेटा उपलब्ध नहीं</p>
            </div>
          ) : (
            <canvas ref={firstChartRef} />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
          {renderLegend(spendingLabels, spendingData, spendingColors, spendingTotal)}
        </div>
      </div>

      {/* === Second Section: Saving === */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          योजना राशि की बचत
        </h2>

        {/* Table */}
        <div className="overflow-x-auto mb-4 rounded-md border border-gray-300">
          <table className="min-w-full bg-blue-50">
            <thead>
              <tr className="bg-blue-100">
                {['SNO', 'टाइप', 'महिला लाभार्थी'].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-blue-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {savingTableData.map((row, i) => (
                <tr
                  key={i}
                  className={`${i % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition-colors`}
                >
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-blue-200">
                    {row.sno}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-blue-200">
                    {row.type}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-blue-200">
                    {row.femaleBeneficiary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="relative h-80 mb-4 bg-blue-50 rounded-md p-4 border border-blue-200">
          {savingTotal === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>कोई डेटा उपलब्ध नहीं</p>
            </div>
          ) : (
            <canvas ref={secondChartRef} />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
          {renderLegend(savingLabels, savingData, savingColors, savingTotal)}
        </div>
      </div>
    </div>
  );
});

SchemeSpendingAndSavingChart.displayName = 'SchemeSpendingAndSavingChart';

export default SchemeSpendingAndSavingChart;