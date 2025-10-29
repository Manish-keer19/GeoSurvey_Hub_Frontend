// import React, { useEffect, useRef } from 'react';
// import Chart, { Chart as ChartType } from 'chart.js/auto';

// interface TableRow {
//   sno: number | string;
//   type: string;
//   overall: number;
//   ad: string;
//   social: string;
//   govt: string;
//   family: string;
//   noinfo: string;
// }

// const CooperativeSchemesAwareness: React.FC = () => {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstanceRef = useRef<ChartType | null>(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const ctx = chartRef.current.getContext('2d');
//       if (!ctx) return;

//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.destroy();
//       }

//       chartInstanceRef.current = new Chart(ctx, {
//         type: 'pie' as const,
//         data: {
//           labels: ['अखबार/विज्ञापन से', 'सोशल मीडिया से', 'सरकारी कम्युनिकेशन से', 'परिवार से', 'कोई जानकारी नहीं मिली है'],
//           datasets: [{
//             data: [277, 563, 1216, 152, 75],
//             backgroundColor: [
//               '#98FB98', // Pale green for ad
//               '#FFD700', // Gold for social
//               '#9370DB', // Medium purple for govt
//               '#DDA0DD', // Plum for family
//               '#8B4513'  // Saddle brown for no info
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
//               display: false // Hide default legend, we'll use custom
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
//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.destroy();
//       }
//     };
//   }, []);

//   const tableData: TableRow[] = [
//     { sno: 1, type: 'महिला लाभार्थी', overall: 728, ad: '64 (9%)', social: '134 (18%)', govt: '418 (57%)', family: '82 (11%)', noinfo: '30 (4%)' },
//     { sno: 2, type: 'लाभार्थी के परिवार से', overall: 1555, ad: '213 (14%)', social: '429 (27%)', govt: '798 (51%)', family: '70 (5%)', noinfo: '45 (3%)' },
//     { sno: '#', type: 'कुल', overall: 2283, ad: '277 (12%)', social: '563 (25%)', govt: '1216 (53%)', family: '152 (7%)', noinfo: '75 (3%)' }
//   ];

//   const headers: string[] = [
//     'क्र.सं.',
//     'प्रकार',
//     'कुल',
//     'अखबार/विज्ञापन से',
//     'सोशल मीडिया से',
//     'सरकारी कम्युनिकेशन से',
//     'परिवार से',
//     'कोई जानकारी नहीं मिली है'
//   ];

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
//       {/* शीर्षक */}
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">सहकारी योजनाओं की सुचना प्राप्ति का माध्यम</h1>

//       {/* तालिका */}
//       <div className="overflow-x-auto mb-6">
//         <table className="min-w-full bg-orange-50 border border-orange-300 rounded-md">
//           <thead>
//             <tr className="bg-orange-100">
//               {headers.map((header, index) => (
//                 <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-orange-200">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, index) => {
//               const isTotal = row.sno === '#';
//               const rowClass = isTotal 
//                 ? 'bg-orange-100 font-bold' 
//                 : `bg-white ${index % 2 === 0 ? 'bg-orange-50' : 'bg-white'}`;
//               return (
//                 <tr key={index} className={rowClass}>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.sno}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200 font-medium">{row.type}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.overall}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.ad}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.social}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.govt}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.family}</td>
//                   <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.noinfo}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* पाई चार्ट कंटेनर */}
//       <div className="relative h-80 mb-6 bg-orange-50 rounded-md p-4 border border-orange-200">
//         <canvas ref={chartRef} />
//       </div>

//       {/* कस्टम लेजेंड और लेबल */}
//       <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
//         <div className="text-center">
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-[#98FB98] rounded-full"></div>
//             <span>अखबार/विज्ञापन से: 277; 12%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-[#FFD700] rounded-full"></div>
//             <span>सोशल मीडिया से: 563; 25%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-[#9370DB] rounded-full"></div>
//             <span>सरकारी कम्युनिकेशन से: 1216; 53%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-[#DDA0DD] rounded-full"></div>
//             <span>परिवार से: 152; 7%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2">
//             <div className="w-4 h-4 bg-[#8B4513] rounded-full"></div>
//             <span>कोई जानकारी नहीं मिली है: 75; 3%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CooperativeSchemesAwareness;





import React, { useEffect, useRef, useState } from 'react';
import Chart, { Chart as ChartType } from 'chart.js/auto';

interface Category {
  key: 'ad' | 'social' | 'govt' | 'family' | 'noinfo';
  label: string;
  color: string;
}

interface DataRow {
  sno: number | string;
  type: string;
  counts: {
    ad: number;
    social: number;
    govt: number;
    family: number;
    noinfo: number;
  };
}

interface TableRow {
  sno: number | string;
  type: string;
  overall: number;
  ad: string;
  social: string;
  govt: string;
  family: string;
  noinfo: string;
}

const CooperativeSchemesAwareness: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartType | null>(null);

  // State for data rows - initialize with defaults; update via setDataRows for backend data
  const [dataRows] = useState<DataRow[]>([
    {
      sno: 1,
      type: 'महिला लाभार्थी',
      counts: { ad: 64, social: 134, govt: 418, family: 82, noinfo: 30 }
    },
    {
      sno: 2,
      type: 'लाभार्थी के परिवार से',
      counts: { ad: 213, social: 429, govt: 798, family: 70, noinfo: 45 }
    },
    {
      sno: '#',
      type: 'कुल',
      counts: { ad: 0, social: 0, govt: 0, family: 0, noinfo: 0 } // Total computed dynamically
    }
  ]);

  // State for categories - initialize with defaults; update via setCategories if needed
  const [categories] = useState<Category[]>([
    { key: 'ad', label: 'अखबार/विज्ञापन से', color: '#98FB98' },
    { key: 'social', label: 'सोशल मीडिया से', color: '#FFD700' },
    { key: 'govt', label: 'सरकारी कर्मचारियों से ', color: '#9370DB' },
    { key: 'family', label: 'परिवार से', color: '#DDA0DD' },
    { key: 'noinfo', label: 'कोई जानकारी नहीं मिली है', color: '#8B4513' }
  ]);

  const title = 'सहकारी योजनाओं की सुचना प्राप्ति का माध्यम'; // Can also be state if dynamic

  // Example: Placeholder for fetching data from backend (uncomment and adapt as needed)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/cooperative-schemes-awareness'); // Your backend endpoint
  //       const fetchedData = await response.json();
  //       setDataRows(fetchedData.rows || []);
  //       setCategories(fetchedData.categories || categories);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // Compute totals for chart and legend (excluding total row)
  const totals = dataRows.reduce((acc, row) => {
    if (typeof row.sno === 'number') { // Exclude total row if it exists
      acc.ad += row.counts.ad;
      acc.social += row.counts.social;
      acc.govt += row.counts.govt;
      acc.family += row.counts.family;
      acc.noinfo += row.counts.noinfo;
    }
    return acc;
  }, { ad: 0, social: 0, govt: 0, family: 0, noinfo: 0 });

  const overallTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

  // Prepare chart data
  const chartLabels = categories.map(cat => cat.label);
  const chartData = categories.map(cat => totals[cat.key]);
  const chartColors = categories.map(cat => cat.color);

  // Prepare table data with percentages
  const tableData: TableRow[] = dataRows.map(row => {
    let rowCounts = row.counts;
    let rowTotal = 0;
    if (typeof row.sno === 'number') {
      // For non-total rows
      rowTotal = Object.values(row.counts).reduce((sum, val) => sum + val, 0);
    } else {
      // For total row, use grand totals
      rowCounts = {
        ad: totals.ad,
        social: totals.social,
        govt: totals.govt,
        family: totals.family,
        noinfo: totals.noinfo
      };
      rowTotal = overallTotal;
    }
    return {
      sno: row.sno,
      type: row.type,
      overall: rowTotal,
      ad: `${rowCounts.ad} (${rowTotal > 0 ? ((rowCounts.ad / rowTotal) * 100).toFixed(0) : '0'}%)`,
      social: `${rowCounts.social} (${rowTotal > 0 ? ((rowCounts.social / rowTotal) * 100).toFixed(0) : '0'}%)`,
      govt: `${rowCounts.govt} (${rowTotal > 0 ? ((rowCounts.govt / rowTotal) * 100).toFixed(0) : '0'}%)`,
      family: `${rowCounts.family} (${rowTotal > 0 ? ((rowCounts.family / rowTotal) * 100).toFixed(0) : '0'}%)`,
      noinfo: `${rowCounts.noinfo} (${rowTotal > 0 ? ((rowCounts.noinfo / rowTotal) * 100).toFixed(0) : '0'}%)`,
    };
  });

  // Headers based on categories
  const headers: string[] = [
    'क्र.सं.',
    'प्रकार',
    'कुल',
    ...categories.map(cat => cat.label),
  ];

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie' as const,
        data: {
          labels: chartLabels,
          datasets: [{
            data: chartData,
            backgroundColor: chartColors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Hide default legend, we'll use custom
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartLabels, chartData, chartColors]); // Re-run if data changes

  // Custom legend items
  const legendItems = categories.map(cat => {
    const count = totals[cat.key];
    const percentage = overallTotal > 0 ? ((count / overallTotal) * 100).toFixed(0) : '0';
    return (
      <div key={cat.key} className="inline-flex items-center space-x-2 mb-2">
        <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: cat.color }}></div>
        <span>{`${cat.label}: ${count}; ${percentage}%`}</span>
      </div>
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
      {/* शीर्षक */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h1>

      {/* तालिका */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-orange-50 border border-orange-300 rounded-md">
          <thead>
            <tr className="bg-orange-100">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-orange-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => {
              const isTotal = row.sno === '#';
              const rowClass = isTotal
                ? 'bg-orange-100 font-bold'
                : `bg-white ${index % 2 === 0 ? 'bg-orange-50' : 'bg-white'}`;
              return (
                <tr key={index} className={rowClass}>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.sno}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200 font-medium">{row.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.overall}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.ad}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.social}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.govt}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.family}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">{row.noinfo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* पाई चार्ट कंटेनर */}
      <div className="relative h-80 mb-6 bg-orange-50 rounded-md p-4 border border-orange-200">
        <canvas ref={chartRef} />
      </div>

      {/* कस्टम लेजेंड और लेबल */}
      <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
        <div className="text-center">
          {legendItems}
        </div>
      </div>
    </div>
  );
};

export default CooperativeSchemesAwareness;