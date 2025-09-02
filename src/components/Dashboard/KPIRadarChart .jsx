import React from 'react';
import ReactECharts from 'echarts-for-react';
import { X } from 'lucide-react';

const KPIRadarChart = ({ selectedKPIs = [], removeKPI, insights }) => {
const getRadarOption = () => {
  const indicators = selectedKPIs.map(kpi => ({
    name: kpi.name,
    max: 100,
  }));

  const dataValues = selectedKPIs.map(kpi => kpi.value);

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#111827',
        fontSize: 12,
      },
      formatter: function (params) {
        const values = params.value;
        return values
          .map((val, i) => {
            return `<div><strong>${indicators[i].name}</strong>: ${val}${selectedKPIs[i].unit}</div>`;
          })
          .join('');
      },
    },
    radar: {
      shape: 'polygon',
      radius: '65%',
      indicator: indicators,
      axisName: {
        color: '#374151',
        fontSize: 12,
      },
      splitArea: {
        areaStyle: {
          color: ['#f9fafb', '#f3f4f6'],
        },
      },
      splitLine: {
        lineStyle: {
          color: '#d1d5db',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db',
        },
      },
    },
    series: [
      {
        name: 'KPI Performance',
        type: 'radar',
        data: [
          {
            value: dataValues,
            name: 'Performance',
          },
        ],
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#3b82f6',
          width: 2,
        },
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: 'rgba(59,130,246,0.3)',
        },
        emphasis: {
          lineStyle: {
            width: 4,
          },
          areaStyle: {
            color: 'rgba(59,130,246,0.5)',
          },
          itemStyle: {
            color: '#1d4ed8',
          },
        },
        label: {
          show: true,
          formatter: '{@[2]}',
          color: '#1f2937',
          fontSize: 10,
        },
        animationDuration: 800,
        animationEasing: 'cubicOut',
      },
    ],
  };
};


  return (
    <div className="w-full">
      {/* Selected KPIs */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Selected KPIs ({selectedKPIs.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {selectedKPIs.map(kpi => (
            <div
              key={kpi.id}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              <span>
                {kpi.name}: {kpi.value}
                {kpi.unit}
              </span>
              <button onClick={() => removeKPI(kpi.id)} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="mb-6">
        {selectedKPIs.length > 0 ? (
          <ReactECharts option={getRadarOption()} style={{ height: 300 }} />
        ) : (
          <div className="text-sm text-gray-500">No KPIs selected to show radar chart.</div>
        )}
      </div>

      {/* Insights */}
      {insights && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Overall Performance Index:</span>
              <span
                className={`ml-2 font-medium ${
                  insights.overall > 80
                    ? 'text-green-600'
                    : insights.overall > 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {insights.overall}/100
              </span>
            </div>
            <div>
              <span className="text-gray-600">Strongest Area:</span>
              <span className="ml-2 font-medium text-green-600">{insights.strongest}</span>
            </div>
            <div>
              <span className="text-gray-600">Needs Attention:</span>
              <span className="ml-2 font-medium text-orange-600">{insights.weakest}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-gray-600">Recommendation:</span>
            <span className="ml-2 text-gray-800">{insights.recommendations}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIRadarChart;
