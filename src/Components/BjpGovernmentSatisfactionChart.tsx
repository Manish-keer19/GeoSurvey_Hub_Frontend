import React, { useEffect, useRef, useMemo, memo } from 'react';
import Chart, { Chart as ChartJS } from 'chart.js/auto';

// === Types ===
interface ApiData {
  first?: {
    c75?: number | string; // verySatisfied
    c74?: number | string; // fullySatisfied
    c77?: number | string; // veryDissatisfied
    c76?: number | string; // fullyDissatisfied
  };
  second?: {
    c80?: number | string; // verySatisfied
    c79?: number | string; // fullySatisfied
    c82?: number | string; // veryDissatisfied
    c81?: number | string; // fullyDissatisfied
  };
}

interface BjpGovernmentSatisfactionChartProps {
  data: ApiData;
}

// === Categories (Fixed) ===
const CATEGORIES = [
  { key: 'verySatisfied' as const, label: 'कुछ हद तक संतुष्ट', color: '#10b981' },
  { key: 'fullySatisfied' as const, label: 'पूरी तरह से संतुष्ट', color: '#f97316' },
  { key: 'veryDissatisfied' as const, label: 'कुछ हद तक असंतुष्ट', color: '#eab308' },
  { key: 'fullyDissatisfied' as const, label: 'पूरी तरह से असंतुष्ट', color: '#ec4899' },
] as const;

// === Safe Number Conversion ===
const toNumber = (val: any): number => {
  const num = Number(val);
  return isNaN(num) || num < 0 ? 0 : Math.floor(num);
};

// === Main Component ===
const BjpGovernmentSatisfactionChart: React.FC<BjpGovernmentSatisfactionChartProps> = memo(({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // === Extract Data ===
  const rows = useMemo(() => {
    const first = data.first || {};
    const second = data.second || {};

    const row1 = {
      verySatisfied: toNumber(first.c75),
      fullySatisfied: toNumber(first.c74),
      veryDissatisfied: toNumber(first.c77),
      fullyDissatisfied: toNumber(first.c76),
    };

    const row2 = {
      verySatisfied: toNumber(second.c80),
      fullySatisfied: toNumber(second.c79),
      veryDissatisfied: toNumber(second.c82),
      fullyDissatisfied: toNumber(second.c81),
    };

    const total = {
      verySatisfied: row1.verySatisfied + row2.verySatisfied,
      fullySatisfied: row1.fullySatisfied + row2.fullySatisfied,
      veryDissatisfied: row1.veryDissatisfied + row2.veryDissatisfied,
      fullyDissatisfied: row1.fullyDissatisfied + row2.fullyDissatisfied,
    };

    return [
      { sno: 1, type: 'महिला लाभार्थी', counts: row1 },
      { sno: 2, type: 'लाभार्थी के परिवार से', counts: row2 },
      { sno: '#', type: 'कुल', counts: total },
    ] as const;
  }, [data]);

  // === Compute Totals (excluding total row) ===
  const totals = useMemo(() => {
    return rows.reduce((acc, row) => {
      if (typeof row.sno === 'number') {
        acc.verySatisfied += row.counts.verySatisfied;
        acc.fullySatisfied += row.counts.fullySatisfied;
        acc.veryDissatisfied += row.counts.veryDissatisfied;
        acc.fullyDissatisfied += row.counts.fullyDissatisfied;
      }
      return acc;
    }, { verySatisfied: 0, fullySatisfied: 0, veryDissatisfied: 0, fullyDissatisfied: 0 });
  }, [rows]);

  const overallTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  // === Table Data with Percentages ===
  const tableData = useMemo(() => {
    return rows.map(row => {
      const isTotalRow = typeof row.sno !== 'number';
      const counts = isTotalRow ? totals : row.counts;
      const rowTotal = isTotalRow ? overallTotal : Object.values(row.counts).reduce((a, b) => a + b, 0);

      const percent = (count: number) =>
        rowTotal > 0 ? ((count / rowTotal) * 100).toFixed(0) : '0';

      return {
        sno: row.sno,
        type: row.type,
        overall: rowTotal,
        verySatisfied: `${counts.verySatisfied} (${percent(counts.verySatisfied)}%)`,
        fullySatisfied: `${counts.fullySatisfied} (${percent(counts.fullySatisfied)}%)`,
        veryDissatisfied: `${counts.veryDissatisfied} (${percent(counts.veryDissatisfied)}%)`,
        fullyDissatisfied: `${counts.fullyDissatisfied} (${percent(counts.fullyDissatisfied)}%)`,
      };
    });
  }, [rows, totals, overallTotal]);

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
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
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
      {/* शीर्षक */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        भाजपा सरकार के एक साल के कार्यकाल पर संतुष्टि/असंतुष्टि
      </h1>

      {/* तालिका */}
      <div className="overflow-x-auto mb-6 rounded-md border border-gray-300">
        <table className="min-w-full bg-green-50">
          <thead>
            <tr className="bg-green-100">
              {['क्र.सं.', 'प्रकार', 'कुल', ...CATEGORIES.map(c => c.label)].map((h, i) => (
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
            {tableData.map((row, i) => {
              const isTotal = row.sno === '#';
              return (
                <tr
                  key={i}
                  className={
                    isTotal
                      ? 'bg-green-100 font-bold'
                      : `${i % 2 === 0 ? 'bg-green-50' : 'bg-white'} hover:bg-green-100 transition-colors`
                  }
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
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.verySatisfied}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.fullySatisfied}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.veryDissatisfied}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.fullyDissatisfied}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* पाई चार्ट कंटेनर */}
      <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
        {overallTotal === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>कोई डेटा उपलब्ध नहीं</p>
          </div>
        ) : (
          <canvas ref={chartRef} />
        )}
      </div>

      {/* कस्टम लेजेंड */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
        {legendItems}
      </div>
    </div>
  );
});

BjpGovernmentSatisfactionChart.displayName = 'BjpGovernmentSatisfactionChart';

export default BjpGovernmentSatisfactionChart;