import {
  AlertTriangle,
  Award,
  CheckCircle,
  Clock,
  Crosshair,
  Eye,
  Flag,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { usePostKYCScreening } from "../API/query";
import AIIcon from "../components/AIIcon";
import { adhocQuerys, SchemaId, tableQueries } from "../Constants";
import { useKPIQueries } from "../API/BqsQuery";
import KPISkeleton from "./KPISkeleton";
import { useQuery } from "@tanstack/react-query";
import { postGetKPIData } from "../API/BqsApi";
import { PostSchema } from "../API/Api";

const KYCRiskScreening = () => {
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClientDetail, setSelectedClientDetail] = useState(null);
  const [showOkrModal, setShowOkrModal] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState(null);

  const kpis = [
    {
      id: "clients-screened",
      title: "Total Clients Screened",
      value: 89,
      unit: "",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      target: 100, // higher is better
      direction: "higher",
      progressPct: Math.min(100, Math.round((89 / 100) * 100)), // 89%
      status: "On Track",
      progressColor: "bg-blue-600",
      description: "Number of clients screened so far, close to daily target.",
      trend: { delta: "+5%", period: "WoW", direction: "up" },
      tooltip: "Goal: 100 clients screened today",
    },
    {
      id: "auto-cleared",
      title: "% Cleared Automatically",
      value: 76,
      unit: "%",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      target: 80, // higher is better
      direction: "higher",
      progressPct: Math.min(100, Math.round((76 / 80) * 100)), // 95%
      status: "On Track",
      progressColor: "bg-green-600",
      description: "Proportion of cases cleared without manual intervention.",
      trend: { delta: "+2%", period: "WoW", direction: "up" },
      tooltip: "Target: 80% cleared automatically",
    },
    {
      id: "high-risk",
      title: "High Risk Rate",
      value: 12,
      unit: "%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      target: 8, // lower is better
      direction: "lower",
      progressPct: Math.min(100, Math.round((8 / 12) * 100)), // 67%
      status: "At Risk",
      progressColor: "bg-orange-600",
      description: "Percentage of screened clients flagged as high risk.",
      trend: { delta: "+1%", period: "WoW", direction: "up" },
      tooltip: "Keep high risk rate under 8%",
    },
    {
      id: "review-time",
      title: "Avg Review Time",
      value: 18,
      unit: "min",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
      target: 15, // lower is better
      direction: "lower",
      progressPct: Math.min(100, Math.round((15 / 18) * 100)), // 83%
      status: "Behind",
      progressColor: "bg-purple-600",
      description: "Average time taken to complete client reviews.",
      trend: { delta: "-1 min", period: "WoW", direction: "down" },
      tooltip: "Aim to reduce average review time to 15 minutes",
    },
  ];

  // OKR Data for KYC & Risk Screening
  const okrData = [
    {
      id: 1,
      objective: "Achieve 95% Automated Risk Assessment Accuracy",
      description:
        "Enhance AI-driven risk screening to minimize manual intervention while maintaining compliance standards",
      owner: "Risk Assessment Team",
      quarter: "Q1 2025",
      progress: 89,
      status: "On Track",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      keyResults: [
        {
          kr: "Increase auto-clearance rate to 80%",
          current: 76,
          target: 80,
          unit: "%",
          progress: 95,
          status: "On Track",
        },
        {
          kr: "Reduce high-risk false positives to under 8%",
          current: 12,
          target: 8,
          unit: "%",
          progress: 67,
          status: "At Risk",
        },
        {
          kr: "Achieve 15-minute average review time",
          current: 18,
          target: 15,
          unit: "min",
          progress: 83,
          status: "On Track",
        },
      ],
    },
    {
      id: 2,
      objective: "Strengthen PEP and Sanctions Screening",
      description:
        "Improve politically exposed persons and sanctions list screening accuracy and coverage",
      owner: "Compliance Team",
      quarter: "Q1 2025",
      progress: 94,
      status: "Ahead",
      statusColor: "text-blue-600 bg-blue-50 border-blue-200",
      keyResults: [
        {
          kr: "Achieve 98% PEP screening coverage",
          current: 97,
          target: 98,
          unit: "%",
          progress: 99,
          status: "On Track",
        },
        {
          kr: "Reduce sanctions screening time to under 5 minutes",
          current: 4.5,
          target: 5,
          unit: "min",
          progress: 110,
          status: "Ahead",
        },
        {
          kr: "Maintain 99% compliance audit score",
          current: 98.5,
          target: 99,
          unit: "%",
          progress: 99,
          status: "On Track",
        },
      ],
    },
  ];

  const agentActivity = [
    {
      agent: "KYCCheckerAgent",
      message: "Match found in EU sanctions list for Omar Abdullah",
      timestamp: "2 min ago",
      type: "warning",
    },
    {
      agent: "RiskFlagAgent",
      message:
        "Client marked High Risk due to duplicate ID in prior flagged account",
      timestamp: "5 min ago",
      type: "alert",
    },
    {
      agent: "KYCCheckerAgent",
      message:
        "PEP screening completed for Ahmed Hassan - Political exposure detected",
      timestamp: "8 min ago",
      type: "info",
    },
    {
      agent: "RiskFlagAgent",
      message: "Address verification mismatch flagged for manual review",
      timestamp: "12 min ago",
      type: "warning",
    },
    {
      agent: "KYCCheckerAgent",
      message: "Batch screening completed - 15 clients processed",
      timestamp: "15 min ago",
      type: "success",
    },
    {
      agent: "RiskFlagAgent",
      message: "False positive flagged for manual review - Maria Rodriguez",
      timestamp: "18 min ago",
      type: "info",
    },
  ];

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleViewDetail = (client) => {
    setSelectedClientDetail(client);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowClientModal(false);
    setSelectedClient(null);
    setShowDetailModal(false);
    setSelectedClientDetail(null);
  };

  const handleOkrClick = (okr) => {
    setSelectedOkr(okr);
    setShowOkrModal(true);
  };

  const closeOkrModal = () => {
    setShowOkrModal(false);
    setSelectedOkr(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ahead":
        return TrendingUp;
      case "On Track":
        return Target;
      case "At Risk":
        return AlertTriangle;
      case "Behind":
        return TrendingDown;
      default:
        return Target;
    }
  };

  // const data = usePostKYCScreening(SchemaId.kycRiskScreeningTable)

  const allData = useKPIQueries(adhocQuerys.KYCRiskScreening);

  const tableData = useQuery({
    queryKey: ["newApplicationTable"],
    queryFn: () => postGetKPIData(tableQueries.KYCRiskScreening),
  });

  const agentLogs = useQuery({
    queryKey: ["agentLogs"],
    queryFn: () =>
      postGetKPIData("select * from t_68b18e14449b0c059a42ad7f_t where agent_name='KYC_AGENT'"),
  });
  

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {allData?.some((query) => query?.isLoading) ? (
          // Loading skeleton for KPI cards
          Array.from({ length: 4 }).map((_, index) => (
            <KPISkeleton key={`kpi-skeleton-${index}`} />
          ))
        ) : allData?.some((query) => query?.isError) ? (
          // Error state
          <div className="col-span-4 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Failed to load KPI data</p>
            <p className="text-red-600 text-sm mt-1">
              Please try refreshing the page
            </p>
          </div>
        ) : (
          // Success state - render actual KPI cards
          allData?.map((kpi, index) => {
            const KPIData = kpi?.data?.requiredData;
            const Icon = KPIData?.icon;
            const value = Math.round(kpi?.data?.data?.data?.[0]?.resp);
            const progressPct = Math.round(Math.min(100, (value / KPIData.target) * 100));

            if (!KPIData) return null;

            return (
              <div
                key={index}
                className={`${KPIData.bg} rounded-xl p-4 shadow-sm flex flex-col gap-3`}
              >
                {/* KPI Header */}
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${KPIData.color}`} />
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      {KPIData.title}
                    </p>
                    <p className={`text-lg font-semibold ${KPIData.color}`}>
                      {value}
                      {KPIData.unit && (
                        <span className="text-sm text-gray-500 ml-1">
                          {KPIData.unit}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`${KPIData.progressColor} h-2`}
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                {/* Status & Description */}
                <div className="flex justify-between items-center text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      KPIData.status === "On Track"
                        ? "bg-green-100 text-green-700"
                        : KPIData.status === "At Risk"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {KPIData.status}
                  </span>
                  <span className="text-gray-500">{progressPct}%</span>
                </div>
                <p className="text-xs text-gray-600">
                  {KPIData.KPI_Description}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* OKR Section */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800">KYC & Risk Screening OKRs (Q1 2025)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {okrData.map((okr) => {
            const StatusIcon = getStatusIcon(okr.status);
            return (
              <div 
                key={okr.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOkrClick(okr)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">OKR {okr.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4 text-gray-500" />
                    <span className={`text-xs px-2 py-1 rounded-full border ${okr.statusColor}`}>
                      {okr.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  {okr.objective}
                </h3>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{okr.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${okr.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>Owner: {okr.owner}</p>
                  <p>{okr.keyResults.length} Key Results</p>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Client Risk Queue Table - Takes 3 columns */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Client Risk Queue
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                KYC screening results and risk assessment status
              </p>
            </div>
            {/* {
            "application_id": "APP-001",
            "nationality": "Pakistani",
            "assigned_ops_team": "Team A",
            "account_type": "Savings",
            "risk_level": "High",
            "checked_by": "System",
            "review_notes": "Face match failed, faces are not similar.",
            "customer_id": "8a7c6b5e-4d3f-2a1b-0c9d-8e7f6a5b4c3d",
            "full_name": "New Customer A",
            "kyc_status": "pending"
        } */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ref# / Client Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Team
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KYC Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Tier
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                  </tr>

                  {/* <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ref# / Client Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Team
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Type
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checked By
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Notes
                    </th>
                  </tr> */}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Loading State */}
                  {tableData.isLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={`skeleton-${index}`}
                        className="animate-pulse hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-100 rounded w-32"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                            <div className="h-3 bg-gray-100 rounded w-20"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 w-20 bg-gray-200 rounded-full border"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 w-20 bg-gray-100 rounded-full border"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-8 w-8 bg-gray-200 rounded-lg"
                              ></div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* Empty State */}
                  {!tableData.isLoading &&
                    !tableData.isError &&
                    tableData.data.data.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-6 text-center text-gray-500 text-sm bg-gray-50"
                        >
                          No clients found.
                        </td>
                      </tr>
                    )}

                  {/* Success State */}
                  {!tableData.isLoading &&
                    !tableData.isError &&
                    tableData.data.data.map((client, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                        onClick={()=>handleViewDetail(client)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800 font-mono">
                              {client.application_id}
                            </p>
                            <p className="text-sm text-gray-700">
                              {client.full_name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-700">
                              {client.nationality}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {client.customer_id}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">
                            {client.assigned_ops_team}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.kyc_status && <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                              client.kyc_status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : client.kyc_status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : client.kyc_status === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {client.kyc_status}
                          </span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.risk_level && <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                              client.risk_level === "Low"
                                ? "bg-red-100 text-red-800"
                                : client.risk_level === "High"
                                ? "bg-green-100 text-green-800":""
                            }`}
                          >
                            {client.risk_level}
                          </span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                         {client.review_notes && <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${client.riskTierColor}`}
                          >
                            {client.review_notes}
                          </span>}
                        </td>
                      </tr>
                    ))}

                  {/* {!tableData.isLoading && !tableData.isError && tableData?.data?.data?.map((client, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800 font-mono">{client.customer_id}</p>
                          <p className="text-sm text-gray-700">{client.full_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-700">{client.nationality}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{client.assigned_ops_team}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${client.kycStatusColor}`}>
                          {client.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${client.riskTierColor}`}>
                          {client.risk_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{client.checked_by}</span>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{client.review_notes}</span>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Agent Activity Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AIIcon size={16} className="text-gray-500" />
              Agent Activity Log
            </h3>

            <div className="space-y-4">
              {!agentLogs.isLoading && agentLogs.data.data.map((activity, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                      <AIIcon size={10} className="text-blue-600" />
                      {activity.agent_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{activity.agent_notes}</p>
                </div>
              ))}
            </div>

            {/* Active Agents Status */}
            {/* <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active Agents</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">KYCCheckerAgent</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">RiskFlagAgent</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">Active</span>
                </div>
              </div>
            </div> */}

            {/* RBAC Access Levels */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Access Levels
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>EXECUTIVE: Override decisions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>MANAGER: Approve escalations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SPECIALIST: Review & escalate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>OPERATOR: View KYC status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>SUPPORT: Document re-check</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Snapshot Modal */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Client Risk Profile
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Client Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Application Reference
                  </p>
                  <p className="text-sm font-mono font-medium text-gray-800">
                    {selectedClient.refId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedClient.clientName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nationality</p>
                  <p className="text-sm text-gray-700">
                    {selectedClient.nationality}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ID Number</p>
                  <p className="text-sm font-mono text-gray-700">
                    {selectedClient.idNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Screening Results */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Screening Results
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">KYC Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClient.kycStatusColor}`}
                  >
                    {selectedClient.kycStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Risk Tier</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClient.riskTierColor}`}
                  >
                    {selectedClient.riskTier}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Last Screening</span>
                  <span className="text-sm text-gray-600">
                    {selectedClient.lastScreening}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Event Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-600">
                    Application submitted - 10:30 AM
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-600">
                    KYC screening initiated - 10:45 AM
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-600">
                    Risk flag detected - 11:15 AM
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                Clear KYC
              </button>
              <button className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                Escalate to Compliance
              </button>
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {showDetailModal && selectedClientDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !mt-0">
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Client Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Client Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Application Reference
                  </p>
                  <p className="text-sm font-mono font-medium text-gray-800">
                    {selectedClientDetail.application_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedClientDetail.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nationality</p>
                  <p className="text-sm text-gray-700">
                    {selectedClientDetail.nationality}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ID Number</p>
                  <p className="text-sm font-mono text-gray-700">
                    {selectedClientDetail.customer_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned Officer</p>
                  <p className="text-sm text-gray-700">
                    {selectedClientDetail.assigned_ops_team}
                  </p>
                </div>
                {/* <div>
                  <p className="text-xs text-gray-500 mb-1">Last Screening</p>
                  <p className="text-sm text-gray-700">
                    {selectedClientDetail.lastScreening}
                  </p>
                </div> */}
              </div>
            </div>

            {/* Risk Assessment Details */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Risk Assessment Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">KYC Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClientDetail.kycStatusColor}`}
                  >
                    {selectedClientDetail.kyc_status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Risk Tier</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClientDetail.riskTierColor}`}
                  >
                    {selectedClientDetail.risk_level}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Status */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Document Status
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">
                    Emirates ID
                  </p>
                  <p className="text-sm text-green-700">Verified ✓</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">Passport</p>
                  <p className="text-sm text-green-700">Verified ✓</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 font-medium">
                    Salary Certificate
                  </p>
                  <p className="text-sm text-yellow-700">Pending Review</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">
                    Bank Statement
                  </p>
                  <p className="text-sm text-green-700">Verified ✓</p>
                </div>
              </div>
            </div> */}

            {/* AI Agent Analysis */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                AI Agent Analysis
              </h4>
              <div className="space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-600">
                      OCRAgent
                    </span>
                    <span className="text-xs text-blue-600">
                      95% Confidence
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Document extraction completed successfully
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-orange-600">
                      RiskFlagAgent
                    </span>
                    <span className="text-xs text-orange-600">
                      87% Confidence
                    </span>
                  </div>
                  <p className="text-sm text-orange-700">
                    High risk pattern detected - requires manual review
                  </p>
                </div>
              </div>
            </div> */}

            {/* Action Buttons */}
            {/* <div className="flex gap-3">
              <button className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                Approve Application
              </button>
              <button className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                Request Additional Info
              </button>
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Add Note
              </button>
            </div> */}
          </div>
        </div>
      )}

      {/* OKR Detail Modal */}
      {showOkrModal && selectedOkr && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  KYC & Risk Screening OKR
                </h3>
              </div>
              <button
                onClick={closeOkrModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Objective Overview */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-purple-800">
                    {selectedOkr.objective}
                  </h4>
                  <p className="text-sm text-purple-700 mt-1">
                    {selectedOkr.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {React.createElement(getStatusIcon(selectedOkr.status), {
                      className: "w-4 h-4 text-purple-600",
                    })}
                    <span
                      className={`text-sm px-2 py-1 rounded-full border ${selectedOkr.statusColor}`}
                    >
                      {selectedOkr.status}
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    {selectedOkr.progress}% Complete
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-600 font-medium">Owner:</span>
                  <span className="text-purple-800 ml-2">
                    {selectedOkr.owner}
                  </span>
                </div>
                <div>
                  <span className="text-purple-600 font-medium">Quarter:</span>
                  <span className="text-purple-800 ml-2">
                    {selectedOkr.quarter}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Results */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-4">
                Key Results
              </h4>
              <div className="space-y-4">
                {selectedOkr.keyResults.map((kr, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-800">
                        {kr.kr}
                      </h5>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          kr.status === "On Track"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : kr.status === "At Risk"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : kr.status === "Ahead"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {kr.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Current:{" "}
                          <span className="font-medium text-gray-800">
                            {kr.current}
                            {kr.unit}
                          </span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Target:{" "}
                          <span className="font-medium text-gray-800">
                            {kr.target}
                            {kr.unit}
                          </span>
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {kr.progress}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          kr.status === "On Track"
                            ? "bg-green-600"
                            : kr.status === "At Risk"
                            ? "bg-orange-500"
                            : kr.status === "Ahead"
                            ? "bg-blue-600"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(kr.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                Update Progress
              </button>
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                View Details
              </button>
              <button
                onClick={closeOkrModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCRiskScreening;
