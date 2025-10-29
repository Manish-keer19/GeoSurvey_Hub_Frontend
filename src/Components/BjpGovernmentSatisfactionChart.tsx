import React, { useEffect, useRef, useState } from 'react';
import Chart, { Chart as ChartType } from 'chart.js/auto';

interface Category {
  key: 'verySatisfied' | 'fullySatisfied' | 'veryDissatisfied' | 'fullyDissatisfied';
  label: string;
  color: string;
}

interface DataRow {
  sno: number | string;
  type: string;
  counts: {
    verySatisfied: number;
    fullySatisfied: number;
    veryDissatisfied: number;
    fullyDissatisfied: number;
  };
}

interface TableRow {
  sno: number | string;
  type: string;
  overall: number;
  verySatisfied: string;
  fullySatisfied: string;
  veryDissatisfied: string;
  fullyDissatisfied: string;
}

const BjpGovernmentSatisfactionChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartType | null>(null);

  // State for data rows - initialize with defaults; update via setDataRows for backend data
  const [dataRows] = useState<DataRow[]>([
    { 
      sno: 1, 
      type: 'महिला लाभार्थी', 
      counts: { verySatisfied: 207, fullySatisfied: 495, veryDissatisfied: 20, fullyDissatisfied: 6 } 
    },
    { 
      sno: 2, 
      type: 'लाभार्थी के परिवार से', 
      counts: { verySatisfied: 514, fullySatisfied: 939, veryDissatisfied: 69, fullyDissatisfied: 33 } 
    },
    { 
      sno: '#', 
      type: 'कुल', 
      counts: { verySatisfied: 0, fullySatisfied: 0, veryDissatisfied: 0, fullyDissatisfied: 0 } // Total computed dynamically
    }
  ]);

  // State for categories - initialize with defaults; update via setCategories if needed
  const [categories] = useState<Category[]>([
    { key: 'verySatisfied', label: 'कुछ हद तक सींतुष्ट', color: '#10b981' },
    { key: 'fullySatisfied', label: 'पूरी तरह से संतुष्ट', color: '#f97316' },
    { key: 'veryDissatisfied', label: 'कुछ हद तक असंतुष्ट', color: '#eab308' },
    { key: 'fullyDissatisfied', label: 'पूरी तरह से असंतुष्ट', color: '#ec4899' }
  ]);

  const title = 'भाजपा सरकार के एक साल के कार्यकाल पर संतुष्टि/असंतुष्टि'; // Can also be state if dynamic

  // Example: Placeholder for fetching data from backend (uncomment and adapt as needed)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/bjp-government-satisfaction'); // Your backend endpoint
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
      acc.verySatisfied += row.counts.verySatisfied;
      acc.fullySatisfied += row.counts.fullySatisfied;
      acc.veryDissatisfied += row.counts.veryDissatisfied;
      acc.fullyDissatisfied += row.counts.fullyDissatisfied;
    }
    return acc;
  }, { verySatisfied: 0, fullySatisfied: 0, veryDissatisfied: 0, fullyDissatisfied: 0 });

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
        verySatisfied: totals.verySatisfied,
        fullySatisfied: totals.fullySatisfied,
        veryDissatisfied: totals.veryDissatisfied,
        fullyDissatisfied: totals.fullyDissatisfied
      };
      rowTotal = overallTotal;
    }
    return {
      sno: row.sno,
      type: row.type,
      overall: rowTotal,
      verySatisfied: `${rowCounts.verySatisfied} (${rowTotal > 0 ? ((rowCounts.verySatisfied / rowTotal) * 100).toFixed(0) : '0'}%)`,
      fullySatisfied: `${rowCounts.fullySatisfied} (${rowTotal > 0 ? ((rowCounts.fullySatisfied / rowTotal) * 100).toFixed(0) : '0'}%)`,
      veryDissatisfied: `${rowCounts.veryDissatisfied} (${rowTotal > 0 ? ((rowCounts.veryDissatisfied / rowTotal) * 100).toFixed(0) : '0'}%)`,
      fullyDissatisfied: `${rowCounts.fullyDissatisfied} (${rowTotal > 0 ? ((rowCounts.fullyDissatisfied / rowTotal) * 100).toFixed(0) : '0'}%)`,
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
              display: false // डिफ़ॉल्ट लेजेंड छिपाएं, हम कस्टम का उपयोग करेंगे
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
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.verySatisfied}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.fullySatisfied}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.veryDissatisfied}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.fullyDissatisfied}</td>
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

export default BjpGovernmentSatisfactionChart;