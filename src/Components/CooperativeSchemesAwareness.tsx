import React, { useEffect, useRef, useMemo, memo } from 'react';
import Chart, { Chart as ChartJS } from 'chart.js/auto';

// === Types ===
interface ApiData {
  first?: {
    c63?: number | string; // ad
    c62?: number | string; // social
    c65?: number | string; // govt
    c64?: number | string; // family
    c66?: number | string; // noinfo
  };
  second?: {
    c69?: number | string; // ad
    c68?: number | string; // social
    c71?: number | string; // govt
    c70?: number | string; // family
    c72?: number | string; // noinfo
  };
}

interface CooperativeSchemesAwarenessProps {
  data: ApiData;
}

// === Categories (Fixed) ===
const CATEGORIES = [
  { key: 'ad' as const, label: 'अखबार/विज्ञापन से', color: '#98FB98' },
  { key: 'social' as const, label: 'सोशल मीडिया से', color: '#FFD700' },
  { key: 'govt' as const, label: 'सरकारी कर्मचारियों से', color: '#9370DB' },
  { key: 'family' as const, label: 'परिवार से', color: '#DDA0DD' },
  { key: 'noinfo' as const, label: 'कोई जानकारी नहीं मिली है', color: '#8B4513' },
] as const;

// === Safe Number Conversion ===
const toNumber = (val: any): number => {
  const num = Number(val);
  return isNaN(num) || num < 0 ? 0 : Math.floor(num);
};

// === Main Component ===
const CooperativeSchemesAwareness: React.FC<CooperativeSchemesAwarenessProps> = memo(({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // === Extract Data ===
  const rows = useMemo(() => {
    const first = data.first || {};
    const second = data.second || {};

    const row1 = {
      ad: toNumber(first.c63),
      social: toNumber(first.c62),
      govt: toNumber(first.c65),
      family: toNumber(first.c64),
      noinfo: toNumber(first.c66),
    };

    const row2 = {
      ad: toNumber(second.c69),
      social: toNumber(second.c68),
      govt: toNumber(second.c71),
      family: toNumber(second.c70),
      noinfo: toNumber(second.c72),
    };

    const total = {
      ad: row1.ad + row2.ad,
      social: row1.social + row2.social,
      govt: row1.govt + row2.govt,
      family: row1.family + row2.family,
      noinfo: row1.noinfo + row2.noinfo,
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
        acc.ad += row.counts.ad;
        acc.social += row.counts.social;
        acc.govt += row.counts.govt;
        acc.family += row.counts.family;
        acc.noinfo += row.counts.noinfo;
      }
      return acc;
    }, { ad: 0, social: 0, govt: 0, family: 0, noinfo: 0 });
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
        ad: `${counts.ad} (${percent(counts.ad)}%)`,
        social: `${counts.social} (${percent(counts.social)}%)`,
        govt: `${counts.govt} (${percent(counts.govt)}%)`,
        family: `${counts.family} (${percent(counts.family)}%)`,
        noinfo: `${counts.noinfo} (${percent(counts.noinfo)}%)`,
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
        सहकारी योजनाओं की सूचना प्राप्ति का माध्यम
      </h1>

      {/* तालिका */}
      <div className="overflow-x-auto mb-6 rounded-md border border-orange-300">
        <table className="min-w-full bg-orange-50">
          <thead>
            <tr className="bg-orange-100">
              {['क्र.सं.', 'प्रकार', 'कुल', ...CATEGORIES.map(c => c.label)].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-orange-200"
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
                      ? 'bg-orange-100 font-bold'
                      : `${i % 2 === 0 ? 'bg-orange-50' : 'bg-white'} hover:bg-orange-100 transition-colors`
                  }
                >
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-orange-200">
                    {row.sno}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-orange-200">
                    {row.type}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b border-orange-200">
                    {row.overall}
                  </td>
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

CooperativeSchemesAwareness.displayName = 'CooperativeSchemesAwareness';

export default CooperativeSchemesAwareness;