import { Activity, AlertTriangle, Clock, User, X } from "lucide-react";
import { useState } from "react";

const RightDrawer = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("insights");

  const tabs = [
    { id: "insights", label: "AI Insights", icon: Activity },
    { id: "flags", label: "Flag History", icon: AlertTriangle },
    { id: "logs", label: "System Logs", icon: Clock },
  ];

  return (
    <div
      className={[
        "fixed right-0 top-0 h-screen z-40 bg-white shadow-2xl border-l border-gray-200",
        // Widths: pick a size you like; below is responsive with a max at 36rem
        "w-[22rem] sm:w-[24rem] md:w-[28rem] lg:w-[32rem] xl:w-[36rem] max-w-full",
        // Make it a column so header/tabs stay fixed and content scrolls
        "flex flex-col",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 w-full">
        <h2 className="text-lg font-semibold text-gray-800">Control Panel</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
              ].join(" ")}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 w-full flex-1 overflow-y-auto">
        {activeTab === "insights" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Risk Assessment</h3>
              <p className="text-xs text-blue-700">
                Customer profile shows low risk indicators. Proceed with standard verification.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Compliance Status</h3>
              <p className="text-xs text-green-700">All KYC documents verified. Ready for approval.</p>
            </div>
          </div>
        )}

        {activeTab === "flags" && (
          <div className="space-y-3">
            <div className="border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">Address Verification</span>
              </div>
              <p className="text-xs text-gray-600">Flagged for manual review - 2 hours ago</p>
            </div>
            <div className="border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Income Documentation</span>
              </div>
              <p className="text-xs text-gray-600">Requires additional verification - 1 day ago</p>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-2">
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Application submitted - 10:30 AM</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <User className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Assigned to specialist - 10:45 AM</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Activity className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Documents reviewed - 11:15 AM</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightDrawer;