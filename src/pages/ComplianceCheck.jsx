import React, { useState } from 'react';
import { Eye, Flag, AlertTriangle, CheckCircle, Clock, Users, TrendingUp, Shield, FileText, X, Award, Crosshair, Target, TrendingDown } from 'lucide-react';
import AIIcon from '../components/AIIcon';
import { usePostComplianceCheck } from '../API/query';
import { SchemaId } from '../Contants';
import { useKPIQueries } from '../API/BqsQuery';
import { adhocQuerys, tableQueries } from '../Constants';
import KPISkeleton from './KPISkeleton';
import { useQuery } from '@tanstack/react-query';
import { postGetKPIData } from '../API/BqsApi';
const ComplianceCheck = () => {
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClientDetail, setSelectedClientDetail] = useState(null);
  const [showOkrModal, setShowOkrModal] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState(null);

  const kpis = [
    {
      id: 'apps-screened-today',
      title: 'Applications Screened Today',
      value: 84,
      unit: '',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      target: 90, // higher is better
      direction: 'higher',
      progressPct: Math.min(100, Math.round((84 / 90) * 100)), // 93%
      status: 'On Track',
      progressColor: 'bg-blue-600',
      description: 'Total number of applications screened today compared to target.',
      trend: { delta: '+6%', period: 'WoW', direction: 'up' },
      tooltip: 'Daily goal: 90 applications screened'
    },
    {
      id: 'pep-matches',
      title: 'Matched with PEP/Sanctions',
      value: 5,
      unit: '',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      target: 3, // lower is better
      direction: 'lower',
      progressPct: Math.min(100, Math.round((3 / 5) * 100)), // 60%
      status: 'At Risk',
      progressColor: 'bg-orange-600',
      description: 'Applications flagged due to matches in PEP or sanctions lists.',
      trend: { delta: '+1', period: 'DoD', direction: 'up' },
      tooltip: 'Keep matches at or below 3 per day'
    },
    {
      id: 'auto-cleared',
      title: 'Cleared Automatically',
      value: 72,
      unit: '%',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 80, // higher is better
      direction: 'higher',
      progressPct: Math.min(100, Math.round((72 / 80) * 100)), // 90%
      status: 'On Track',
      progressColor: 'bg-green-600',
      description: 'Percentage of applications cleared without manual review.',
      trend: { delta: '+2%', period: 'WoW', direction: 'up' },
      tooltip: 'Target: ≥ 80% auto-cleared'
    },
    {
      id: 'manual-review',
      title: 'Escalated for Manual Review',
      value: 9,
      unit: '',
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      target: 6, // lower is better
      direction: 'lower',
      progressPct: Math.min(100, Math.round((6 / 9) * 100)), // 67%
      status: 'Behind',
      progressColor: 'bg-purple-600',
      description: 'Applications requiring manual review due to complexity or matches.',
      trend: { delta: '+2', period: 'WoW', direction: 'up' },
      tooltip: 'Keep escalations at or below 6 per day'
    }
  ];

  // OKR Data for Compliance Check
  const okrData = [
    {
      id: 1,
      objective: "Achieve 99% Compliance Screening Accuracy",
      description: "Enhance AML/KYC screening precision to meet regulatory standards and minimize compliance risks",
      owner: "Compliance Team",
      quarter: "Q1 2025",
      progress: 96,
      status: "On Track",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      keyResults: [
        {
          kr: "Reduce false positive rate to under 4%",
          current: 6,
          target: 4,
          unit: "%",
          progress: 67,
          status: "At Risk"
        },
        {
          kr: "Achieve 98% sanctions screening coverage",
          current: 94,
          target: 98,
          unit: "%",
          progress: 96,
          status: "On Track"
        },
        {
          kr: "Maintain under 2-hour compliance review time",
          current: 1.8,
          target: 2.0,
          unit: "hours",
          progress: 110,
          status: "Ahead"
        }
      ]
    },
    {
      id: 2,
      objective: "Strengthen Regulatory Reporting",
      description: "Improve compliance reporting accuracy and timeliness for regulatory submissions",
      owner: "Regulatory Affairs Team",
      quarter: "Q1 2025",
      progress: 88,
      status: "On Track",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      keyResults: [
        {
          kr: "Achieve 100% on-time regulatory submissions",
          current: 95,
          target: 100,
          unit: "%",
          progress: 95,
          status: "On Track"
        },
        {
          kr: "Reduce compliance exceptions to under 2%",
          current: 4,
          target: 2,
          unit: "%",
          progress: 50,
          status: "Behind"
        },
        {
          kr: "Maintain 99% audit trail completeness",
          current: 99,
          target: 99,
          unit: "%",
          progress: 100,
          status: "On Track"
        }
      ]
    }
  ];

  const clients = [
    {
      refId: 'FAB-2025-001247',
      clientName: 'Ahmed Hassan Al-Mansouri',
      nationality: 'UAE',
      clientId: '784-1985-1234567-8',
      complianceResult: 'Matched',
      matchSource: 'OFAC',
      assignedOfficer: 'Mohammed Ali',
      status: 'Action Required',
      lastScreening: '2 hours ago',
      complianceColor: 'bg-red-50 text-red-700 border-red-200',
      statusColor: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      refId: 'FAB-2025-001248',
      clientName: 'Sarah Al-Mansouri',
      nationality: 'UAE',
      clientId: '784-1990-2345678-9',
      complianceResult: 'Cleared',
      matchSource: 'N/A',
      assignedOfficer: 'Fatima Ahmed',
      status: 'Reviewed',
      lastScreening: '1 hour ago',
      complianceColor: 'bg-green-50 text-green-700 border-green-200',
      statusColor: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      refId: 'FAB-2025-001249',
      clientName: 'Omar Abdullah',
      nationality: 'Pakistan',
      clientId: '784-1988-3456789-0',
      complianceResult: 'Flagged for Review',
      matchSource: 'EU Sanctions',
      assignedOfficer: 'Ali Hassan',
      status: 'Escalated',
      lastScreening: '30 min ago',
      complianceColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      statusColor: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      refId: 'FAB-2025-001250',
      clientName: 'Priya Sharma',
      nationality: 'India',
      clientId: '784-1992-4567890-1',
      complianceResult: 'Cleared',
      matchSource: 'N/A',
      assignedOfficer: 'Aisha Mohamed',
      status: 'Reviewed',
      lastScreening: '45 min ago',
      complianceColor: 'bg-green-50 text-green-700 border-green-200',
      statusColor: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      refId: 'FAB-2025-001251',
      clientName: 'John Mitchell',
      nationality: 'UK',
      clientId: '784-1987-5678901-2',
      complianceResult: 'Matched',
      matchSource: 'PEP Database',
      assignedOfficer: 'Khalid Al-Rashid',
      status: 'Action Required',
      lastScreening: '3 hours ago',
      complianceColor: 'bg-red-50 text-red-700 border-red-200',
      statusColor: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      refId: 'FAB-2025-001252',
      clientName: 'Maria Rodriguez',
      nationality: 'Spain',
      clientId: '784-1991-6789012-3',
      complianceResult: 'Flagged for Review',
      matchSource: 'Dow Jones',
      assignedOfficer: 'Noura Al-Zaabi',
      status: 'Action Required',
      lastScreening: '1 hour ago',
      complianceColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      statusColor: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  const agentActivity = [
    {
      agent: 'ComplianceAgent',
      message: 'Matched against EU Sanctions List for Omar Abdullah',
      timestamp: '2 min ago',
      type: 'warning'
    },
    {
      agent: 'KYCCheckerAgent',
      message: 'Screened with no match – cleared automatically for Sarah Al-Mansouri',
      timestamp: '5 min ago',
      type: 'success'
    },
    {
      agent: 'ComplianceAgent',
      message: 'PEP match detected for John Mitchell - Political exposure confirmed',
      timestamp: '8 min ago',
      type: 'alert'
    },
    {
      agent: 'ComplianceAgent',
      message: 'OFAC sanctions screening completed for Ahmed Hassan',
      timestamp: '12 min ago',
      type: 'warning'
    },
    {
      agent: 'KYCCheckerAgent',
      message: 'Batch compliance screening completed - 25 clients processed',
      timestamp: '15 min ago',
      type: 'info'
    },
    {
      agent: 'ComplianceAgent',
      message: 'False positive flagged for manual review - Maria Rodriguez',
      timestamp: '18 min ago',
      type: 'info'
    }
  ];

  const handleViewClient = (client) => {
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
      case 'Ahead': return TrendingUp;
      case 'On Track': return Target;
      case 'At Risk': return AlertTriangle;
      case 'Behind': return TrendingDown;
      default: return Target;
    }
  };

  // const data = usePostComplianceCheck(SchemaId.ComplianceCheckTable)

  const allData = useKPIQueries(adhocQuerys.ComplianceCheck);

   const tableData = useQuery({
    queryKey: ['ComplianceCheckTable'],
    queryFn: () => postGetKPIData(tableQueries.complianceCheck)
  })
  
  const agentLogs = useQuery({
      queryKey: ["agentLogs"],
      queryFn: () =>
        postGetKPIData("select * from t_68b18e14449b0c059a42ad7f_t where agent_name = 'Compliance_agent'"),
    });

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
          <h2 className="text-lg font-semibold text-gray-800">Compliance & Regulatory OKRs (Q1 2025)</h2>
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
        {/* Compliance Table - Takes 3 columns */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Compliance Screening Results</h2>
              <p className="text-sm text-gray-600 mt-1">AML/KYC screening outcomes and regulatory compliance status</p>
            </div>

            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-50">
                  {/* <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ref# / Client Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compliance Result
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Source
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Officer
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr> */}
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ref# / Client Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compliance Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checked By
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sanctions Result
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.isLoading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!tableData.isLoading && tableData.isSuccess &&
                    tableData.data.data.map((client, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors" onClick={()=>handleViewClient(client)}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800 font-mono">{client.application_id}</p>
                            <p className="text-sm text-gray-700">{client.full_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-700">{client.nationality}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${client.complianceColor}`}>
                            {client.compliance_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{client.risk_level}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{client.checked_by}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${client.statusColor}`}>
                            {client.sanctions_list_result}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className='text-sm text-gray-700'>{client.review_notes}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* Compliance Agent Activity Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AIIcon size={16} className="text-gray-500" />
              Agent Activity
            </h3>

            <div className="space-y-4">
              {!agentLogs.isLoading && agentLogs.data.data.map((activity, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                      <AIIcon size={10} className="text-blue-600" />
                      {activity.agent_name}
                    </span>
                    {/* <span className="text-xs text-gray-500">{activity.timestamp}</span> */}
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
                  <span className="text-xs text-gray-600">ComplianceAgent</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">KYCCheckerAgent</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">Active</span>
                </div>
              </div>
            </div> */}

            {/* RBAC Access Levels */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Access Levels</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>EXECUTIVE: View all matches, approve overrides</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>MANAGER: Escalate or clear flagged clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SPECIALIST: Review match detail, approve/flag</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>OPERATOR: View results, request specialist review</span>
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

      {/* Client Compliance Detail Modal */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !m-0">
          <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Client Compliance Detail</h3>
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
                  <p className="text-xs text-gray-500 mb-1">Application Reference</p>
                  <p className="text-sm font-mono font-medium text-gray-800">{selectedClient.application_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client Name</p>
                  <p className="text-sm font-medium text-gray-800">{selectedClient.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nationality</p>
                  <p className="text-sm text-gray-700">{selectedClient.nationality}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client ID</p>
                  <p className="text-sm font-mono text-gray-700">{selectedClient.customer_id}</p>
                </div>
              </div>
            </div>

            {/* Screening Results */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Compliance Screening Results</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Compliance Result</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClient.complianceColor}`}>
                    {selectedClient.complianceResult}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Match Source</span>
                  <span className="text-sm text-gray-600">{selectedClient.matchSource}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Current Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClient.statusColor}`}>
                    {selectedClient.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Last Screening</span>
                  <span className="text-sm text-gray-600">{selectedClient.lastScreening}</span>
                </div>
              </div>
            </div> */}

            {/* PEP/AML Details */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">PEP/AML Screening Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">OFAC Sanctions List:</span>
                    <span className="text-gray-800">No Match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EU Sanctions List:</span>
                    <span className="text-red-600">Match Found</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PEP Database:</span>
                    <span className="text-gray-800">No Match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adverse Media:</span>
                    <span className="text-gray-800">Clear</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Timeline */}
            {/* <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Compliance Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-600">Application submitted - 10:30 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-600">Compliance screening initiated - 10:45 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-600">Sanctions match detected - 11:15 AM</span>
                </div>
                <div className="flex items-center gap-3 p-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-600">Flagged for manual review - 11:30 AM</span>
                </div>
              </div>
            </div> */}

            {/* Action Buttons */}
            {/* <div className="flex gap-3">
              <button className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                Clear Compliance
              </button>
              <button className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                Escalate to Manager
              </button>
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Add Compliance Note
              </button>
            </div> */}
          </div>
        </div>
      )}

      {/* Client Compliance Detail Modal */}
      {showDetailModal && selectedClientDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Compliance Details</h3>
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
                  <p className="text-xs text-gray-500 mb-1">Application Reference</p>
                  <p className="text-sm font-mono font-medium text-gray-800">{selectedClientDetail.refId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client Name</p>
                  <p className="text-sm font-medium text-gray-800">{selectedClientDetail.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nationality</p>
                  <p className="text-sm text-gray-700">{selectedClientDetail.nationality}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client ID</p>
                  <p className="text-sm font-mono text-gray-700">{selectedClientDetail.clientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned Officer</p>
                  <p className="text-sm text-gray-700">{selectedClientDetail.assignedOfficer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Screening</p>
                  <p className="text-sm text-gray-700">{selectedClientDetail.lastScreening}</p>
                </div>
              </div>
            </div>

            {/* Compliance Screening Results */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Compliance Screening Results</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Compliance Result</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClientDetail.complianceColor}`}>
                    {selectedClientDetail.complianceResult}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Match Source</span>
                  <span className="text-sm text-gray-600">{selectedClientDetail.matchSource}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Current Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${selectedClientDetail.statusColor}`}>
                    {selectedClientDetail.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Screening Results */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Screening Results</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">OFAC Sanctions</p>
                  <p className="text-sm text-green-700">No Match ✓</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">EU Sanctions</p>
                  <p className="text-sm text-red-700">Match Found ⚠</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">PEP Database</p>
                  <p className="text-sm text-green-700">No Match ✓</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">Adverse Media</p>
                  <p className="text-sm text-green-700">Clear ✓</p>
                </div>
              </div>
            </div>

            {/* Match Details */}
            {selectedClientDetail.matchSource !== 'N/A' && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Match Details</h4>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-orange-600">Source: {selectedClientDetail.matchSource}</span>
                    <span className="text-xs text-orange-600">92% Match Confidence</span>
                  </div>
                  <p className="text-sm text-orange-700 mb-2">Potential match found in sanctions database</p>
                  <div className="text-xs text-orange-600">
                    <p>• Name similarity: High</p>
                    <p>• Date of birth: Partial match</p>
                    <p>• Nationality: Exact match</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                Clear Compliance
              </button>
              <button className="flex-1 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                Escalate to Manager
              </button>
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Add Compliance Note
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
                <h3 className="text-lg font-semibold text-gray-800">Compliance OKR Details</h3>
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
                Generate Report
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
      {/* 🔴 EXECUTIVE: View all matches, approve overrides */}
      {/* 🟡 MANAGER: Escalate or clear flagged clients */}
      {/* 🟢 SPECIALIST: Review match detail, approve/flag */}
      {/* 🔵 OPERATOR: View results, request specialist review */}
      {/* ⚪ SUPPORT: View-only */}
    </div>
  );
};

export default ComplianceCheck;