import { useQuery } from "@tanstack/react-query";
import { Clock,X } from "lucide-react";
import { SchemaId } from "../Constants";
import { PostSchema } from "../API/Api";
import { postGetKPIData } from "../API/BqsApi";
import { useState } from "react";


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
  const [showModal, setShowModal] = useState(false);
  const [selectedAgentLog, setSelectedAgentLog] = useState([]);

  const togglehandleModal = () => {
    setShowModal(!showModal);
  };

  const handleSelectedAgentLog = (logs) => {
    setSelectedAgentLog(logs);
  };

  const agentConsole = useQuery({
    queryKey: ["agentConsole"],
    queryFn: () =>
      postGetKPIData(
        "SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT('agent_id', agent_id, 'agent_name', agent_name, 'status', status, 'activity_log', activity_log))) as AGENTS FROM (SELECT agent_id, agent_name, status, JSON_ARRAYAGG(JSON_OBJECT('id', id, 'response_time', response_time, 'lastused', lastused, 'action', activity_log)) AS activity_log FROM t_68b80bb9449b0c059a42ae35_t GROUP BY agent_id, agent_name, status) AS g;"
      ),
  });

  const loadingSkeletons = Array.from({ length: 3 });

  return (
    <section className="w-full rounded-2xl border-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Agents Console
            </h2>
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
          : (
              agentConsole && JSON.parse(agentConsole?.data?.data[0].AGENTS)
            ).map((a, idx) => (
              <div
                key={idx}
                className="p-[1px] rounded-xl bg-gray-200"
                onClick={() => {
                  togglehandleModal();
                  handleSelectedAgentLog(a.activity_log);
                }}
              >
                <article className="rounded-[10px] h-full bg-white/95 backdrop-blur-sm p-4 shadow-sm cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex flex-wrap items-center mb-3">
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
                        {formatISTDate(a["activity_log"][0].lastused)}
                      </dd>
                    </div>
                    <div className="rounded-lg p-3 ring-1 ring-fuchsia-200 bg-fuchsia-50">
                      <dt className="font-semibold">Response time</dt>
                      <dd className="mt-0.5 font-extrabold flex items-center">
                        <Clock className="h-4 w-4 mr-1.5" strokeWidth={2} />
                        {a["activity_log"][0].response_time} s
                      </dd>
                    </div>
                  </dl>
                </article>
              </div>
            ))}
      </div>

      {showModal && selectedAgentLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[40vw] h-[25vw] bg-white rounded-lg p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <h1>Logs</h1>
              <X onClick={togglehandleModal} className="cursor-pointer"/>
            </div>
            
            {selectedAgentLog.length === 0 ? (
              <p className="text-gray-500">No logs available.</p>
            ) : (
              <div className="space-y-3">
                {selectedAgentLog.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
                  >
                    <p className="text-gray-800 text-sm mb-2">
                      {log.action ? log.action : "No action"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          {new Date(log.lastused).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
