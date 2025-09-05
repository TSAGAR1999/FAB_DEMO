import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const data = [
    { sanctions_list_result: "Clear", compliance_status: "Clear", cnt: 22 },
    { sanctions_list_result: "Clear", compliance_status: "Cleared_Override", cnt: 2 },
    { sanctions_list_result: "Clear", compliance_status: "Reject", cnt: 1 },
    { sanctions_list_result: "Cleared_Override", compliance_status: "Clear", cnt: 1 },
    { sanctions_list_result: "Cleared_Override", compliance_status: "Cleared_Override", cnt: 1 },
    { sanctions_list_result: "Match", compliance_status: "Match", cnt: 1 },
    { sanctions_list_result: "Possible Match", compliance_status: "Possible Match", cnt: 2 },
    { sanctions_list_result: "Reject", compliance_status: "Clear", cnt: 3 },
    { sanctions_list_result: "Reject", compliance_status: "Reject", cnt: 4 },
    { sanctions_list_result: "Reject", compliance_status: "Review", cnt: 1 },
    { sanctions_list_result: "Review", compliance_status: "Clear", cnt: 1 },
    { sanctions_list_result: "Review", compliance_status: "Reject", cnt: 1 },
    { sanctions_list_result: "Review", compliance_status: "Review", cnt: 2 },
    { sanctions_list_result: "Unknown", compliance_status: "Clear", cnt: 19 },
    { sanctions_list_result: "Unknown", compliance_status: "Cleared_Override", cnt: 5 },
    { sanctions_list_result: "Unknown", compliance_status: "Reject", cnt: 6 },
    { sanctions_list_result: "Unknown", compliance_status: "Review", cnt: 9 },
  ];

export default function ComplianceScreen() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // sensible display order for categories
  const xOrder = [
    "Clear",
    "Cleared_Override",
    "Review",
    "Possible Match",
    "Match",
    "Reject",
    "Unknown",
  ];
  const yOrder = [
    "Clear",
    "Cleared_Override",
    "Review",
    "Reject",
    "Possible Match",
    "Match",
  ];

  const processData = (data) => {
    const presentX = Array.from(new Set(data.map((d) => d.sanctions_list_result)));
    const presentY = Array.from(new Set(data.map((d) => d.compliance_status)));

    const sortByOrder = (arr, order) =>
      arr.slice().sort(
        (a, b) =>
          (order.indexOf(a) === -1 ? Number.MAX_SAFE_INTEGER : order.indexOf(a)) -
          (order.indexOf(b) === -1 ? Number.MAX_SAFE_INTEGER : order.indexOf(b))
      );

    const xCats = sortByOrder(presentX, xOrder);
    const yCats = sortByOrder(presentY, yOrder);

    const key = (x, y) => `${x}|||${y}`;
    const map = new Map();
    let maxCnt = 0;
    let total = 0;

    data.forEach((d) => {
      const k = key(d.sanctions_list_result, d.compliance_status);
      const prev = map.get(k) || 0;
      const val = prev + Number(d.cnt || 0);
      map.set(k, val);
      if (val > maxCnt) maxCnt = val;
      total += Number(d.cnt || 0);
    });

    const heatmapData = [];
    xCats.forEach((x, xi) => {
      yCats.forEach((y, yi) => {
        const v = map.get(key(x, y)) || 0;
        heatmapData.push([xi, yi, v]);
      });
    });

    return { xCats, yCats, heatmapData, maxCnt, total };
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const { xCats, yCats, heatmapData, maxCnt, total } = processData(data);

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      tooltip: {
        trigger: "item",
        formatter: (p) => {
          const [xi, yi, v] = p.data;
          const pct = total ? ((v / total) * 100).toFixed(1) : "0.0";
          return `
            <div>
              <div><b>${xCats[xi]}</b> × <b>${yCats[yi]}</b></div>
              <div>Count: <b>${v}</b> (${pct}% of ${total})</div>
            </div>
          `;
        },
      },
      grid: { top: 40, left: 90, right: 20, bottom: 70 },
      xAxis: {
        type: "category",
        data: xCats,
        name: "sanctions_list_result",
        nameLocation: "center",
        nameGap: 30,
        axisLabel: { rotate: 30 },
        splitArea: { show: true },
      },
      yAxis: {
        type: "category",
        data: yCats,
        name: "compliance_status",
        nameLocation: "center",
        nameGap: 50,
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: Math.max(1, maxCnt),
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: 10,
        inRange: {
          color: ["#f5f5f5", "#d4e6f1", "#7fb3d5", "#2e86c1", "#1b4f72"],
        },
      },
      series: [
        {
          name: "Count",
          type: "heatmap",
          data: heatmapData,
          label: {
            show: true,
            formatter: (p) => (p.data && p.data[2] ? p.data[2] : ""),
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const resizeHandler = () => chartInstance.current?.resize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [data]);

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow p-4">
      <h1 className="text-sm text-gray-700 mb-3">
        Sanctions vs. Compliance Heatmap
      </h1>
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
