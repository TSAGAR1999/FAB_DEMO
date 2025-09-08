import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const chartData = [
  { day: "2025-01-01", pct: 66.66667 },
  { day: "2025-01-02", pct: 66.66667 },
  { day: "2025-01-03", pct: 75.0 },
  { day: "2025-01-04", pct: 33.33333 },
  { day: "2025-01-05", pct: 100.0 },
  { day: "2025-01-15", pct: 100.0 },
  { day: "2025-01-16", pct: 100.0 },
  { day: "2025-01-17", pct: 100.0 },
  { day: "2025-01-20", pct: 100.0 },
  { day: "2025-01-22", pct: 0.0 },
  { day: "2025-02-01", pct: 100.0 },
  { day: "2025-02-05", pct: 100.0 },
  { day: "2025-02-10", pct: 100.0 },
  { day: "2025-02-15", pct: 100.0 },
  { day: "2025-02-20", pct: 100.0 },
  { day: "2025-02-25", pct: 100.0 },
  { day: "2025-03-02", pct: 100.0 },
  { day: "2025-03-06", pct: 100.0 },
  { day: "2025-03-10", pct: 100.0 },
  { day: "2025-03-16", pct: 100.0 },
  { day: "2025-03-21", pct: 100.0 },
  { day: "2025-03-23", pct: 100.0 },
  { day: "2025-03-26", pct: 100.0 },
  { day: "2025-03-29", pct: 100.0 },
  { day: "2025-03-30", pct: 100.0 },
  { day: "2025-03-31", pct: 100.0 },
];

export default function BarChart() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, null, {
        renderer: "canvas",
      });
    }
    const chart = chartRef.current;

    // prepare data
    const categories = chartData.map((d) => d.day);
    const values = chartData.map((d) => d.pct);

    const option = {
      backgroundColor: "transparent",
      grid: { left: 60, right: 40, top: 20, bottom: 60, containLabel: true },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: {
          rotate: 45,
          color: "#374151",
          fontSize: 11,
        },
        axisLine: { lineStyle: { color: "#9CA3AF" } },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { formatter: (v) => v + "%", color: "#374151" },
        splitLine: { lineStyle: { color: "#E5E7EB" } },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const p = params[0];
          return `${p.axisValue}<br/><b>${p.value.toFixed(2)}%</b>`;
        },
      },
      series: [
        {
          type: "bar",
          data: values,
          barWidth: 24,
          itemStyle: {
            color: "#3366cc",
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            show: true,
            position: "top",
            formatter: (p) => `${p.value.toFixed(0)}%`,
            color: "#111827",
            fontSize: 11,
          },
        },
      ],
      animationDuration: 600,
    };

    chart.setOption(option, true);

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-96 w-1/2 rounded-xl border border-gray-200 bg-white"
    />
  );
}
