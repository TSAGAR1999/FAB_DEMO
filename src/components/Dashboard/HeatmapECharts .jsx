import React from 'react';
import ReactECharts from 'echarts-for-react';

const HeatmapECharts = ({ heatmapData }) => {
  const weeks = heatmapData[0]?.data.map(cell => cell.week) || [];
  const categories = heatmapData.map(row => row.category);

  const seriesData = [];
  heatmapData.forEach((row, rowIndex) => {
    row.data.forEach((cell, colIndex) => {
      seriesData.push([colIndex, rowIndex, cell.value]);
    });
  });

  const option = {
    tooltip: {
      position: 'top',
      formatter: function (params) {
        const [x, y, value] = params.value;
        return `${categories[y]} - ${weeks[x]}: ${value}%`;
      },
    },
    grid: {
      height: '80%',
      top: '10%',
      left: '5%',
      right: '5%',
    },
    xAxis: {
      type: 'category',
      data: weeks,
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: categories,
      splitArea: { show: true },
    },
    visualMap: {
      min: 50,
      max: 100,
      show: false, // We'll show custom legends instead
      inRange: {
        color: ['#f87171', '#fb923c', '#facc15', '#4ade80'], // red, orange, yellow, green
      },
    },
    series: [
      {
        name: 'Performance',
        type: 'heatmap',
        data: seriesData,
        label: {
          show: true,
          formatter: '{@[2]}%',
          color: '#fff',
          fontSize: 11,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className="overflow-x-auto flex justify-center w-full items-center z-10">
      <div className="max-w-[800px]">
        <ReactECharts option={option} style={{ height: `${heatmapData.length * 40 + 100}px`, width: '100%' }} />

        {/* Performance Legend */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="text-gray-600">Performance:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-gray-600">Poor (50-64%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-gray-600">Fair (65-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-gray-600">Good (75-84%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-gray-600">Excellent (85%+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapECharts;
