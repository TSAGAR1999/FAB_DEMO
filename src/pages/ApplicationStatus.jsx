import React, { useState } from 'react';
import { Eye, RotateCcw, Flag, FileText, Clock, AlertTriangle, Users, TrendingUp, X, Award, Crosshair, Target, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RoleGuard from '../components/RoleGuard';
import { usePostApplicationStatus } from '../API/query';
import { adhocQuerys, SchemaId, tableQueries } from '../Constants';
import { useKPIQueries } from '../API/BqsQuery';
import KPISkeleton from './KPISkeleton';
import { useQuery } from '@tanstack/react-query';
import { postGetKPIData } from '../API/BqsApi';


const ApplicationStatus = () => {
  const { hasPermission } = useAuth();
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [selectedAppActivity, setSelectedAppActivity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);
  const [showOkrModal, setShowOkrModal] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState(null);

  const kpis = [
    {
      id: 'active-apps',
      title: 'Total Active Applications',
      value: 156,
      unit: '',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      target: 140,                 // lower is better (reduce WIP)
      direction: 'lower',
      progressPct: Math.min(100, Math.round((140 / 156) * 100)), // 90%
      status: 'At Risk',
      progressColor: 'bg-blue-600',
      description: 'Open applications currently in the workflow. Aim to reduce in-progress load.',
      trend: { delta: '-4', period: 'DoD', direction: 'down' },
      tooltip: 'Keep active applications at or below 140'
    },
    {
      id: 'sla-breach-rate',
      title: '% Breaching SLA',
      value: 8,
      unit: '%',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      target: 5,                  // lower is better
      direction: 'lower',
      progressPct: Math.min(100, Math.round((5 / 8) * 100)), // 63%
      status: 'At Risk',
      progressColor: 'bg-orange-600',
      description: 'Share of cases currently outside agreed service timelines.',
      trend: { delta: '+1%', period: 'WoW', direction: 'up' },
      tooltip: 'Target: ≤ 5% SLA breaches'
    },
    {
      id: 'avg-proc-time',
      title: 'Avg Processing Time',
      value: 2.4,
      unit: 'days',
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 2.0,               // lower is better
      direction: 'lower',
      progressPct: Math.min(100, Math.round((2.0 / 2.4) * 100)), // 83%
      status: 'Behind',
      progressColor: 'bg-green-600',
      description: 'Mean time from intake to completion across active applications.',
      trend: { delta: '-0.2 days', period: 'WoW', direction: 'down' },
      tooltip: 'Aim to reach ≤ 2.0 days average'
    },
    {
      id: 'awaiting-assignment',
      title: 'Apps Waiting Assignment',
      value: 23,
      unit: '',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      target: 10,                // lower is better
      direction: 'lower',
      progressPct: Math.min(100, Math.round((10 / 23) * 100)), // 43%
      status: 'Behind',
      progressColor: 'bg-purple-600',
      description: 'Unassigned applications waiting in the queue. Prioritize routing to reduce aging.',
      trend: { delta: '+3', period: 'DoD', direction: 'up' },
      tooltip: 'Keep unassigned queue at ≤ 10'
    }
  ];

  // OKR Data for Application Status
  const okrData = [
    {
      id: 1,
      objective: "Achieve 95% SLA Compliance Across All Applications",
      description: "Ensure timely processing of applications to meet service level agreements and customer expectations",
      owner: "Operations Team",
      quarter: "Q1 2025",
      progress: 92,
      status: "At Risk",
      statusColor: "text-orange-600 bg-orange-50 border-orange-200",
      keyResults: [
        {
          kr: "Reduce SLA breach rate to under 5%",
          current: 8,
          target: 5,
          unit: "%",
          progress: 63,
          status: "Behind"
        },
        {
          kr: "Achieve 2-day average processing time",
          current: 2.4,
          target: 2.0,
          unit: "days",
          progress: 83,
          status: "At Risk"
        },
        {
          kr: "Maintain under 20 applications in queue",
          current: 23,
          target: 20,
          unit: "apps",
          progress: 87,
          status: "At Risk"
        }
      ]
    },
    {
      id: 2,
      objective: "Optimize Application Processing Workflow",
      description: "Streamline application stages to reduce bottlenecks and improve processing efficiency",
      owner: "Process Improvement Team",
      quarter: "Q1 2025",
      progress: 85,
      status: "On Track",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      keyResults: [
        {
          kr: "Reduce average stage transition time to 4 hours",
          current: 6,
          target: 4,
          unit: "hours",
          progress: 67,
          status: "At Risk"
        },
        {
          kr: "Achieve 90% automated status updates",
          current: 85,
          target: 90,
          unit: "%",
          progress: 94,
          status: "On Track"
        },
        {
          kr: "Maintain 98% application tracking accuracy",
          current: 97,
          target: 98,
          unit: "%",
          progress: 99,
          status: "On Track"
        }
      ]
    }
  ];

  const applications = [
    {
      refId: 'FAB-2025-001247',
      clientName: 'Ahmed Hassan Al-Mansouri',
      productType: 'Personal Banking',
      assignedOfficer: 'Mohammed Ali',
      stage: 'Under Review',
      slaRemaining: '2h 15m',
      lastUpdated: '45 min ago',
      stageColor: 'bg-blue-50 text-blue-700',
      slaStatus: 'normal'
    },
    {
      refId: 'FAB-2025-001248',
      clientName: 'Sarah Al-Mansouri',
      productType: 'SME Banking',
      assignedOfficer: 'Fatima Ahmed',
      stage: 'Sent to Compliance',
      slaRemaining: '6h 30m',
      lastUpdated: '1 hour ago',
      stageColor: 'bg-yellow-50 text-yellow-700',
      slaStatus: 'normal'
    },
    {
      refId: 'FAB-2025-001249',
      clientName: 'Omar Abdullah',
      productType: 'Corporate Banking',
      assignedOfficer: 'Ali Hassan',
      stage: 'Awaiting Upload',
      slaRemaining: '45m',
      lastUpdated: '2 hours ago',
      stageColor: 'bg-orange-50 text-orange-700',
      slaStatus: 'warning'
    },
    {
      refId: 'FAB-2025-001250',
      clientName: 'Priya Sharma',
      productType: 'Credit Card',
      assignedOfficer: 'Aisha Mohamed',
      stage: 'Completed',
      slaRemaining: 'N/A',
      lastUpdated: '3 hours ago',
      stageColor: 'bg-green-50 text-green-700',
      slaStatus: 'completed'
    },
    {
      refId: 'FAB-2025-001251',
      clientName: 'Dubai Trading LLC',
      productType: 'Corporate Banking',
      assignedOfficer: 'Khalid Al-Rashid',
      stage: 'Audit Flagged',
      slaRemaining: 'On Hold',
      lastUpdated: '4 hours ago',
      stageColor: 'bg-red-50 text-red-700',
      slaStatus: 'flagged'
    },
    {
      refId: 'FAB-2025-001252',
      clientName: 'Michael Johnson',
      productType: 'Wealth Management',
      assignedOfficer: 'Noura Al-Zaabi',
      stage: 'Risk Assessment',
      slaRemaining: '1h 20m',
      lastUpdated: '30 min ago',
      stageColor: 'bg-blue-50 text-blue-700',
      slaStatus: 'normal'
    }
  ];

  const activityLogs = {
    'FAB-2025-001247': [
      { agent: 'IntakeAgent', action: 'Application initialized', timestamp: '10:43 AM', type: 'info' },
      { agent: 'RoutingAgent', action: 'Routed to Personal Banking queue', timestamp: '10:45 AM', type: 'info' },
      { agent: 'System', action: 'Assigned to Mohammed Ali', timestamp: '11:15 AM', type: 'info' },
      { agent: 'System', action: 'Documents uploaded by client', timestamp: '2:30 PM', type: 'success' }
    ],
    'FAB-2025-001249': [
      { agent: 'IntakeAgent', action: 'Application initialized', timestamp: '9:20 AM', type: 'info' },
      { agent: 'RoutingAgent', action: 'Routed to Corporate Banking', timestamp: '9:22 AM', type: 'info' },
      { agent: 'System', action: 'SLA warning triggered', timestamp: '1:45 PM', type: 'warning' },
      { agent: 'System', action: 'Awaiting document upload', timestamp: '2:00 PM', type: 'pending' }
    ]
  };

  const handleFlagClick = (application) => {
    setSelectedApplication(application);
    setShowFlagModal(true);
  };

  const handleViewClick = (application) => {
    setSelectedAppActivity(application);
    setShowActivityLog(true);
  };

  const handleViewDetail = (application) => {
    setSelectedAppDetail(application);
    setShowDetailModal(true);
  };

  const handleFlagSubmit = () => {
    setShowFlagModal(false);
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
      case 'Ahead': return TrendingUp;
      case 'On Track': return Target;
      case 'At Risk': return AlertTriangle;
      case 'Behind': return TrendingDown;
      default: return Target;
    }
  };

  const getSlaColor = (status) => {
    switch (status) {
      case 'warning': return 'text-orange-600';
      case 'flagged': return 'text-red-600';
      case 'completed': return 'text-gray-500';
      default: return 'text-gray-700';
    }
  };

  // const data = usePostApplicationStatus(SchemaId.applicationStatusTable)

  const allData = useKPIQueries(adhocQuerys.ApplicationStatus);

  const tableData = useQuery({
    queryKey: ['ApplicationStatusTable'],
    queryFn: () => postGetKPIData(tableQueries.applicationStatus)
  })
  

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {allData?.some(query => query?.isLoading) ? (
          // Loading skeleton for KPI cards
          Array.from({ length: 4 }).map((_, index) => (
            <KPISkeleton key={`kpi-skeleton-${index}`} />
          ))
        ) : allData?.some(query => query?.isError) ? (
          // Error state
          <div className="col-span-4 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Failed to load KPI data</p>
            <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
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
              <div key={index} className={`${KPIData.bg} rounded-xl p-4 shadow-sm flex flex-col gap-3`}>
                {/* KPI Header */}
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${KPIData.color}`} />
                  <div>
                    <p className="text-xs font-medium text-gray-600">{KPIData.title}</p>
                    <p className={`text-lg font-semibold ${KPIData.color}`}>
                      {value}
                      {KPIData.unit && <span className="text-sm text-gray-500 ml-1">{KPIData.unit}</span>}
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
                    className={`px-2 py-0.5 rounded-full font-medium ${KPIData.status === 'On Track'
                      ? 'bg-green-100 text-green-700'
                      : KPIData.status === 'At Risk'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {KPIData.status}
                  </span>
                  <span className="text-gray-500">{progressPct}%</span>
                </div>
                <p className="text-xs text-gray-600">{KPIData.KPI_Description}</p>
              </div>
            );
          })
        )}
      </div>


      {/* OKR Section */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800">Application Processing OKRs (Q1 2025)</h2>
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

      {/* Application Status Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Application Status Monitor</h2>
          <p className="text-sm text-gray-600 mt-1">Track progress and health of active applications</p>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-50">
              {/* <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ref# / Client Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Officer
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Stage
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLA Remaining
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr> */}

              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Id
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Team
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents submitted
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">

              {/* Loading State */}
              {tableData.isLoading && Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-100 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-20 bg-gray-200 rounded-full border"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-100 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}


              {/* Empty State */}
              {!tableData.isLoading && !tableData.isError && tableData?.data?.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500 text-sm bg-gray-50">
                    No applications found.
                  </td>
                </tr>
              )}

              {/* Success State */}
              {/* {!data.isLoading && !data.isError && applications.map((app, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800 font-mono">{app.refId}</p>
                      <p className="text-sm text-gray-700">{app.clientName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{app.productType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{app.assignedOfficer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${app.stageColor}`}>
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getSlaColor(app.slaStatus)}`}>
                      {app.slaRemaining}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{app.lastUpdated}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(app)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Activity Log"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <RoleGuard requiredRole="MANAGER" showMessage={false}>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </RoleGuard>
                      <RoleGuard requiredPermission="flag_issues" showMessage={false}>
                        <button
                          onClick={() => handleFlagClick(app)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Flag for Audit"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      </RoleGuard>
                    </div>
                  </td>
                </tr>
              ))} */}

              {!tableData.isLoading && !tableData.isError && tableData?.data?.data?.map((app, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{app.customer_id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{app.full_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{app.assigned_ops_team}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{app.documents_submitted}</span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{app.verification_status}</span>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        </div>
      </div>

      {/* Flag for Audit Modal */}
      {showFlagModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Flag for Audit
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Application: <span className="font-mono font-medium">{selectedApplication.refId}</span>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Client: <span className="font-medium">{selectedApplication.clientName}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flag Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Document Discrepancy</option>
                  <option>SLA Breach</option>
                  <option>Risk Assessment Required</option>
                  <option>Compliance Review</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the issue or reason for flagging..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleFlagSubmit}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Submit Flag
              </button>
              <button
                onClick={() => setShowFlagModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLog && selectedAppActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-h-[70vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Application Activity Log</h3>
              <button
                onClick={() => setShowActivityLog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Application Reference</p>
                  <p className="text-sm font-mono font-medium text-gray-800">{selectedAppActivity.refId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client Name</p>
                  <p className="text-sm font-medium text-gray-800">{selectedAppActivity.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Stage</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${selectedAppActivity.stageColor}`}>
                    {selectedAppActivity.stage}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned Officer</p>
                  <p className="text-sm text-gray-700">{selectedAppActivity.assignedOfficer}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Activity Timeline</h4>
              {(activityLogs[selectedAppActivity.refId] || []).map((log, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                        {log.agent}
                      </span>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{log.action}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  Add Note
                </button>
                <button className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {showDetailModal && selectedAppDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Application Details</h3>
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
                  <p className="text-xs text-gray-500 mb-1">Application Reference</p>
                  <p className="text-sm font-mono font-medium text-gray-800">{selectedAppDetail.refId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client Name</p>
                  <p className="text-sm font-medium text-gray-800">{selectedAppDetail.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Product Type</p>
                  <p className="text-sm text-gray-700">{selectedAppDetail.productType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned Officer</p>
                  <p className="text-sm text-gray-700">{selectedAppDetail.assignedOfficer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">SLA Remaining</p>
                  <p className="text-sm text-gray-700">{selectedAppDetail.slaRemaining}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="text-sm text-gray-700">{selectedAppDetail.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Status</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Application Stage</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedAppDetail.stageColor}`}>
                  {selectedAppDetail.stage}
                </span>
              </div>
            </div>

            {/* Processing Timeline */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Processing Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-600">Application submitted - 10:30 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-600">Documents uploaded - 11:15 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-600">Under review - 2:30 PM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">Pending next action</span>
                </div>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Document Checklist</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">Emirates ID</p>
                  <p className="text-sm text-green-700">Submitted ✓</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">Passport Copy</p>
                  <p className="text-sm text-green-700">Submitted ✓</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 font-medium">Salary Certificate</p>
                  <p className="text-sm text-yellow-700">Under Review</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">Bank Statement</p>
                  <p className="text-sm text-red-700">Missing</p>
                </div>
              </div>
            </div>

            {/* SLA Information */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">SLA Information</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Processing Target</span>
                  <span className="text-sm text-blue-700">3 Business Days</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Time Elapsed</span>
                  <span className="text-sm text-blue-700">1.5 Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Remaining Time</span>
                  <span className={`text-sm font-medium ${selectedAppDetail.slaStatus === 'warning' ? 'text-orange-600' : 'text-blue-700'}`}>
                    {selectedAppDetail.slaRemaining}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleViewClick(selectedAppDetail)}
                className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                View Activity Log
              </button>
              <button className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                Update Status
              </button>
              <button className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                Add Note
              </button>
            </div>
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
                <h3 className="text-lg font-semibold text-gray-800">Application Status OKR</h3>
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
                  <h4 className="text-lg font-semibold text-purple-800">{selectedOkr.objective}</h4>
                  <p className="text-sm text-purple-700 mt-1">{selectedOkr.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {React.createElement(getStatusIcon(selectedOkr.status), { className: "w-4 h-4 text-purple-600" })}
                    <span className={`text-sm px-2 py-1 rounded-full border ${selectedOkr.statusColor}`}>
                      {selectedOkr.status}
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">{selectedOkr.progress}% Complete</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-600 font-medium">Owner:</span>
                  <span className="text-purple-800 ml-2">{selectedOkr.owner}</span>
                </div>
                <div>
                  <span className="text-purple-600 font-medium">Quarter:</span>
                  <span className="text-purple-800 ml-2">{selectedOkr.quarter}</span>
                </div>
              </div>
            </div>

            {/* Key Results */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-4">Key Results</h4>
              <div className="space-y-4">
                {selectedOkr.keyResults.map((kr, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-800">{kr.kr}</h5>
                      <span className={`text-xs px-2 py-1 rounded-full ${kr.status === 'On Track' ? 'bg-green-50 text-green-700 border border-green-200' :
                        kr.status === 'At Risk' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                          kr.status === 'Ahead' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {kr.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Current: <span className="font-medium text-gray-800">{kr.current}{kr.unit}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Target: <span className="font-medium text-gray-800">{kr.target}{kr.unit}</span>
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{kr.progress}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${kr.status === 'On Track' ? 'bg-green-600' :
                          kr.status === 'At Risk' ? 'bg-orange-500' :
                            kr.status === 'Ahead' ? 'bg-blue-600' :
                              'bg-red-500'
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
                View Timeline
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

      {/* RBAC Access Levels Reference */}
      {/* 🔴 EXECUTIVE: View full status audit, override SLA */}
      {/* 🟡 MANAGER: Reassign, escalate, resolve flags */}
      {/* 🟢 SPECIALIST: View audit trail, comment on delays */}
      {/* 🔵 OPERATOR: View status, reassign if allowed */}
      {/* ⚪ SUPPORT: View-only */}
    </div>
  );
};

export default ApplicationStatus;