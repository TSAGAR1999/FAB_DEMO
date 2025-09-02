import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { SchemaId } from "../Constants";
import { PostSchema } from "../API/Api";

const formatISTDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AgentLog() {
  const agentConsole = useQuery({
    queryKey: ["agentConsole"],
    queryFn: () =>
      PostSchema(`${SchemaId.AgentConsole}/instances/list`, { dbType: "TIDB" }),
  });

  const loadingSkeletons = Array.from({ length: 3 });

  return (
    <section className="w-full rounded-2xl border-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">Agents Console</h2>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {agentConsole.isLoading
          ? loadingSkeletons.map((_, idx) => (
              <div
                key={idx}
                className="p-[1px] rounded-xl bg-gray-200 animate-pulse"
              >
                <article className="rounded-[10px] bg-white/95 backdrop-blur-sm p-4 shadow-sm">
                  <div className="h-4 w-24 bg-gray-300 rounded mb-3" />
                  <div className="h-3 w-40 bg-gray-200 rounded mb-2" />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                  <div className="h-16 bg-gray-200 rounded mt-3" />
                </article>
              </div>
            ))
          : agentConsole.data?.map((a, idx) => (
              <div key={idx} className="p-[1px] rounded-xl bg-gray-200">
                <article className="rounded-[10px] h-full bg-white/95 backdrop-blur-sm p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex flex-wrap items-center">
                        <span className="rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-900 ring-1 ring-sky-200">
                          {a.agent_name || "—"}
                        </span>
                        <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1">
                          {a.status || "Unknown"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600">
                        Agent ID:
                        <span className="ml-1 break-all text-slate-800">
                          {a.agent_id || "—"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg p-3 ring-1 ring-sky-200 bg-sky-50">
                      <dt className="font-semibold text-sky-700">Last used</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">
                        {formatISTDate(a.last_used)}
                      </dd>
                    </div>
                    <div className="rounded-lg p-3 ring-1 ring-fuchsia-200 bg-fuchsia-50">
                      <dt className="font-semibold">Response time</dt>
                      <dd className="mt-0.5 font-extrabold flex items-center">
                        <Clock className="h-4 w-4 mr-1.5" strokeWidth={2} />
                        {a.response_time} s
                      </dd>
                    </div>
                  </dl>

                  {a.activity_log ? (
                    <div className="mt-3 rounded-lg p-3 ring-1 ring-emerald-200 bg-emerald-50">
                      <p className="font-semibold">Activity log</p>
                      <p className="mt-1 text-sm text-slate-800">
                        {a.activity_log}
                      </p>
                    </div>
                  ) : null}
                </article>
              </div>
            ))}
      </div>
    </section>
  );
}
