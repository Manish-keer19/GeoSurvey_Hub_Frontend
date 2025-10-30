import React, { useEffect, useRef, useMemo, memo } from 'react';
import Chart, { Chart as ChartJS } from 'chart.js/auto';

// === Types ===
interface ApiData {
  first?: {
    c40?: number | string; // correctName
    c41?: number | string; // wrongName
    c42?: number | string; // notKnow
    c43?: number | string; // noResponse
  };
  second?: {
    c45?: number | string; // correctName
    c46?: number | string; // wrongName
    c47?: number | string; // notKnow
    c48?: number | string; // noResponse
  };
}

interface MinisterReachImpactChartProps {
  data: ApiData;
}

// === Categories (Fixed) ===
const CATEGORIES = [
  { key: 'correctName' as const, label: 'हाँ जानते हैं - सही नाम बताया', color: '#f97316' },
  { key: 'wrongName' as const, label: 'हाँ - जानते हैं पर गलत नाम बताया', color: '#ec4899' },
  { key: 'notKnow' as const, label: 'नहीं जानते', color: '#3b82f6' },
  { key: 'noResponse' as const, label: 'कोई प्रतिक्रिया नहीं', color: '#92400e' },
] as const;

// === Safe Number Conversion ===
const toNumber = (val: any): number => {
  const num = Number(val);
  return isNaN(num) || num < 0 ? 0 : Math.floor(num);
};

// === Main Component ===
const MinisterReachImpactChart: React.FC<MinisterReachImpactChartProps> = memo(({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // === Extract Data ===
  const rows = useMemo(() => {
    const first = data.first || {};
    const second = data.second || {};

    const row1 = {
      correctName: toNumber(first.c40),
      wrongName: toNumber(first.c41),
      notKnow: toNumber(first.c42),
      noResponse: toNumber(first.c43),
    };

    const row2 = {
      correctName: toNumber(second.c45),
      wrongName: toNumber(second.c46),
      notKnow: toNumber(second.c47),
      noResponse: toNumber(second.c48),
    };

    const total = {
      correctName: row1.correctName + row2.correctName,
      wrongName: row1.wrongName + row2.wrongName,
      notKnow: row1.notKnow + row2.notKnow,
      noResponse: row1.noResponse + row2.noResponse,
    };

    return [
      { sno: 1, type: 'महिला लाभार्थी', counts: row1 },
      { sno: 2, type: 'लाभार्थी के परिवार से', counts: row2 },
      { sno: '#', type: 'Total', counts: total },
    ] as const;
  }, [data]);

  // === Compute Totals (excluding total row) ===
  const totals = useMemo(() => {
    return rows.reduce((acc, row) => {
      if (typeof row.sno === 'number') {
        acc.correctName += row.counts.correctName;
        acc.wrongName += row.counts.wrongName;
        acc.notKnow += row.counts.notKnow;
        acc.noResponse += row.counts.noResponse;
      }
      return acc;
    }, { correctName: 0, wrongName: 0, notKnow: 0, noResponse: 0 });
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
        correctName: `${counts.correctName} (${percent(counts.correctName)}%)`,
        wrongName: `${counts.wrongName} (${percent(counts.wrongName)}%)`,
        notKnow: `${counts.notKnow} (${percent(counts.notKnow)}%)`,
        noResponse: `${counts.noResponse} (${percent(counts.noResponse)}%)`,
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
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        मननीय मुख्यमांत्री जी का जमीनी स्तर तक जुड़ाव/पहचान
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
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.correctName}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.wrongName}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.notKnow}</td>
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

MinisterReachImpactChart.displayName = 'MinisterReachImpactChart';

export default MinisterReachImpactChart;