// import React, { useEffect, useRef } from 'react';
// import Chart, { Chart as ChartType } from 'chart.js/auto';

// interface TableRow {
//   sno: number | string;
//   type: string;
//   overall: number;
//   veryGood: string;
//   good: string;
//   less: string;
//   noResponse: string;
// }

// const MinisterYearPerformanceChart: React.FC = () => {
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
//           labels: ['बहुत अच्छा कार्य कर रहे हैं', 'अच्छा कार्य कर रहे हैं', 'कम कार्य कर रहे हैं', 'कोई प्रतिक्रिया नहीं'],
//           datasets: [{
//             data: [532, 942, 53, 43],
//             backgroundColor: [
//               '#f97316', // Orange for बहुत अच्छा (second largest)
//               '#ec4899', // Pink for अच्छा (largest)
//               '#3b82f6', // Blue for कम
//               '#92400e'  // Brown for कोई प्रतिक्रिया नहीं
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
//     { sno: 1, type: 'महिला लाभार्थी', overall: 403, veryGood: '162 (40%)', good: '222 (55%)', less: '7 (2%)', noResponse: '12 (3%)' },
//     { sno: 2, type: 'लाभार्थी के परिवार से', overall: 1167, veryGood: '370 (32%)', good: '720 (62%)', less: '46 (4%)', noResponse: '31 (2%)' },
//     { sno: '#', type: 'कुल', overall: 1570, veryGood: '532 (34%)', good: '942 (60%)', less: '53 (3%)', noResponse: '43 (3%)' }
//   ];

//   const headers: string[] = [
//     'क्र.सं.',
//     'प्रकार',
//     'कुल',
//     'बहुत अच्छा कार्य कर रहे हैं',
//     'अच्छा कार्य कर रहे हैं',
//     'कम कार्य कर रहे हैं',
//     'कोई प्रतिक्रिया नहीं'
//   ];

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
//       {/* शीर्षक */}
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">मंत्री जी के एक साल का कार्यकाल</h1>

//       {/* तालिका */}
//       <div className="overflow-x-auto mb-6">
//         <table className="min-w-full bg-green-50 border border-gray-300 rounded-md">
//           <thead>
//             <tr className="bg-green-100">
//               {headers.map((header, index) => (
//                 <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-green-200">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, index) => (
//               <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.sno}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200 font-medium">{row.type}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.overall}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.veryGood}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.good}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.less}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.noResponse}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* पाई चार्ट कंटेनर */}
//       <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
//         <canvas ref={chartRef} />
//       </div>

//       {/* कस्टम लेजेंड और लेबल */}
//       <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
//         <div className="text-center">
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//             <span>बहुत अच्छा कार्य कर रहे हैं: 532; 34%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
//             <span>अच्छा कार्य कर रहे हैं: 942; 60%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//             <span>कम कार्य कर रहे हैं: 53; 3%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2">
//             <div className="w-4 h-4 bg-brown-600 rounded-full"></div>
//             <span>कोई प्रतिक्रिया नहीं: 43; 3%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MinisterYearPerformanceChart;





import React, { useEffect, useRef, useState } from 'react';
import Chart, { Chart as ChartType } from 'chart.js/auto';

interface Category {
  key: 'veryGood' | 'good' | 'less' | 'noResponse';
  label: string;
  color: string;
}

interface DataRow {
  sno: number | string;
  type: string;
  counts: {
    veryGood: number;
    good: number;
    less: number;
    noResponse: number;
  };
}

interface TableRow {
  sno: number | string;
  type: string;
  overall: number;
  veryGood: string;
  good: string;
  less: string;
  noResponse: string;
}

const MinisterYearPerformanceChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartType | null>(null);

  // State for data rows - initialize with defaults; update via setDataRows for backend data
  const [dataRows] = useState<DataRow[]>([
    { 
      sno: 1, 
      type: 'महिला लाभार्थी', 
      counts: { veryGood: 162, good: 222, less: 7, noResponse: 12 } 
    },
    { 
      sno: 2, 
      type: 'लाभार्थी के परिवार से', 
      counts: { veryGood: 370, good: 720, less: 46, noResponse: 31 } 
    },
    { 
      sno: '#', 
      type: 'कुल', 
      counts: { veryGood: 0, good: 0, less: 0, noResponse: 0 } // Total computed dynamically
    }
  ]);

  // State for categories - initialize with defaults; update via setCategories if needed
  const [categories] = useState<Category[]>([
    { key: 'veryGood', label: 'बहुत अच्छा कार्य कर रहे हैं', color: '#f97316' },
    { key: 'good', label: 'अच्छा कार्य कर रहे हैं', color: '#ec4899' },
    { key: 'less', label: 'ख़राब कार्य कर रहे हे', color: '#3b82f6' },
    { key: 'noResponse', label: 'कोई प्रतिक्रिया नहीं', color: '#92400e' }
  ]);

  const title = 'मंत्री जी के एक साल का कार्यकाल'; // Can also be state if dynamic

  // Example: Placeholder for fetching data from backend (uncomment and adapt as needed)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/minister-year-performance'); // Your backend endpoint
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
      acc.veryGood += row.counts.veryGood;
      acc.good += row.counts.good;
      acc.less += row.counts.less;
      acc.noResponse += row.counts.noResponse;
    }
    return acc;
  }, { veryGood: 0, good: 0, less: 0, noResponse: 0 });

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
        veryGood: totals.veryGood,
        good: totals.good,
        less: totals.less,
        noResponse: totals.noResponse
      };
      rowTotal = overallTotal;
    }
    return {
      sno: row.sno,
      type: row.type,
      overall: rowTotal,
      veryGood: `${rowCounts.veryGood} (${rowTotal > 0 ? ((rowCounts.veryGood / rowTotal) * 100).toFixed(0) : '0'}%)`,
      good: `${rowCounts.good} (${rowTotal > 0 ? ((rowCounts.good / rowTotal) * 100).toFixed(0) : '0'}%)`,
      less: `${rowCounts.less} (${rowTotal > 0 ? ((rowCounts.less / rowTotal) * 100).toFixed(0) : '0'}%)`,
      noResponse: `${rowCounts.noResponse} (${rowTotal > 0 ? ((rowCounts.noResponse / rowTotal) * 100).toFixed(0) : '0'}%)`,
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
                label: function(context: any) {
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
        <table className="min-w-full bg-green-50 border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-green-100">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-green-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.sno}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200 font-medium">{row.type}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.overall}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.veryGood}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.good}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.less}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.noResponse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* पाई चार्ट कंटेनर */}
      <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
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

export default MinisterYearPerformanceChart;