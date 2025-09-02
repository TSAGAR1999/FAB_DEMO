import React, { useState } from 'react';
import { Filter, Calendar, User, FileText, Clock, AlertTriangle, Eye, Flag, CheckCircle, RotateCcw, Award, Crosshair, Target, TrendingUp, TrendingDown, X } from 'lucide-react';
import AIIcon from '../components/AIIcon';
import { usePostAuditTrails } from '../API/query';
import { adhocQuerys, SchemaId } from "../Constants"
import { useKPIQueries } from '../API/BqsQuery';
import KPISkeleton from './KPISkeleton';
import { useQuery } from '@tanstack/react-query';
import { PostSchema } from '../API/Api';

const AuditTrail = () => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'timeline'
  const [filters, setFilters] = useState({
    dateRange: 'today',
    screen: 'all',
    actionType: 'all',
    userRole: 'all'
  });
  const [showOkrModal, setShowOkrModal] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState(null);

  const kpis = [
    {
      id: 'total-actions',
      title: 'Total Actions Today',
      value: 247,
      unit: '',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      target: 250, // higher is better
      direction: 'higher',
      progressPct: Math.min(100, Math.round((247 / 250) * 100)), // 99%
      status: 'On Track',
      progressColor: 'bg-blue-600',
      description: 'All actions triggered and completed today across workflows.',
      trend: { delta: '+4%', period: 'WoW', direction: 'up' },
      tooltip: 'Daily goal: 250 total actions'
    },
    {
      id: 'ai-actions',
      title: 'AI-Triggered Actions',
      value: 189,
      unit: '',
      icon: AlertTriangle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 200, // higher is better
      direction: 'higher',
      progressPct: Math.min(100, Math.round((189 / 200) * 100)), // 95%
      status: 'On Track',
      progressColor: 'bg-green-600',
      description: 'Actions automatically initiated and processed by AI systems.',
      trend: { delta: '+5%', period: 'WoW', direction: 'up' },
      tooltip: 'Target: 200 AI-triggered actions per day'
    },
    {
      id: 'ai-escalations',
      title: '% Escalated by AI',
      value: 12,
      unit: '%',
      icon: Flag,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      target: 8, // lower is better
      direction: 'lower',
      progressPct: Math.min(100, Math.round((8 / 12) * 100)), // 67%
      status: 'At Risk',
      progressColor: 'bg-orange-600',
      description: 'Percentage of cases escalated for manual review by AI.',
      trend: { delta: '+1%', period: 'WoW', direction: 'up' },
      tooltip: 'Keep escalations below 8%'
    },
    {
      id: 'human-overrides',
      title: 'Human Overrides',
      value: 8,
      unit: '',
      icon: User,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      target: 5, // lower is better
      direction: 'lower',
      progressPct: Math.min(100, Math.round((5 / 8) * 100)), // 63%
      status: 'Behind',
      progressColor: 'bg-purple-600',
      description: 'Instances where human operators overrode AI decisions.',
      trend: { delta: '+2', period: 'DoD', direction: 'up' },
      tooltip: 'Keep overrides to 5 or fewer per day'
    }
  ];

  const allData = useKPIQueries(adhocQuerys.AuditTrail);

  const tableData = useQuery({
    queryKey: ['auditTrialTable'],
    queryFn: () => PostSchema("689b1ed4e9c2d3295698807d/instances/list", {
      "dbType": "TIDB"
    })
  })

  console.log(tableData,"tableData");
  

  const auditLogs = [
    {
      timestamp: '14:32:15',
      actor: 'ComplianceAgent',
      actorType: 'agent',
      action: 'Sanctions match found against EU list for Omar Abdullah',
      screen: 'Compliance',
      role: 'AI Agent',
      outcome: 'Flagged',
      outcomeIcon: Flag,
      outcomeColor: 'text-orange-600',
      ref_id: 'FAB-2025-001253'
    },
    {
      timestamp: '14:28:43',
      actor: 'Mohammed Ali',
      actorType: 'user',
      action: 'Escalated application FAB-2025-001247 to Compliance team',
      screen: 'Risk Screening',
      role: 'Risk Specialist',
      outcome: 'Escalated',
      outcomeIcon: AlertTriangle,
      outcomeColor: 'text-orange-600',
      ref_id: 'FAB-2025-001247'
    },
    {
      timestamp: '14:25:12',
      actor: 'OCRAgent',
      actorType: 'agent',
      action: 'Document extraction completed with 94.7% confidence for Emirates ID',
      screen: 'New Application',
      role: 'AI Agent',
      outcome: 'Logged',
      outcomeIcon: FileText,
      outcomeColor: 'text-blue-600',
      ref_id: 'FAB-2025-001251'
    },
    {
      timestamp: '14:22:08',
      actor: 'RiskFlagAgent',
      actorType: 'agent',
      action: 'Marked Ahmed Hassan as High Risk due to duplicate ID pattern',
      screen: 'Risk Screening',
      role: 'AI Agent',
      outcome: 'Flagged',
      outcomeIcon: Flag,
      outcomeColor: 'text-orange-600',
      ref_id: 'FAB-2025-001250'
    },
    {
      timestamp: '14:18:55',
      actor: 'Fatima Ahmed',
      actorType: 'user',
      action: 'Approved KYC clearance for Sarah Al-Mansouri',
      screen: 'KYC Screening',
      role: 'Compliance Officer',
      outcome: 'Approved',
      outcomeIcon: CheckCircle,
      outcomeColor: 'text-green-600',
      ref_id: 'FAB-2025-001249'
    },
    {
      timestamp: '14:15:33',
      actor: 'IntakeAgent',
      actorType: 'agent',
      action: 'Application FAB-2025-001252 initialized for Dubai Trading LLC',
      screen: 'New Application',
      role: 'AI Agent',
      outcome: 'Logged',
      outcomeIcon: FileText,
      outcomeColor: 'text-blue-600',
      ref_id: 'FAB-2025-001252'
    },
    {
      timestamp: '14:12:17',
      actor: 'Ali Hassan',
      actorType: 'user',
      action: 'Reassigned application to senior specialist due to complexity',
      screen: 'Application Status',
      role: 'Manager',
      outcome: 'Reassigned',
      outcomeIcon: RotateCcw,
      outcomeColor: 'text-blue-600',
      ref_id: 'FAB-2025-001248'
    },
    {
      timestamp: '14:08:44',
      actor: 'KYCCheckerAgent',
      actorType: 'agent',
      action: 'PEP screening completed - no political exposure detected',
      screen: 'Compliance',
      role: 'AI Agent',
      outcome: 'Cleared',
      outcomeIcon: CheckCircle,
      outcomeColor: 'text-green-600',
      ref_id: 'FAB-2025-001246'
    },
    {
      timestamp: '14:05:21',
      actor: 'Aisha Mohamed',
      actorType: 'user',
      action: 'Added compliance note regarding address verification',
      screen: 'Compliance',
      role: 'Compliance Officer',
      outcome: 'Logged',
      outcomeIcon: FileText,
      outcomeColor: 'text-blue-600',
      ref_id: 'FAB-2025-001245'
    },
    {
      timestamp: '14:02:09',
      actor: 'RoutingAgent',
      actorType: 'agent',
      action: 'Routed application to Corporate Banking queue based on entity type',
      screen: 'New Application',
      role: 'AI Agent',
      outcome: 'Routed',
      outcomeIcon: RotateCcw,
      outcomeColor: 'text-blue-600',
      ref_id: 'FAB-2025-001244'
    }
  ];


  const agentStats = [
    { agent: 'OCRAgent', actions: 45, lastActive: '2 min ago' },
    { agent: 'ComplianceAgent', actions: 23, lastActive: '5 min ago' },
    { agent: 'RiskFlagAgent', actions: 18, lastActive: '8 min ago' },
    { agent: 'IntakeAgent', actions: 67, lastActive: '1 min ago' },
    { agent: 'KYCCheckerAgent', actions: 31, lastActive: '3 min ago' }
  ];

  // OKR Data for Audit Trail
  const okrData = [
    {
      id: 1,
      objective: "Achieve 100% Audit Trail Completeness",
      description: "Ensure comprehensive logging and traceability of all system and user actions for regulatory compliance",
      owner: "Audit & Compliance Team",
      quarter: "Q1 2025",
      progress: 98,
      status: "On Track",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      keyResults: [
        {
          kr: "Maintain 99% decision logging coverage",
          current: 99,
          target: 99,
          unit: "%",
          progress: 100,
          status: "On Track"
        },
        {
          kr: "Achieve 95% AI explainability rate",
          current: 91,
          target: 95,
          unit: "%",
          progress: 96,
          status: "On Track"
        },
        {
          kr: "Reduce audit exception rate to under 3%",
          current: 4,
          target: 3,
          unit: "%",
          progress: 75,
          status: "At Risk"
        }
      ]
    },
    {
      id: 2,
      objective: "Enhance System Monitoring & Alerting",
      description: "Improve real-time monitoring capabilities and proactive alerting for system anomalies",
      owner: "System Operations Team",
      quarter: "Q1 2025",
      progress: 85,
      status: "On Track",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      keyResults: [
        {
          kr: "Achieve 99.5% system uptime",
          current: 99.8,
          target: 99.5,
          unit: "%",
          progress: 130,
          status: "Ahead"
        },
        {
          kr: "Reduce mean time to detection to 5 minutes",
          current: 8,
          target: 5,
          unit: "min",
          progress: 63,
          status: "Behind"
        },
        {
          kr: "Maintain 95% alert accuracy rate",
          current: 92,
          target: 95,
          unit: "%",
          progress: 97,
          status: "On Track"
        }
      ]
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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

  const getActorBadgeStyle = (actorType) => {
    return actorType === 'agent'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // const data = usePostAuditTrails(SchemaId.AuditTrailsTable)

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

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
            const progressPct = Math.min(100, Math.round((value / KPIData.target) * 100));

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
          <h2 className="text-lg font-semibold text-gray-800">Audit & Monitoring OKRs (Q1 2025)</h2>
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

      {/* Filter Strip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Screen Filter */}
          <select
            value={filters.screen}
            onChange={(e) => handleFilterChange('screen', e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Screens</option>
            <option value="intake">New Application</option>
            <option value="risk">Risk Screening</option>
            <option value="compliance">Compliance</option>
            <option value="status">Application Status</option>
          </select>

          {/* Action Type Filter */}
          <select
            value={filters.actionType}
            onChange={(e) => handleFilterChange('actionType', e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="escalation">Escalations</option>
            <option value="approval">Approvals</option>
            <option value="flag">Flags</option>
            <option value="assignment">Assignments</option>
          </select>

          {/* User Role Filter */}
          <select
            value={filters.userRole}
            onChange={(e) => handleFilterChange('userRole', e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="agent">AI Agents</option>
            <option value="specialist">Specialists</option>
            <option value="manager">Managers</option>
            <option value="officer">Officers</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'table'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'timeline'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Audit Log Table/Timeline - Takes 3 columns */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Decision log</h2>
              <p className="text-sm text-gray-600 mt-1">Complete log of system and user actions</p>
            </div>

            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        APPLICATION ID
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DECISION STATUS
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DECISION DATE
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DECISION NOTES
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACCOUNT CREATED
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {!tableData.isLoading && tableData.isSuccess && tableData.data.map((log, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-gray-800">{log.application_id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{log.decision_status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{log.decision_date}</span>
                          </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{log.decision_notes}</span>
                          </td>
                           <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{(log.account_created_flag?"Yes":"No")}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {tableData.isLoading && Array.from({ length: 10 }).map((_, index) => (
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
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4 divide-y divide-gray-200">
                  {auditLogs.map((log, index) => {
                    const OutcomeIcon = log.outcomeIcon;
                    return (
                      <div key={index} className="pt-4 first:pt-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-mono text-gray-800">{log.timestamp}</span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActorBadgeStyle(log.actorType)}`}>
                                  {log.actor}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <OutcomeIcon className={`w-4 h-4 ${log.outcomeColor}`} />
                                <span className={`text-sm ${log.outcomeColor}`}>{log.outcome}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{log.action}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Screen: {log.screen}</span>
                              <span>Role: {log.role}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* AI Agent Activity Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AIIcon size={16} className="text-gray-500" />
              AI Agent Activity
            </h3> */}

            {/* <div className="space-y-4">
              {agentStats.map((agent, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <AIIcon size={12} className="text-gray-600" />
                      {agent.agent}
                    </span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{agent.actions} actions today</span>
                    <span>Last: {agent.lastActive}</span>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Summary Stats */}
            {/* <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Today's Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total AI Actions:</span>
                  <span className="font-medium text-gray-800">184</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Human Overrides:</span>
                  <span className="font-medium text-gray-800">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Most Active Agent:</span>
                  <span className="font-medium text-gray-800">IntakeAgent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Escalation Rate:</span>
                  <span className="font-medium text-gray-800">12%</span>
                </div>
              </div>
            </div> */}

            {/* RBAC Access Levels */}
            <div className="mt-6 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Access Levels</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>EXECUTIVE: Complete audit history</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>MANAGER: Team filtered logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SPECIALIST: Module-specific logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>OPERATOR: Own actions only</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>SUPPORT: Intake module only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OKR Detail Modal */}
      {showOkrModal && selectedOkr && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Audit & Monitoring OKR</h3>
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
                Generate Audit Report
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
      {/* 🔴 EXECUTIVE: Complete audit history across all modules */}
      {/* 🟡 MANAGER: Filtered logs by team or date */}
      {/* 🟢 SPECIALIST: View specific modules (e.g., Risk, Compliance) */}
      {/* 🔵 OPERATOR: See only own actions + assigned applications */}
      {/* ⚪ SUPPORT: Read-only for Intake module only */}
    </div>
  );
};

export default AuditTrail;