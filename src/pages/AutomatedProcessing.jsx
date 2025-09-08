import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { postGetKPIData } from "../API/BqsApi";

function toUtcMs(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export default function AutomatedProcessing() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["AutomatedProcessingData"],
    queryFn: () =>
      postGetKPIData(
        "SELECT DATE_FORMAT(FROM_UNIXTIME(decision_date/1000), '%Y-%m-%d') AS day, 100.0 * SUM(CASE WHEN manual_intervention=0 THEN 1 ELSE 0 END)/COUNT(*) AS pct FROM t_689b1ed4e9c2d3295698807d_t WHERE FROM_UNIXTIME(decision_date/1000) BETWEEN FROM_UNIXTIME(1735689600000/1000) AND FROM_UNIXTIME(1743609599000/1000) GROUP BY day ORDER BY pct DESC LIMIT 7;"
      ),
  });
  

  useEffect(() => {
    if (!containerRef.current || !data) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, null, {
        renderer: "canvas",
      });
    }
    const chart = chartRef.current;

    // Sort and map to [utcMs, value]
    const seriesData = data.data
      .slice()
      .sort((a, b) => toUtcMs(a.day) - toUtcMs(b.day))
      .map((d) => [toUtcMs(d.day), Number(d.pct)]);

    const option = {
      useUTC: true,
      backgroundColor: "transparent",
      grid: {
        left: 42,
        right: 28,
        top: 24,
        bottom: 42,
        containLabel: true, // ensures labels fit inside
      },

      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        formatter: (params) => {
          const p = params[0];
          const ts = p?.value?.[0];
          const val = p?.value?.[1] ?? 0;
          const dateStr = echarts.format.formatTime("yyyy-MM-dd", ts, true);
          return `${dateStr}<br/><b>${Number(val).toFixed(2)}%</b>`;
        },
      },

      xAxis: {
        name: "Date",
        nameLocation: "middle",
        nameGap: 56,
        type: "time",
        boundaryGap: false,
        minInterval: 24 * 3600 * 1000,
        axisLabel: {
          color: "#374151",
          hideOverlap: true,
          margin: 2, // margin between ticks and tick labels
          rotate: 45,
          formatter: (val) =>
            echarts.format.formatTime("yyyy-MM-dd", val, true),
        },
        axisLine: { lineStyle: { color: "#9CA3AF" } },
        splitLine: { lineStyle: { color: "#E5E7EB" } },
      },

      yAxis: {
        type: "value",
        name: "Completion %",
        nameLocation: "middle",
        nameGap: 56,
        min: 0,
        max: 100,
        axisLabel: { color: "#374151", formatter: (v) => v + "%" },
        axisLine: { show: true, lineStyle: { color: "#9CA3AF" } },
        splitLine: { lineStyle: { color: "#E5E7EB" } },
      },

      series: [
        {
          name: "Pct",
          type: "line",
          data: seriesData,
          symbol: "circle",
          symbolSize: 8,
          showSymbol: true,
          lineStyle: { width: 1.5, color: "#3366cc" },
          itemStyle: { color: "#3366cc" },
        },
      ],

      animationDuration: 600,
    };

    chart.setOption(option, true);

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
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
      <h1 className="mb-3">Automated Processing Excellence</h1>
      <div ref={containerRef} className="h-96 w-full rounded-xl bg-white" />
    </div>
  );
}
