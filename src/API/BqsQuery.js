import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { postGetKPIData } from "./BqsApi";


export function useKPIQueries(definitions = [], body = {}, enabled = true) {
  const defs = useMemo(() => definitions, [definitions]);
  const reqBody = useMemo(() => body, [body]);

  return useQueries({
    queries: defs.map((def) => ({
      queryKey: [
        "kpi",
        def?.KPI_ID,
      ],
      
      queryFn: () => postGetKPIData(def.Query),
      enabled: enabled && !!def,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      select: (resp) => ({
        kpiId: def?.KPI_ID,
        name: def?.KPI_Description,
        okr: def?.StrategicOKRName,
        target: def?.TargetValue,
        query: def?.Query,
        bg:def?.bg,
        progressColor: def?.progressColor,
        data: resp,
        requiredData:def
      }),
    })),
  });
}
