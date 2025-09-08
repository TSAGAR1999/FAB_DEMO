import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { postGetKPIData } from "../API/BqsApi";

function toUTCDateStr(ms) {
  const d = new Date(Number(ms));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function SystemReliability() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

   const { data, isLoading, isError, error } = useQuery({
    queryKey: ["SystemReliabilityData"],
    queryFn: () =>
      postGetKPIData(
        "SELECT metric_date, 100.0 * SUM(CAST(uptime_seconds AS DECIMAL(20,2))) / SUM(CAST(total_seconds AS DECIMAL(20,2))) AS pct, REPEAT('█', ROUND(100.0 * SUM(CAST(uptime_seconds AS DECIMAL(20,2))) / SUM(CAST(total_seconds AS DECIMAL(20,2))) / 2)) AS bar FROM t_68a6e9af4e7cc90774f5db06_t WHERE metric_date BETWEEN 1735689600000 AND 1743609599000 GROUP BY metric_date ORDER BY metric_date limit 10;"
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

    const rows = [...data.data]
      .map((r) => ({ ...r, pct: Number(r.pct) }))
      .sort((a, b) => Number(a.metric_date) - Number(b.metric_date));

    const categories = rows.map((r) => toUTCDateStr(r.metric_date));
    const values = rows.map((r) => r.pct);

    const option = {
      backgroundColor: "transparent",
      grid: { left: 20, right: 40, top: 20, bottom: 40, containLabel: true },
      xAxis: {
        type: "value",
        name: 'Percentage(%)',
        nameLocation: 'middle',
        min: 0,
        max: 100,
        axisLabel: { formatter: (v) => v + "%",margin: 0 },
        splitLine: { lineStyle: { color: "#E5E7EB" } },
      },
      yAxis: {
        type: "category",
        name: 'Date',
        nameLocation: 'middle',
        data: categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#374151" },
      },
      tooltip: {
        trigger: "item",
        formatter: (p) =>
          `${p.name}<br/><b>${Number(p.value).toFixed(2)}%</b>`,
      },
      series: [
        {
          type: "bar",
          data: values,
          barWidth: 20,
          itemStyle: {
            color: "#3366cc",
            borderRadius: [4, 4, 4, 4],
          },
          label: {
            show: true,
            position: "right",
            formatter: (p) => `${p.value.toFixed(2)}%`,
            color: "#111827",
            fontSize: 12,
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
    <h1 className="mb-3">System Reliability Goal </h1>
    <div
      ref={containerRef}
      className="h-96 w-full rounded-xl bg-white"
    />
    </div>
  );
}
