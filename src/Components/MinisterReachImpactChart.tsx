// import React, { useEffect, useRef } from 'react';
// import Chart, { Chart as ChartType } from 'chart.js/auto';

// interface TableRow {
//   sno: number | string;
//   type: string;
//   overall: number;
//   correctName: string;
//   wrongName: string;
//   notKnow: string;
//   noResponse: string;
// }

// const MinisterReachImpactChart: React.FC = () => {
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
//           labels: ['हा जानते हैं - सही नाम बताय', 'हा - जानते हैं पर गलत नाम बताय', 'नही जानते', 'कोई प्रतिक्रिया नहीं'],
//           datasets: [{
//             data: [1570, 126, 584, 3],
//             backgroundColor: [
//               '#f97316', // Orange for correct name (large slice)
//               '#ec4899', // Pink for wrong name
//               '#3b82f6', // Blue for not know
//               '#92400e'  // Brown for no response
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
//     { sno: 1, type: 'महिला लाभार्थी', overall: 728, correctName: '403 (55%)', wrongName: '55 (8%)', notKnow: '271 (37%)', noResponse: '0' },
//     { sno: 2, type: 'लाभार्थी के परिवार से', overall: 1555, correctName: '1167 (75%)', wrongName: '71 (5%)', notKnow: '313 (20%)', noResponse: '3' },
//     { sno: '#', type: 'Total', overall: 2283, correctName: '1570 (69%)', wrongName: '126 (5%)', notKnow: '584 (26%)', noResponse: '3' }
//   ];

//   const headers: string[] = [
//     'SNO',
//     'टाइप',
//     'ओवर ऑल',
//     'हा जानते हैं - सही नाम बताय',
//     'हा - जानते हैं पर गलत नाम बताय',
//     'नही जानते',
//     'कोई प्रतिक्रिया नहीं'
//   ];

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
//       {/* Title */}
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">मननीय मुख्यमांत्री जी का  जमीनी स्तर तक जुड़ाव/पहचान</h1>

//       {/* Table */}
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
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.correctName}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.wrongName}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.notKnow}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.noResponse}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pie Chart Container */}
//       <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
//         <canvas ref={chartRef} />
//       </div>

//       {/* Custom Legend and Labels */}
//       <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
//         <div className="text-center">
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//             <span>हा जानते हैं - सही नाम बताय: 1570; 69%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
//             <span>हा - जानते हैं पर गलत नाम बताय: 126; 5%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//             <span>नही जानते: 584; 26%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2">
//             <div className="w-4 h-4 bg-brown-600 rounded-full"></div>
//             <span>कोई प्रतिक्रिया नहीं: 3; 0%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MinisterReachImpactChart;





import React, { useEffect, useRef, useState } from 'react';
import Chart, { Chart as ChartType } from 'chart.js/auto';

interface Category {
  key: 'correctName' | 'wrongName' | 'notKnow' | 'noResponse';
  label: string;
  color: string;
}

interface DataRow {
  sno: number | string;
  type: string;
  counts: {
    correctName: number;
    wrongName: number;
    notKnow: number;
    noResponse: number;
  };
}

interface TableRow {
  sno: number | string;
  type: string;
  overall: number;
  correctName: string;
  wrongName: string;
  notKnow: string;
  noResponse: string;
}

const MinisterReachImpactChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartType | null>(null);

  // State for data rows - initialize with defaults; update via setDataRows for backend data
  const [dataRows] = useState<DataRow[]>([
    { 
      sno: 1, 
      type: 'महिला लाभार्थी', 
      counts: { correctName: 403, wrongName: 55, notKnow: 271, noResponse: 0 } 
    },
    { 
      sno: 2, 
      type: 'लाभार्थी के परिवार से', 
      counts: { correctName: 1167, wrongName: 71, notKnow: 313, noResponse: 3 } 
    },
    { 
      sno: '#', 
      type: 'Total', 
      counts: { correctName: 0, wrongName: 0, notKnow: 0, noResponse: 0 } // Total computed dynamically
    }
  ]);

  // State for categories - initialize with defaults; update via setCategories if needed
  const [categories] = useState<Category[]>([
    { key: 'correctName', label: 'हा जानते हैं - सही नाम बताय', color: '#f97316' },
    { key: 'wrongName', label: 'हा - जानते हैं पर गलत नाम बताय', color: '#ec4899' },
    { key: 'notKnow', label: 'नही जानते', color: '#3b82f6' },
    { key: 'noResponse', label: 'कोई प्रतिक्रिया नहीं', color: '#92400e' }
  ]);

  const title = 'मननीय मुख्यमांत्री जी का  जमीनी स्तर तक जुड़ाव/पहचान'; // Can also be state if dynamic

  // Example: Placeholder for fetching data from backend (uncomment and adapt as needed)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/minister-reach-impact'); // Your backend endpoint
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
      acc.correctName += row.counts.correctName;
      acc.wrongName += row.counts.wrongName;
      acc.notKnow += row.counts.notKnow;
      acc.noResponse += row.counts.noResponse;
    }
    return acc;
  }, { correctName: 0, wrongName: 0, notKnow: 0, noResponse: 0 });

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
        correctName: totals.correctName,
        wrongName: totals.wrongName,
        notKnow: totals.notKnow,
        noResponse: totals.noResponse
      };
      rowTotal = overallTotal;
    }
    return {
      sno: row.sno,
      type: row.type,
      overall: rowTotal,
      correctName: `${rowCounts.correctName} (${rowTotal > 0 ? ((rowCounts.correctName / rowTotal) * 100).toFixed(0) : '0'}%)`,
      wrongName: `${rowCounts.wrongName} (${rowTotal > 0 ? ((rowCounts.wrongName / rowTotal) * 100).toFixed(0) : '0'}%)`,
      notKnow: `${rowCounts.notKnow} (${rowTotal > 0 ? ((rowCounts.notKnow / rowTotal) * 100).toFixed(0) : '0'}%)`,
      noResponse: `${rowCounts.noResponse} (${rowTotal > 0 ? ((rowCounts.noResponse / rowTotal) * 100).toFixed(0) : '0'}%)`,
    };
  });

  // Headers based on categories
  const headers: string[] = [
    'SNO',
    'टाइप',
    'ओवर ऑल',
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
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h1>

      {/* Table */}
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
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.correctName}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.wrongName}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.notKnow}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.noResponse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie Chart Container */}
      <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
        <canvas ref={chartRef} />
      </div>

      {/* Custom Legend and Labels */}
      <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
        <div className="text-center">
          {legendItems}
        </div>
      </div>
    </div>
  );
};

export default MinisterReachImpactChart;