// import React, { useEffect, useRef } from 'react';
// import Chart, { Chart as ChartType } from 'chart.js/auto';

// interface TableRow {
//   sno: number | string;
//   type: string;
//   overall: number;
//   improved: string;
//   same: string;
//   somewhat: string;
//   noResponse: string;
// }

// const EconomicStatusChart: React.FC = () => {
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
//           labels: ['आर्थिक स्थिति सुधर गयी है', 'आर्थिक स्थिति पहले जैसी ही है', 'कुछ कह नहीं सकते', 'कुछ कह नहीं सकते'],
//           datasets: [{
//             data: [1931, 290, 54, 8],
//             backgroundColor: [
//               '#22c55e', // Green for improved (large slice)
//               '#f97316', // Orange for same
//               '#eab308', // Yellow for somewhat
//               '#3b82f6'  // Blue for no response
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
//     { sno: 1, type: 'महिला लाभार्थी', overall: 728, improved: '628 (86%)', same: '83 (11%)', somewhat: '17 (3%)', noResponse: '0' },
//     { sno: 2, type: 'लाभार्थी के परिवार से', overall: 1555, improved: '1303 (84%)', same: '207 (13%)', somewhat: '37 (2%)', noResponse: '8 (1%)' },
//     { sno: '#', type: 'Total', overall: 2283, improved: '1931 (85%)', same: '290 (13%)', somewhat: '54 (2%)', noResponse: '8' }
//   ];

//   const headers: string[] = [
//     'SNO',
//     'टाइप',
//     'ओवर ऑल',
//     'आर्थिक स्थिति सुधर गयी है',
//     'आर्थिक स्थिति पहले जैसी ही है',
//     'कुछ कह नहीं सकते',
//     'कोई प्रतिक्रिया नहीं'
//   ];

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
//       {/* Title */}
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">आर्थिक स्थिति में सुधार</h1>

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
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.improved}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.same}</td>
//                 <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.somewhat}</td>
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
//             <div className="w-4 h-4 bg-green-500 rounded-full"></div>
//             <span>आर्थिक स्थिति सुधर गयी है: 1931; 85%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//             <span>आर्थिक स्थिति पहले जैसी ही है: 290; 13%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2 mb-2">
//             <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
//             <span> 
//     'कुछ कह नहीं सकते',
//     : 54; 2%</span>
//           </div>
//           <div className="inline-flex items-center space-x-2">
//             <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//             <span>कोई प्रतिक्रिया नहीं: 8; 0%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EconomicStatusChart;




import React, { useEffect, useRef, useState } from 'react';
import Chart, { Chart as ChartType } from 'chart.js/auto';

interface Category {
    key: 'improved' | 'same' | 'somewhat' | 'noResponse';
    label: string;
    color: string;
}

interface DataRow {
    sno: number | string;
    type: string;
    counts: {
        improved: number;
        same: number;
        somewhat: number;
        noResponse: number;
    };
}

interface TableRow {
    sno: number | string;
    type: string;
    overall: number;
    improved: string;
    same: string;
    somewhat: string;
    noResponse: string;
}

const EconomicStatusChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<ChartType | null>(null);

    // State for data rows - initialize with defaults; update via setDataRows for backend data
    const [dataRows] = useState<DataRow[]>([
        {
            sno: 1,
            type: 'महिला लाभार्थी',
            counts: { improved: 628, same: 83, somewhat: 17, noResponse: 0 }
        },
        {
            sno: 2,
            type: 'लाभार्थी के परिवार से',
            counts: { improved: 1303, same: 207, somewhat: 37, noResponse: 8 }
        },
        {
            sno: '#',
            type: 'Total',
            counts: { improved: 0, same: 0, somewhat: 0, noResponse: 0 } // Total computed dynamically
        }
    ]);

    // State for categories - initialize with defaults; update via setCategories if needed
    const [categories] = useState<Category[]>([
        { key: 'improved', label: 'आर्थिक स्थिति सुधर गयी है', color: '#22c55e' },
        { key: 'same', label: 'आर्थिक स्थिति पहले जैसी ही है', color: '#f97316' },
        { key: 'somewhat', label: 'कुछ कह नहीं सकते', color: '#eab308' },
        { key: 'noResponse', label: 'कोई प्रतिक्रिया नहीं', color: '#3b82f6' }
    ]);

    const title = 'आर्थिक स्थिति में सुधार'; // Can also be state if dynamic

    // Example: Placeholder for fetching data from backend (uncomment and adapt as needed)
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await fetch('/api/economic-status'); // Your backend endpoint
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
            acc.improved += row.counts.improved;
            acc.same += row.counts.same;
            acc.somewhat += row.counts.somewhat;
            acc.noResponse += row.counts.noResponse;
        }
        return acc;
    }, { improved: 0, same: 0, somewhat: 0, noResponse: 0 });

    const overallTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

    // Prepare chart data
    const chartLabels = categories.map(cat => cat.label);
    const chartData = categories.map(cat => totals[cat.key]);
    const chartColors = categories.map(cat => cat.color);

    // Prepare table data with percentages
    const tableData: TableRow[] = dataRows.map(row => {
        const rowTotal = Object.values(row.counts).reduce((sum, val) => sum + val, 0);
        return {
            sno: row.sno,
            type: row.type,
            overall: rowTotal,
            improved: `${row.counts.improved} (${rowTotal > 0 ? ((row.counts.improved / rowTotal) * 100).toFixed(0) : '0'}%)`,
            same: `${row.counts.same} (${rowTotal > 0 ? ((row.counts.same / rowTotal) * 100).toFixed(0) : '0'}%)`,
            somewhat: `${row.counts.somewhat} (${rowTotal > 0 ? ((row.counts.somewhat / rowTotal) * 100).toFixed(0) : '0'}%)`,
            noResponse: `${row.counts.noResponse} (${rowTotal > 0 ? ((row.counts.noResponse / rowTotal) * 100).toFixed(0) : '0'}%)`,
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
                                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.improved}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.same}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.somewhat}</td>
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

export default EconomicStatusChart;