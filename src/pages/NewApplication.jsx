import React, { useState } from "react";
import {
  Upload,
  FileText,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Phone,
  Eye,
  MoreHorizontal,
  X,
  Award,
  Crosshair,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import RoleGuard from "../components/RoleGuard";
import AIIcon from "../components/AIIcon";
import { usePostNewApplication } from "../API/query";
import { adhocQuerys, SchemaId, tableQueries } from "../Constants";
import { useNavigate } from "react-router-dom";
import { useKPIQueries } from "../API/BqsQuery";
import KPISkeleton from "./KPISkeleton";
import { postGetKPIData } from "../API/BqsApi";
import { useQuery } from "@tanstack/react-query";

const NewApplication = () => {
  const { hasPermission } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);
  const [showOkrModal, setShowOkrModal] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState(null);
  const navigate = useNavigate();

  const sample = {
    branch_code: "BR-001",
    account_type: "Savings",
    PI_314_CREATIONTIMEMS: 1755144860039,
    assigned_ops_team: "Team A",
    PI_314_TENANTID: "2cf76e5f-26ad-4f2c-bccc-f4bc1e7bfb64",
    application_status: "In Progress",
    PI_314_TRANSACTIONID: "c6652e46-9c67-48b2-ba42-d58ae6c65ef7",
    PI_314_UPDATIONTIMEMS: null,
    application_id: "APP-001",
    PI_314_ENTITYID: "c03d4c44-16ba-458f-8017-7e468c6c1ed7",
    submission_date: "1735689600000",
    sla_due_date: "1735776000000",
    kyc_status: null,
    customer_id: "8a7c6b5e-4d3f-2a1b-0c9d-8e7f6a5b4c3d",
    full_name: "New Customer A",
  };

  const kpis = [
    {
      id: "new-apps",
      title: "Total New Applications",
      value: 47,
      unit: "",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      target: 50, // higher is better
      direction: "higher", // used to compute progress
      progressPct: 94, // (value/target)*100, capped at 100
      status: "On Track",
      progressColor: "bg-blue-600",
      description: "Daily intake of new applications approaching target.",
      trend: { delta: "+7%", period: "WoW", direction: "up" },
      tooltip: "Goal: 50 new applications today",
    },
    {
      id: "sla-breaches",
      title: "SLA Breach Count",
      value: 3,
      unit: "",
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      target: 2, // lower is better
      direction: "lower",
      progressPct: Math.min(100, Math.round((2 / 3) * 100)), // ≈ 67%
      status: "At Risk", // current > target
      progressColor: "bg-orange-600",
      description: "Number of cases that exceeded the committed SLA window.",
      trend: { delta: "-1", period: "DoD", direction: "down" }, // fewer breaches than yesterday
      tooltip: "Keep breaches at 2 or fewer per day",
    },
    {
      id: "intake-time",
      title: "Avg Intake Time",
      value: 4.2,
      unit: "min",
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-50",
      target: 3.5, // lower is better
      direction: "lower",
      progressPct: Math.min(100, Math.round((3.5 / 4.2) * 100)), // ≈ 83%
      status: "Behind", // current > target
      progressColor: "bg-green-600",
      description: "Average time from submission to intake completion.",
      trend: { delta: "-0.3 min", period: "WoW", direction: "down" }, // improving
      tooltip: "Aim to reach ≤ 3.5 min average intake time",
    },
    {
      id: "escalations",
      title: "Applications Escalated",
      value: 12,
      unit: "",
      icon: User,
      color: "text-purple-600",
      bg: "bg-purple-50",
      target: 8, // lower is better
      direction: "lower",
      progressPct: Math.min(100, Math.round((8 / 12) * 100)), // ≈ 67%
      status: "At Risk", // current > target
      progressColor: "bg-purple-600",
      description: "Cases requiring elevated attention or approvals.",
      trend: { delta: "+2", period: "DoD", direction: "up" }, // more than yesterday
      tooltip: "Keep escalations at or below 8 per day",
    },
  ];

  const aiSuggestions = [
    {
      type: "Auto-Assign",
      message:
        "Recommend assigning FAB-2025-001247 to specialist with Emirates ID expertise",
      confidence: "92%",
    },
    // {
    //   type: 'Escalate',
    //   message: 'FAB-2025-001249 approaching SLA breach - consider priority queue',
    //   confidence: '87%'
    // },
    // {
    //   type: 'Risk Flag',
    //   message: 'Multiple applications from same IP address detected',
    //   confidence: '95%'
    // }
  ];

  // OKR Data for New Applications
  const okrData = [
    {
      id: 1,
      objective: "Achieve 4-Minute Average Application Intake Time",
      description:
        "Streamline new application processing to improve customer experience and operational efficiency",
      owner: "Intake Processing Team",
      quarter: "Q1 2025",
      progress: 95,
      status: "On Track",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      keyResults: [
        {
          kr: "Reduce average intake time to under 4 minutes",
          current: 4.2,
          target: 4.0,
          unit: "min",
          progress: 95,
          status: "On Track",
        },
        {
          kr: "Achieve 95% automated document validation",
          current: 89,
          target: 95,
          unit: "%",
          progress: 94,
          status: "On Track",
        },
        {
          kr: "Maintain under 5 SLA breaches per day",
          current: 3,
          target: 5,
          unit: "breaches",
          progress: 140,
          status: "Ahead",
        },
      ],
    },
    {
      id: 2,
      objective: "Optimize Application Queue Management",
      description:
        "Improve application routing and assignment to reduce processing bottlenecks",
      owner: "Queue Management Team",
      quarter: "Q1 2025",
      progress: 78,
      status: "At Risk",
      statusColor: "text-orange-600 bg-orange-50 border-orange-200",
      keyResults: [
        {
          kr: "Reduce queue wait time to under 2 hours",
          current: 2.5,
          target: 2.0,
          unit: "hours",
          progress: 80,
          status: "At Risk",
        },
        {
          kr: "Achieve 90% optimal officer assignment",
          current: 82,
          target: 90,
          unit: "%",
          progress: 91,
          status: "On Track",
        },
        {
          kr: "Maintain under 15 escalated applications",
          current: 12,
          target: 15,
          unit: "apps",
          progress: 125,
          status: "Ahead",
        },
      ],
    },
  ];

  const handleUploadClick = (application) => {
    setSelectedApplication(application);
    setShowUploadModal(true);
  };

  const handleViewDetail = (application) => {
    setSelectedAppDetail(application);
    setShowDetailModal(true);
  };

  const handleUploadSubmit = () => {
    setShowUploadModal(false);
    setSelectedApplication(null);
    setShowDetailModal(false);
    setSelectedAppDetail(null);
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

  // const data = usePostNewApplication(SchemaId.newApplicationTable)

  const allData = useKPIQueries(adhocQuerys.newApplication);

  const tableData = useQuery({
    queryKey: ["newApplicationTable"],
    queryFn: () => postGetKPIData(tableQueries.newApplication),
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
            const progressPct = Math.min(100, (value / KPIData.target) * 100);

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
          <h2 className="text-lg font-semibold text-gray-800">New Application Processing OKRs (Q1 2025)</h2>
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
        {/* Applications Queue Table - Takes 3 columns */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <section>
                <h2 className="text-lg font-semibold text-gray-800">
                  New Applications Queue
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Pending document upload and initial processing
                </p>
              </section>
              <section>
                {/* <button
                  className="p-2 bg-blue-500 rounded-lg text-white"
                  onClick={() => navigate("/forms")}
                >
                  New Application
                </button> */}
              </section>
            </div>

            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-50">
                  {/* <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Ref#
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Details
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Channel
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Officer
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SLA Remaining
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Risk
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr> */}

                  <tr className="grid grid-cols-[15vw_15vw_15vw_15vw_15vw_15vw]">
                    <th className="text-center flex items-center justify-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Ref#
                    </th>
                    <th className="text-center flex items-center justify-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-center flex items-center justify-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Type
                    </th>
                    <th className="text-center flex items-center justify-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Ops Team
                    </th>
                    <th className="text-center flex items-center justify-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch Code
                    </th>
                    {/* <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KYC Status
                    </th> */}
                    <th className="text-center flex items-center justify-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Loading State */}
                  {tableData.isLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={`skeleton-${index}`}
                        className="animate-pulse hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-100 rounded w-24"></div>
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
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="h-5 w-20 rounded-full bg-gray-200"></div>
                            <div className="h-5 w-20 rounded-full bg-gray-100"></div>
                          </div>
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

                  {/* Success State */}
                  {/* {!data.isLoading && !data.isError && data.data?.content?.map((app, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-800 font-mono">{app.refId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{app.clientName}</p>
                          <p className="text-xs text-gray-500">{app.clientId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-700">{app.type}</p>
                          <p className="text-xs text-gray-500">{app.channel}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{app.officer}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-800">{app.slaRemaining}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                            {app.status}
                          </span>
                          <br />
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${app.riskColor}`}>
                            {app.risk} Risk
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <RoleGuard requiredPermission="upload_documents" showMessage={false}>
                            <button
                              onClick={() => handleUploadClick(app)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Upload Documents"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          </RoleGuard>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Eye
                              className="w-4 h-4"
                              onClick={() => handleViewDetail(app)}
                            />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))} */}

                  {!tableData.isLoading &&
                    !tableData.isError &&
                    tableData?.data?.data?.map((app, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors grid grid-cols-[15vw_15vw_15vw_15vw_15vw_15vw]"
                        onClick={() => handleViewDetail(app)}
                      >
                        <td className="px-6 py-4 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-800 font-mono">
                            {app.application_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center justify-center">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {app.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {app.customer_id}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 flex items-center justify-center">
                          <div>
                            <p className="text-sm text-gray-700">
                              {app.account_type}
                            </p>
                            {/* <p className="text-xs text-gray-500">{app.channel}</p> */}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center">
                          <span className="text-sm text-gray-700">
                            {app.assigned_ops_team}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-800">
                            {app.branch_code}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                          {app.kyc_status || 'Pending'}
                        </span>
                      </td> */}
                        <td className="px-6 py-4 flex items-center justify-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              app.application_status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.application_status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : app.application_status === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {app.application_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Suggestions Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AIIcon size={16} className="text-gray-500" />
              AI Suggestions
            </h3>

            <div className="space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <AIIcon size={10} className="text-blue-600" />
                      {suggestion.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {suggestion.confidence}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {suggestion.message}
                  </p>
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                      Apply
                    </button>
                    <button className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded hover:bg-gray-50 transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Agent Activity Summary */}
            {/* <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active Agents</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">IntakeAgent</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">OCRAgent</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Active</span>
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
                  <span>EXECUTIVE: Override settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>MANAGER: KPI view only</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SPECIALIST: Review & upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>OPERATOR: Upload only</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>SUPPORT: View-only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Upload Documents
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Application:{" "}
              <span className="font-mono font-medium">
                {selectedApplication.refId}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Client:{" "}
              <span className="font-medium">
                {selectedApplication.clientName}
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emirates ID (Front)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emirates ID (Back)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUploadSubmit}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Upload Documents
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {showDetailModal && selectedAppDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !mt-0">
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Application Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Application Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Application Reference
                  </p>
                  <p className="text-sm font-mono font-medium text-gray-800">
                    {selectedAppDetail.application_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedAppDetail.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client ID</p>
                  <p className="text-sm font-mono text-gray-700">
                    {selectedAppDetail.customer_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Application Type</p>
                  <p className="text-sm text-gray-700">
                    {selectedAppDetail.account_type}
                  </p>
                </div>
                {/* <div>
                  <p className="text-xs text-gray-500 mb-1">Channel</p>
                  <p className="text-sm text-gray-700">{selectedAppDetail.channel}</p>
                </div> */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned Officer</p>
                  <p className="text-sm text-gray-700">
                    {selectedAppDetail.assigned_ops_team}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Current Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">
                    Application Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${selectedAppDetail.statusColor}`}
                  >
                    {selectedAppDetail.application_status}
                  </span>
                </div>
                {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Risk Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedAppDetail.riskColor}`}>
                    {selectedAppDetail.risk} Risk
                  </span>
                </div> */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">SLA Remaining</span>
                  <span className="text-sm text-gray-700">
                    {selectedAppDetail.sla_due_date}
                  </span>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Required Documents</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">Emirates ID (Front)</p>
                  <p className="text-sm text-red-700">Not Uploaded</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">Emirates ID (Back)</p>
                  <p className="text-sm text-red-700">Not Uploaded</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">Passport Copy</p>
                  <p className="text-sm text-red-700">Not Uploaded</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 font-medium">Salary Certificate</p>
                  <p className="text-sm text-yellow-700">Optional</p>
                </div>
              </div>
            </div> */}

            {/* Application Timeline */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Application Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-600">Application initialized - 10:30 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-600">Assigned to officer - 10:45 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-600">Awaiting document upload - Current</span>
                </div>
              </div>
            </div> */}

            {/* SLA Information */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">SLA Information</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Target Completion</span>
                  <span className="text-sm text-blue-700">24 Hours</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Time Elapsed</span>
                  <span className="text-sm text-blue-700">6 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Remaining Time</span>
                  <span className="text-sm font-medium text-blue-700">{selectedAppDetail.slaRemaining}</span>
                </div>
              </div>
            </div> */}

            {/* Action Buttons */}
            {/* <div className="flex gap-3">
              <button
                onClick={() => handleUploadClick(selectedAppDetail)}
                className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Upload Documents
              </button>
              <button className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                Contact Client
              </button>
              <button className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
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
                  New Application OKR Details
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
                View Queue Analytics
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

export default NewApplication;
