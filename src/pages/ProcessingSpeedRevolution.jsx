import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useQuery } from '@tanstack/react-query';
import { postGetKPIData } from '../API/BqsApi';

function toUtcMs(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export default function ProcessingSpeedRevolution() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ProcessingSpeedRevolutionData"],
    queryFn: () =>
      postGetKPIData(
        "SELECT DATE_FORMAT(FROM_UNIXTIME(p.submission_date/1000), '%Y-%m-%d') AS day, AVG(TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(p.submission_date/1000), FROM_UNIXTIME(f.decision_date/1000)))/60.0 AS avg_minutes FROM t_6899ed16e9c2d32956987b9c_t p JOIN t_689b1ed4e9c2d3295698807d_t f ON p.application_id = f.application_id WHERE p.submission_date BETWEEN 1735689600000 AND 1743609599000 GROUP BY day ORDER BY day;"
      ),
  });


  useEffect(() => {
    if (!containerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, null, { renderer: 'canvas' });
    }
    const chart = chartRef.current;

    // Clean the data: convert to days, clamp negatives to 0
    const seriesData = data.data
      .slice()
      .sort((a, b) => toUtcMs(a.day) - toUtcMs(b.day))
      .map(d => {
        const days = d.avg_minutes / 1440;
        return [toUtcMs(d.day), Math.max(0, days)];
      });

    const option = {
      useUTC: true,
      backgroundColor: 'transparent',
      grid: { left: 64, right: 20, top: 20, bottom: 44, containLabel: true },

      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: params => {
          const p = params[0];
          const ts = p?.value?.[0];
          const days = p?.value?.[1] ?? 0;
          const minutes = days * 1440;
          const dateStr = echarts.format.formatTime('yyyy-MM-dd', ts, true);
          return `${dateStr}<br/><b>${days.toFixed(2)} days</b><br/>(${Math.round(minutes).toLocaleString()} min)`;
        }
      },

      xAxis: {
        name: "Date",
         nameLocation: 'middle',
         nameGap: 36,
        type: 'time',
        boundaryGap: false,
        splitNumber: 6,
        minInterval: 24 * 3600 * 1000,
        axisLabel: {
          color: '#374151',
          hideOverlap: true,
          margin: 12,
          formatter: val => echarts.format.formatTime('yyyy-MM-dd', val, true)
        },
        axisLine: { show: true, lineStyle: { color: '#9CA3AF' } },
        splitLine: { lineStyle: { color: '#E5E7EB' } }
      },

      yAxis: {
        type: 'value',
        name: 'Avg (days)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0, // 👈 force baseline at 0
        axisLabel: { color: '#374151' },
        axisLine: { show: true, lineStyle: { color: '#9CA3AF' } },
        splitLine: { lineStyle: { color: '#E5E7EB' } }
      },

      series: [{
        name: 'Avg Days',
        type: 'line',
        data: seriesData,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: true,
        lineStyle: { width: 2, color: '#3366cc' },
        itemStyle: { color: '#3366cc' },
        markLine: {
          symbol: 'none',
          lineStyle: { type: 'dashed' },
          data: [{ yAxis: 0 }]
        }
      }],

      animationDuration: 600
    };

    chart.setOption(option, true);

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded-xl">
        Loading...
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div>
    <h1 className="mb-3">Processing Speed Revolution</h1>
      <div
        ref={containerRef}
        className="h-96 w-full rounded-xl bg-white"
      />
    </div>
      
  );
}
