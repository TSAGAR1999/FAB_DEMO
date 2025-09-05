import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { postGetKPIData } from "../API/BqsApi";
import { useQuery } from "@tanstack/react-query";

function toUtcMs(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export default function KYCComplaiceMaster() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["KYCComplaiceMasterData"],
    queryFn: () =>
      postGetKPIData(
        "SELECT FROM_UNIXTIME(CAST(screening_date AS UNSIGNED)/1000,'%Y-%m-%d') AS day, COUNT(*) AS total, SUM(CASE WHEN compliance_status IN('Clear','Cleared_Override') THEN 1 ELSE 0 END) AS cleared, 100.0 * SUM(CASE WHEN compliance_status IN('Clear','Cleared_Override') THEN 1 ELSE 0 END)/COUNT(*) AS pct FROM t_6899f04ee9c2d32956987b9f_t WHERE screening_date BETWEEN 1735689600000 AND 1743609599000 GROUP BY day ORDER BY day;"
      ),
  });

  useEffect(() => {
    if (!containerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, null, {
        renderer: "canvas",
      });
    }
    const chart = chartRef.current;

    const rows = data.data
      .slice()
      .sort((a, b) => toUtcMs(a.day) - toUtcMs(b.day));

    const totalData = rows.map((r) => [toUtcMs(r.day), r.total]);
    const pctData = rows.map((r) => [toUtcMs(r.day), r.pct]);

    const option = {
      useUTC: true,
      backgroundColor: "transparent",
      grid: { left: 60, right: 56, top: 30, bottom: 48 },

      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params) => {
          const ts = params?.[0]?.value?.[0];
          const dateStr = echarts.format.formatTime("yyyy-MM-dd", ts, true);

          const totalP = params.find((p) => p.seriesName === "Total");
          const pctP = params.find((p) => p.seriesName === "% Cleared");

          return [
            `<b>${dateStr}</b>`,
            `Total: <b>${totalP?.value?.[1] ?? 0}</b>`,
            `% Cleared: <b>${Number(pctP?.value?.[1] ?? 0).toFixed(2)}%</b>`,
          ].join("<br/>");
        },
      },

      legend: {
        bottom: 0,
        data: ["Total", "% Cleared"],
      },

      xAxis: {
        name: "Date",
        nameLocation: "middle",
        type: "time",
        nameGap: 56,
        boundaryGap: true,
        minInterval: 24 * 3600 * 1000,
        axisLabel: {
          color: "#374151",
          hideOverlap: true,
          margin: 12,
          formatter: (val) =>
            echarts.format.formatTime("yyyy-MM-dd", val, true), // "Jan 1"
        },
        axisLine: { lineStyle: { color: "#9CA3AF" } },
        splitLine: { lineStyle: { color: "#E5E7EB" } },
      },

      yAxis: [
        {
          type: "value",
          name: "Total",
          nameGap: 36,
          axisLabel: { color: "#374151" },
          axisLine: { lineStyle: { color: "#9CA3AF" } },
          splitLine: { lineStyle: { color: "#E5E7EB" } },
        },
        {
          type: "value",
          name: "% Cleared",
          min: 0,
          max: 100,
          position: "right",
          axisLabel: { color: "#374151", formatter: (v) => `${v}%` },
          axisLine: { lineStyle: { color: "#9CA3AF" } },
          splitLine: { show: false },
        },
      ],

      series: [
        {
          name: "Total",
          type: "bar",
          yAxisIndex: 0,
          data: totalData,
          barMaxWidth: 28,
          itemStyle: { color: "#3b82f6" }, // Tailwind blue-500
        },
        {
          name: "% Cleared",
          type: "line",
          yAxisIndex: 1,
          data: pctData,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2, color: "#10b981" }, // Tailwind emerald-500
          itemStyle: { color: "#10b981" },
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
    <div className="w-full">
      <h1 className="mb-3">KYC Complaice Master</h1>
      <div
        ref={containerRef}
        className="h-96 w-full rounded-xl bg-white"
      />
    </div>
  );
}
