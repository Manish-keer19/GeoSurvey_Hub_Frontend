



// import React, { useEffect, useRef, useState } from 'react';
// import Chart, { Chart as ChartType } from 'chart.js/auto';

// interface Category {
//     key: 'improved' | 'same' | 'somewhat' | 'noResponse';
//     label: string;
//     color: string;
// }

// interface DataRow {
//     sno: number | string;
//     type: string;
//     counts: {
//         improved: number;
//         same: number;
//         somewhat: number;
//         noResponse: number;
//     };
// }

// interface TableRow {
//     sno: number | string;
//     type: string;
//     overall: number;
//     improved: string;
//     same: string;
//     somewhat: string;
//     noResponse: string;
// }

// interface EconomicStatusChartProps {
//     data: {
//         first: {
//             c20: number;
//             c21: number;
//             c22: number;
//             c23: number;
//         };
//         second: {
//             c25: number;
//             c26: number;
//             c27: number;
//             c28: number;
//         };
//     };
// }

// const EconomicStatusChart: React.FC<EconomicStatusChartProps> = ({ data }) => {

  
//  console.log("data in economic",data);



//     const [PaichartData, setPaichartData] = useState(data);

//     const chartRef = useRef<HTMLCanvasElement>(null);
//     const chartInstanceRef = useRef<ChartType | null>(null);
   

//     // State for data rows - initialize with defaults; update via setDataRows for backend data
//     const [dataRows] = useState<DataRow[]>([
//         {
//             sno: 1,
//             type: 'महिला लाभार्थी',
//             counts: { improved: PaichartData?.first?.c20, same: PaichartData?.first?.c22, somewhat: PaichartData?.first?.c21, noResponse: PaichartData?.first?.c23 }
//         },
//         {
//             sno: 2,
//             type: 'लाभार्थी के परिवार से',
//             counts: { improved: PaichartData?.second?.c25, same: PaichartData?.second?.c27, somewhat: PaichartData?.second?.c26, noResponse: PaichartData?.second?.c28 }
//         },
//         {
//             sno: '#',
//             type: 'Total',
//             counts: { improved:PaichartData?.first?.c20+ PaichartData?.second?.c25 , same:  PaichartData?.first?.c22+PaichartData?.second?.c27, somewhat: PaichartData?.first?.c21+PaichartData?.second?.c26, noResponse: PaichartData?.first?.c23+ PaichartData?.second?.c28} // Total computed dynamically
//         }
//     ]);

//     // State for categories - initialize with defaults; update via setCategories if needed
//     const [categories] = useState<Category[]>([
//         { key: 'improved', label: 'आर्थिक स्थिति सुधर गयी है', color: '#22c55e' },
//         { key: 'same', label: 'आर्थिक स्थिति पहले जैसी ही है', color: '#f97316' },
//         { key: 'somewhat', label: 'कुछ कह नहीं सकते', color: '#eab308' },
//         { key: 'noResponse', label: 'कोई प्रतिक्रिया नहीं', color: '#3b82f6' }
//     ]);

//     const title = 'आर्थिक स्थिति में सुधार'; // Can also be state if dynamic

//     // Example: Placeholder for fetching data from backend (uncomment and adapt as needed)
//     // useEffect(() => {
//     //   const fetchData = async () => {
//     //     try {
//     //       const response = await fetch('/api/economic-status'); // Your backend endpoint
//     //       const fetchedData = await response.json();
//     //       setDataRows(fetchedData.rows || []);
//     //       setCategories(fetchedData.categories || categories);
//     //     } catch (error) {
//     //       console.error('Error fetching data:', error);
//     //     }
//     //   };
//     //   fetchData();
//     // }, []);

//     // Compute totals for chart and legend (excluding total row)
//     const totals = dataRows.reduce((acc, row) => {
//         if (typeof row.sno === 'number') { // Exclude total row if it exists
//             acc.improved += row.counts.improved;
//             acc.same += row.counts.same;
//             acc.somewhat += row.counts.somewhat;
//             acc.noResponse += row.counts.noResponse;
//         }
//         return acc;
//     }, { improved: 0, same: 0, somewhat: 0, noResponse: 0 });

//     const overallTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

//     // Prepare chart data
//     const chartLabels = categories.map(cat => cat.label);
//     const chartData = categories.map(cat => totals[cat.key]);
//     const chartColors = categories.map(cat => cat.color);

//     // Prepare table data with percentages
//     const tableData: TableRow[] = dataRows.map(row => {
//         const rowTotal = Object.values(row.counts).reduce((sum, val) => sum + val, 0);
//         return {
//             sno: row.sno,
//             type: row.type,
//             overall: rowTotal,
//             improved: `${row.counts.improved} (${rowTotal > 0 ? ((row.counts.improved / rowTotal) * 100).toFixed(0) : '0'}%)`,
//             same: `${row.counts.same} (${rowTotal > 0 ? ((row.counts.same / rowTotal) * 100).toFixed(0) : '0'}%)`,
//             somewhat: `${row.counts.somewhat} (${rowTotal > 0 ? ((row.counts.somewhat / rowTotal) * 100).toFixed(0) : '0'}%)`,
//             noResponse: `${row.counts.noResponse} (${rowTotal > 0 ? ((row.counts.noResponse / rowTotal) * 100).toFixed(0) : '0'}%)`,
//         };
//     });

//     // Headers based on categories
//     const headers: string[] = [
//         'SNO',
//         'टाइप',
//         'ओवर ऑल',
//         ...categories.map(cat => cat.label),
//     ];

//     useEffect(() => {
//         if (chartRef.current) {
//             const ctx = chartRef.current.getContext('2d');
//             if (!ctx) return;

//             if (chartInstanceRef.current) {
//                 chartInstanceRef.current.destroy();
//             }

//             chartInstanceRef.current = new Chart(ctx, {
//                 type: 'pie' as const,
//                 data: {
//                     labels: chartLabels,
//                     datasets: [{
//                         data: chartData,
//                         backgroundColor: chartColors,
//                         borderWidth: 2,
//                         borderColor: '#ffffff'
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                         legend: {
//                             display: false // Hide default legend, we'll use custom
//                         },
//                         tooltip: {
//                             callbacks: {
//                                 label: function (context: any) {
//                                     const label = context.label || '';
//                                     const value = context.parsed;
//                                     const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
//                                     const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
//                                     return `${label}: ${value} (${percentage}%)`;
//                                 }
//                             }
//                         }
//                     }
//                 }
//             });
//         }

//         return () => {
//             if (chartInstanceRef.current) {
//                 chartInstanceRef.current.destroy();
//             }
//         };
//     }, [chartLabels, chartData, chartColors]); // Re-run if data changes

//     // Custom legend items
//     const legendItems = categories.map(cat => {
//         const count = totals[cat.key];
//         const percentage = overallTotal > 0 ? ((count / overallTotal) * 100).toFixed(0) : '0';
//         return (
//             <div key={cat.key} className="inline-flex items-center space-x-2 mb-2">
//                 <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: cat.color }}></div>
//                 <span>{`${cat.label}: ${count}; ${percentage}%`}</span>
//             </div>
//         );
//     });

//     return (
//         <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
//             {/* Title */}
//             <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h1>

//             {/* Table */}
//             <div className="overflow-x-auto mb-6">
//                 <table className="min-w-full bg-green-50 border border-gray-300 rounded-md">
//                     <thead>
//                         <tr className="bg-green-100">
//                             {headers.map((header, index) => (
//                                 <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-green-200">
//                                     {header}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {tableData.map((row, index) => (
//                             <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
//                                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.sno}</td>
//                                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200 font-medium">{row.type}</td>
//                                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.overall}</td>
//                                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.improved}</td>
//                                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.same}</td>
//                                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.somewhat}</td>
//                                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.noResponse}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pie Chart Container */}
//             <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
//                 <canvas ref={chartRef} />
//             </div>

//             {/* Custom Legend and Labels */}
//             <div className="flex flex-col items-center space-y-2 text-sm text-gray-700">
//                 <div className="text-center">
//                     {legendItems}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EconomicStatusChart;




import React, { useEffect, useRef, useMemo, memo } from 'react';
import Chart, { Chart as ChartJS } from 'chart.js/auto';

// === Types ===
interface RawCountData {
  c20?: number | string;
  c21?: number | string;
  c22?: number | string;
  c23?: number | string;
  c25?: number | string;
  c26?: number | string;
  c27?: number | string;
  c28?: number | string;
}

interface ApiData {
  first?: RawCountData;
  second?: RawCountData;
}

interface EconomicStatusChartProps {
  data: ApiData;
}

// === Default Categories ===
const CATEGORIES = [
  { key: 'improved' as const, label: 'आर्थिक स्थिति सुधर गयी है', color: '#22c55e' },
  { key: 'same' as const, label: 'आर्थिक स्थिति पहले जैसी ही है', color: '#f97316' },
  { key: 'somewhat' as const, label: 'कुछ कह नहीं सकते', color: '#eab308' },
  { key: 'noResponse' as const, label: 'कोई प्रतिक्रिया नहीं', color: '#3b82f6' },
] as const;

// === Safe Number Conversion ===
const toNumber = (val: any): number => {
  const num = Number(val);
  return isNaN(num) || num < 0 ? 0 : Math.floor(num);
};

// === Main Component ===
const EconomicStatusChart: React.FC<EconomicStatusChartProps> = memo(({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // === Extract and Validate Data ===
  const dataRows = useMemo(() => {
    const first = data.first || {};
    const second = data.second || {};

    const row1 = {
      improved: toNumber(first.c20),
      same: toNumber(first.c22),
      somewhat: toNumber(first.c21),
      noResponse: toNumber(first.c23),
    };

    const row2 = {
      improved: toNumber(second.c25),
      same: toNumber(second.c27),
      somewhat: toNumber(second.c26),
      noResponse: toNumber(second.c28),
    };

    const total = {
      improved: row1.improved + row2.improved,
      same: row1.same + row2.same,
      somewhat: row1.somewhat + row2.somewhat,
      noResponse: row1.noResponse + row2.noResponse,
    };

    return [
      { sno: 1, type: 'महिला लाभार्थी', counts: row1 },
      { sno: 2, type: 'लाभार्थी के परिवार से', counts: row2 },
      { sno: '#', type: 'Total', counts: total },
    ] as const;
  }, [data]);

  // === Compute Totals (excluding Total row) ===
  const totals = useMemo(() => {
    return dataRows.reduce((acc, row) => {
      if (typeof row.sno === 'number') {
        acc.improved += row.counts.improved;
        acc.same += row.counts.same;
        acc.somewhat += row.counts.somewhat;
        acc.noResponse += row.counts.noResponse;
      }
      return acc;
    }, { improved: 0, same: 0, somewhat: 0, noResponse: 0 });
  }, [dataRows]);

  const overallTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  // === Table Data with Percentages ===
  const tableData = useMemo(() => {
    return dataRows.map(row => {
      const total =
        row.counts.improved +
        row.counts.same +
        row.counts.somewhat +
        row.counts.noResponse;

      const percent = (count: number) =>
        total > 0 ? ((count / total) * 100).toFixed(0) : '0';

      return {
        sno: row.sno,
        type: row.type,
        overall: total,
        improved: `${row.counts.improved} (${percent(row.counts.improved)}%)`,
        same: `${row.counts.same} (${percent(row.counts.same)}%)`,
        somewhat: `${row.counts.somewhat} (${percent(row.counts.somewhat)}%)`,
        noResponse: `${row.counts.noResponse} (${percent(row.counts.noResponse)}%)`,
      };
    });
  }, [dataRows]);

  // === Chart Data ===
  const { labels, dataset, colors } = useMemo(() => {
    return {
      labels: CATEGORIES.map(c => c.label),
      dataset: CATEGORIES.map(c => totals[c.key]),
      colors: CATEGORIES.map(c => c.color),
    };
  }, [totals]);

  // === Legend Items ===
  const legendItems = CATEGORIES.map(cat => {
    const count = totals[cat.key];
    const percent = overallTotal > 0 ? ((count / overallTotal) * 100).toFixed(0) : '0';
    return (
      <div key={cat.key} className="inline-flex items-center gap-2 text-sm">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: cat.color }}
          aria-hidden="true"
        />
        <span>
          {cat.label}: <strong>{count}</strong> ({percent}%)
        </span>
      </div>
    );
  });

  // === Chart Effect ===
  useEffect(() => {
    if (!chartRef.current || overallTotal === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy old chart
    chartInstanceRef.current?.destroy();

    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: dataset,
          backgroundColor: colors,
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
                const percent = overallTotal > 0 ? ((value / overallTotal) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${value} (${percent}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [labels, dataset, colors, overallTotal]);

  // === Render ===
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        आर्थिक स्थिति में सुधार
      </h1>

      {/* Table */}
      <div className="overflow-x-auto mb-6 rounded-md border border-gray-300">
        <table className="min-w-full bg-green-50">
          <thead>
            <tr className="bg-green-100">
              {['SNO', 'टाइप', 'ओवर ऑल', ...CATEGORIES.map(c => c.label)].map((h, i) => (
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
            {tableData.map((row, i) => (
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
                  {row.overall}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.improved}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.same}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.somewhat}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.noResponse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie Chart */}
      <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
        {overallTotal === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>कोई डेटा उपलब्ध नहीं</p>
          </div>
        ) : (
          <canvas ref={chartRef} />
        )}
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
        {legendItems}
      </div>
    </div>
  );
});

EconomicStatusChart.displayName = 'EconomicStatusChart';

export default EconomicStatusChart;