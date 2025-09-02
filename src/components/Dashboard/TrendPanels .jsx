import ReactECharts from 'echarts-for-react';
import { LineChart } from 'lucide-react';

const getLineOption = (data, color, label) => ({
  grid: { top: 10, bottom: 30, left: 30, right: 10 },
  xAxis: {
    type: 'category',
    data: data.map(d => d.week),
    axisLabel: { fontSize: 10 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: '{value}%' },
    min: 0,
    max: 100,
  },
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      const item = params[0];
      return `${item.name}<br/>${label}: ${item.value}%`;
    },
  },
  series: [
    {
      name: label,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { color, width: 3 },
      areaStyle: { color: `${color}33` }, // Light fill
      data: data.map(d => d.value),
    },
  ],
});

const TrendPanels = ({ trendData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Automation Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Automation Rate</h3>
        </div>
        <ReactECharts option={getLineOption(trendData.automation, '#3b82f6', 'Automation Rate')} style={{ height: 180 }} />
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(trendData.automation.at(-1).value)}%
          </div>
          <div className="text-sm text-gray-600">Current Week</div>
        </div>
      </div>

      {/* Compliance Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Compliance Rate</h3>
        </div>
        <ReactECharts option={getLineOption(trendData.compliance, '#16a34a', 'Compliance Rate')} style={{ height: 180 }} />
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(trendData.compliance.at(-1).value)}%
          </div>
          <div className="text-sm text-gray-600">Current Week</div>
        </div>
      </div>

      {/* Efficiency Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Efficiency Rate</h3>
        </div>
        <ReactECharts option={getLineOption(trendData.efficiency, '#9333ea', 'Efficiency Rate')} style={{ height: 180 }} />
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(trendData.efficiency.at(-1).value)}%
          </div>
          <div className="text-sm text-gray-600">Current Week</div>
        </div>
      </div>
    </div>
  );
};

export default TrendPanels;
