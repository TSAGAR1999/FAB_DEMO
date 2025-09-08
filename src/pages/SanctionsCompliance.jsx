import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { postGetKPIData } from "../API/BqsApi";

export default function SanctionsCompliance() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["DigiTransformData"],
    queryFn: () =>
      postGetKPIData(
        "SELECT COALESCE(sanctions_list_result,'Unknown') AS sanctions_list_result, compliance_status, COUNT(*) AS cnt FROM t_6899f04ee9c2d32956987b9f_t WHERE screening_date BETWEEN 1735689600000 AND 1743609599000 GROUP BY COALESCE(sanctions_list_result,'Unknown'), compliance_status ORDER BY sanctions_list_result, compliance_status;"
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

    // Collect categories
    const xCategories = Array.from(
      new Set(data.data.map((d) => d.compliance_status))
    );
    const yCategories = Array.from(
      new Set(data.data.map((d) => d.sanctions_list_result))
    );

    // Transform into heatmap data [xIndex, yIndex, value]
    const heatmapData = data.data.map((d) => [
      xCategories.indexOf(d.compliance_status),
      yCategories.indexOf(d.sanctions_list_result),
      d.cnt,
    ]);

    const option = {
      tooltip: {
        position: "top",
        formatter: (params) => {
          const x = xCategories[params.value[0]];
          const y = yCategories[params.value[1]];
          const v = params.value[2];
          return `${y} × ${x}<br/><b>${v}</b>`;
        },
      },
      grid: { left: 3, right: 20, top: 40, bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        name: "Compliance Status", // 👈 axis label
        nameLocation: "middle",
        nameGap: 36,
        data: xCategories,
        axisLabel: { rotate: 30, color: "#374151" },
        axisLine: { lineStyle: { color: "#9CA3AF" } },
      },
      yAxis: {
        type: "category",
        name: "Sanctions List Result", // 👈 axis label
        nameLocation: "middle",
        nameGap: 60,
        data: yCategories,
        axisLabel: { color: "#374151" },
        axisLine: { lineStyle: { color: "#9CA3AF" } },
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.data.map((d) => d.cnt)),
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        inRange: {
          color: ["#e0f2fe", "#0284c7"], // Tailwind sky-100 → sky-600
        },
      },
      series: [
        {
          name: "Counts",
          type: "heatmap",
          data: heatmapData,
          label: {
            show: true,
            color: "#111827",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.4)",
            },
          },
        },
      ],
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
      <h1 className="mb-3">Sanctions vs. Compliance Heatmap</h1>
      <div ref={containerRef} className="h-96 w-full rounded-xl bg-white" />
    </div>
  );
}
