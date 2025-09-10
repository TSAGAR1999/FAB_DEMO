import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { postGetKPIData } from "../API/BqsApi";

export default function RiskLevelChart() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["riskLevelDistributionData"],
    queryFn: () =>
      postGetKPIData(
        "SELECT risk_level, COUNT(*) AS resp FROM t_6899f04ee9c2d32956987b9f_t GROUP BY risk_level;"
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

    const pieData = data.data.map((d) => ({
      name: d.risk_level || "Unknown",
      value: d.resp,
    }));

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: { color: "#374151" },
      },
      series: [
        {
          name: "Risk Levels",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {d}%",
          },
          labelLine: { show: true },
          data: pieData,
        },
      ],
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
    <div className="w-full">
      <h1 className="mb-3">Risk Level Distribution</h1>
      <div
        ref={containerRef}
        className="h-96 w-full rounded-xl bg-white"
      />
    </div>
  );
}
