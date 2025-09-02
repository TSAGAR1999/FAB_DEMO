import React from 'react';
import ReactECharts from 'echarts-for-react';
import { PieChart } from 'lucide-react';

const RiskDistribution = () => {
  const riskData = [
    { name: 'Low Risk', value: 65, color: '#16a34a' },
    { name: 'Medium Risk', value: 25, color: '#eab308' },
    { name: 'High Risk', value: 10, color: '#dc2626' },
  ];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)',
    },
    legend: {
      show: false, // We'll render a custom legend below
    },
    series: [
      {
        type: 'pie',
        radius: ['70%', '90%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%',
          },
        },
        data: riskData.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-800">Risk Distribution</h3>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-4">
        <ReactECharts option={option} style={{ height: 200, width: 200 }} />
      </div>

      {/* Custom Legend */}
      <div className="space-y-2">
        {riskData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistribution;
