import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Crosshair,
  Grid3X3,
  PieChart,
  Plus,
  Shield,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
  X
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { postGetKPIData } from '../API/BqsApi';
import AIIcon from '../components/AIIcon';
import HeatmapECharts from '../components/Dashboard/HeatmapECharts ';
import KPIRadarChart from '../components/Dashboard/KPIRadarChart ';
import RiskDistribution from '../components/Dashboard/RiskDistribution ';
import TrendPanels from '../components/Dashboard/TrendPanels ';
import RoleGuard from '../components/RoleGuard';
import { useAuth } from '../contexts/AuthContext';
import { useKPIQueries } from '../API/BqsQuery';
import { KPIList } from '../Constants';
import AutomatedProcessing from './AutomatedProcessing';
import ProcessingSpeedRevolution from './ProcessingSpeedRevolution';
import SystemReliability from './SystemReliability';
import DigiTransform from './SanctionsCompliance';
import KYCComplaiceMaster from './KYCComplaiceMaster';
import SanctionsCompliance from './SanctionsCompliance';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('strategic');
  const [showKpiModal, setShowKpiModal] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [showOkrModal, setShowOkrModal] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState(null);
  const [selectedKPIs, setSelectedKPIs] = useState([]);
  const [draggedKPI, setDraggedKPI] = useState(null);



  // All KPIs data organized by category
  const allKPIs = {
    operational: [
      {
        id: 'auto-verification',
        name: 'Auto-verification Rate',
        value: 87,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Operational Efficiency',
        isAI: true,
        target: 90,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((87 / 90) * 100)), // 97%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Share of items verified automatically without manual checks.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 90% auto-verification'
      },
      {
        id: 'verification-time',
        name: 'Avg. Verification Time',
        value: 4.2,
        unit: 'min',
        color: 'bg-blue-50 text-blue-700',
        category: 'Operational Efficiency',
        isAI: true,
        target: 3.0,               // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((3.0 / 4.2) * 100)), // 71%
        status: 'Behind',
        progressColor: 'bg-blue-600',
        description: 'Average minutes to complete verification per case.',
        trend: { delta: '-0.2 min', period: 'WoW', direction: 'down' },
        tooltip: 'Aim ≤ 3.0 min'
      },
      {
        id: 'tat',
        name: 'TAT (Turnaround Time)',
        value: 2.1,
        unit: 'days',
        color: 'bg-blue-50 text-blue-700',
        category: 'Operational Efficiency',
        target: 2.0,               // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((2.0 / 2.1) * 100)), // 95%
        status: 'On Track',
        progressColor: 'bg-blue-600',
        description: 'Average days from initiation to completion.',
        trend: { delta: '-0.1 days', period: 'WoW', direction: 'down' },
        tooltip: 'Target ≤ 2.0 days'
      },
      {
        id: 'agent-latency',
        name: 'Agent Latency',
        value: 1.8,
        unit: 'sec',
        color: 'bg-green-50 text-green-700',
        category: 'Operational Efficiency',
        isAI: true,
        target: 1.5,               // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((1.5 / 1.8) * 100)), // 83%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Average AI agent response time.',
        trend: { delta: '-0.1 sec', period: 'WoW', direction: 'down' },
        tooltip: 'Target ≤ 1.5 sec'
      }
    ],
    automation: [
      {
        id: 'auto-approval',
        name: 'Auto-approval Rate',
        value: 76,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Cost & Automation',
        isAI: true,
        target: 80,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((76 / 80) * 100)), // 95%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Portion of cases approved without human touch.',
        trend: { delta: '+2%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 80% auto-approval'
      },
      {
        id: 'exception-rate',
        name: 'Exception Rate',
        value: 12,
        unit: '%',
        color: 'bg-orange-50 text-orange-700',
        category: 'Cost & Automation',
        isAI: true,
        target: 8,                 // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((8 / 12) * 100)), // 67%
        status: 'At Risk',
        progressColor: 'bg-orange-600',
        description: 'Cases deviating from the happy path requiring special handling.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Keep exceptions ≤ 8%'
      },
      {
        id: 'task-completion',
        name: 'Task Completion Rate',
        value: 94,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Cost & Automation',
        isAI: true,
        target: 95,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((94 / 95) * 100)), // 99%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Tasks finished within the period out of total assigned.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 95% completion'
      }
    ],
    scalability: [
      {
        id: 'resubmission',
        name: 'Re-submission Volume',
        value: 8,
        unit: '%',
        color: 'bg-orange-50 text-orange-700',
        category: 'Scalability',
        target: 5,                 // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((5 / 8) * 100)), // 63%
        status: 'Behind',
        progressColor: 'bg-orange-600',
        description: 'Share of cases requiring rework or re-submission.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Keep re-submissions ≤ 5%'
      },
      {
        id: 'sla-compliance',
        name: 'SLA Compliance',
        value: 92,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Scalability',
        target: 95,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((92 / 95) * 100)), // 97%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Work completed within agreed service timelines.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 95% SLA'
      },
      {
        id: 'downtime',
        name: 'Downtime Metrics',
        value: 0.2,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Scalability',
        target: 0.1,               // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((0.1 / 0.2) * 100)), // 50%
        status: 'At Risk',
        progressColor: 'bg-green-600',
        description: 'Total unavailability as a percentage of scheduled time.',
        trend: { delta: '-0.05%', period: 'WoW', direction: 'down' },
        tooltip: 'Target ≤ 0.1% downtime'
      }
    ],
    standardization: [
      {
        id: 'form-completeness',
        name: 'Form Completeness Score',
        value: 89,
        unit: '%',
        color: 'bg-blue-50 text-blue-700',
        category: 'Standardization',
        target: 92,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((89 / 92) * 100)), // 97%
        status: 'On Track',
        progressColor: 'bg-blue-600',
        description: 'Degree to which mandatory fields are correctly filled.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 92% completeness'
      },
      {
        id: 'dbr-accuracy',
        name: 'DBR Accuracy',
        value: 96,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Standardization',
        isAI: true,
        target: 97,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((96 / 97) * 100)), // 99%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Accuracy of document-based recognition models.',
        trend: { delta: '+0.5%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 97% DBR accuracy'
      },
      {
        id: 'doc-verification',
        name: 'Document Verification Accuracy',
        value: 94,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Standardization',
        isAI: true,
        target: 96,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((94 / 96) * 100)), // 98%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Correctness of automated document verification outcomes.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 96% verification accuracy'
      }
    ],
    operationalRelevance: [
      {
        id: 'apps-processed',
        name: 'Applications Processed Today',
        value: 156,
        unit: '',
        color: 'bg-blue-50 text-blue-700',
        category: 'Operational',
        target: 160,               // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((156 / 160) * 100)), // 98%
        status: 'On Track',
        progressColor: 'bg-blue-600',
        description: 'Total applications processed today across workflows.',
        trend: { delta: '+4%', period: 'WoW', direction: 'up' },
        tooltip: 'Daily goal: 160 processed'
      },
      {
        id: 'queue-processing',
        name: 'Queue Processing Rate',
        value: 89,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Operational',
        target: 92,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((89 / 92) * 100)), // 97%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Percent of queued items cleared within the window.',
        trend: { delta: '+2%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 92%'
      },
      {
        id: 'agent-utilization',
        name: 'Agent Utilization',
        value: 78,
        unit: '%',
        color: 'bg-yellow-50 text-yellow-700',
        category: 'Operational',
        target: 80,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((78 / 80) * 100)), // 98%
        status: 'On Track',
        progressColor: 'bg-yellow-600',
        description: 'Utilization of available agent capacity.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 80% utilization'
      },
      {
        id: 'error-rate',
        name: 'Error Rate',
        value: 3.2,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Operational',
        target: 2.5,               // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((2.5 / 3.2) * 100)), // 78%
        status: 'At Risk',
        progressColor: 'bg-green-600',
        description: 'Percentage of runs resulting in errors.',
        trend: { delta: '-0.2%', period: 'WoW', direction: 'down' },
        tooltip: 'Keep errors ≤ 2.5%'
      },
      {
        id: 'peak-load',
        name: 'Peak Load Handling',
        value: 95,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Operational',
        target: 95,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((95 / 95) * 100)), // 100%
        status: 'Ahead',
        progressColor: 'bg-green-600',
        description: 'Capacity to handle peak workload without degradation.',
        trend: { delta: '+0%', period: 'WoW', direction: 'flat' },
        tooltip: 'Maintain ≥ 95% peak handling'
      },
      {
        id: 'resource-efficiency',
        name: 'Resource Efficiency',
        value: 87,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Operational',
        target: 90,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((87 / 90) * 100)), // 97%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Effective use of compute and human resources.',
        trend: { delta: '+1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 90% efficiency'
      }
    ],
    compliance: [
      {
        id: 'regulatory-compliance',
        name: 'Regulatory Compliance Rate',
        value: 99.2,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Compliance',
        target: 99,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((99.2 / 99) * 100)), // 100%
        status: 'Ahead',
        progressColor: 'bg-green-600',
        description: 'Adherence to regulatory requirements across processes.',
        trend: { delta: '+0.1%', period: 'WoW', direction: 'up' },
        tooltip: 'Maintain ≥ 99% compliance'
      },
      {
        id: 'aml-screening',
        name: 'AML Screening Accuracy',
        value: 97.8,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Compliance',
        target: 98,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((97.8 / 98) * 100)), // 99%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Accuracy of anti-money laundering detection.',
        trend: { delta: '+0.2%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 98% AML accuracy'
      },
      {
        id: 'kyc-completion',
        name: 'KYC Completion Rate',
        value: 94.5,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Compliance',
        target: 95,                // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((94.5 / 95) * 100)), // 99%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Successful completion of KYC workflows.',
        trend: { delta: '+0.5%', period: 'WoW', direction: 'up' },
        tooltip: 'Target ≥ 95% KYC completion'
      },
      {
        id: 'risk-assessment',
        name: 'Risk Assessment Coverage',
        value: 100,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Compliance',
        target: 100,               // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((100 / 100) * 100)), // 100%
        status: 'Ahead',
        progressColor: 'bg-green-600',
        description: 'Percentage of in-scope items assessed for risk.',
        trend: { delta: '+0%', period: 'WoW', direction: 'flat' },
        tooltip: 'Maintain 100% coverage'
      },
      {
        id: 'audit-trail',
        name: 'Audit Trail Completeness',
        value: 99.8,
        unit: '%',
        color: 'bg-green-50 text-green-700',
        category: 'Compliance',
        target: 100,               // higher is better
        direction: 'higher',
        progressPct: Math.min(100, Math.round((99.8 / 100) * 100)), // 100%
        status: 'On Track',
        progressColor: 'bg-green-600',
        description: 'Completeness of logs for traceability and audits.',
        trend: { delta: '+0.1%', period: 'WoW', direction: 'up' },
        tooltip: 'Target 100% completeness'
      },
      {
        id: 'false-positive',
        name: 'False Positive Rate',
        value: 4.2,
        unit: '%',
        color: 'bg-orange-50 text-orange-700',
        category: 'Compliance',
        target: 3,                 // lower is better
        direction: 'lower',
        progressPct: Math.min(100, Math.round((3 / 4.2) * 100)), // 71%
        status: 'At Risk',
        progressColor: 'bg-orange-600',
        description: 'Share of flagged items that are not true issues.',
        trend: { delta: '-0.3%', period: 'WoW', direction: 'down' },
        tooltip: 'Keep false positives ≤ 3%'
      }
    ]
  };


  // Strategic OKRs data
  const okrData = [
    {
      "id": 1,
      "heading": "AI Workflow Automation",
      "objective": "Achieve 95% AI Automation Rate Across All Workflows",
      "description": "Enhance AI-driven automation to minimize manual intervention while maintaining quality standards",
      "owner": "AI Operations Team",
      "quarter": "Q1 2025",
      "progress": 87,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Increase auto-verification rate to 90%",
          "current": 87,
          "target": 90,
          "unit": "%",
          "progress": 97,
          "status": "On Track"
        },
        {
          "kr": "Reduce manual intervention to under 8%",
          "current": 12,
          "target": 8,
          "unit": "%",
          "progress": 67,
          "status": "At Risk"
        },
        {
          "kr": "Achieve 2-minute average processing time",
          "current": 4.2,
          "target": 2.0,
          "unit": "min",
          "progress": 48,
          "status": "Behind"
        }
      ]
    },
    {
      "id": 2,
      "heading": "Risk & Compliance Excellence",
      "objective": "Strengthen Risk Management & Compliance Framework",
      "description": "Enhance risk detection capabilities and maintain regulatory compliance excellence",
      "owner": "Risk & Compliance Team",
      "quarter": "Q1 2025",
      "progress": 94,
      "status": "Ahead",
      "statusColor": "text-blue-600 bg-blue-50 border-blue-200",
      "keyResults": [
        {
          "kr": "Maintain 99%+ regulatory compliance rate",
          "current": 99.2,
          "target": 99,
          "unit": "%",
          "progress": 100,
          "status": "Ahead"
        },
        {
          "kr": "Reduce false positive rate to under 3%",
          "current": 4.2,
          "target": 3,
          "unit": "%",
          "progress": 71,
          "status": "At Risk"
        },
        {
          "kr": "Achieve 100% audit trail completeness",
          "current": 99.8,
          "target": 100,
          "unit": "%",
          "progress": 100,
          "status": "On Track"
        }
      ]
    },
    {
      "id": 3,
      "heading": "Customer Experience Optimization",
      "objective": "Optimize Customer Experience & Service Delivery",
      "description": "Improve customer satisfaction through faster processing and enhanced service quality",
      "owner": "Customer Experience Team",
      "quarter": "Q1 2025",
      "progress": 82,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Achieve 2-day average turnaround time",
          "current": 2.1,
          "target": 2.0,
          "unit": "days",
          "progress": 95,
          "status": "On Track"
        },
        {
          "kr": "Maintain 95%+ SLA compliance",
          "current": 92,
          "target": 95,
          "unit": "%",
          "progress": 97,
          "status": "On Track"
        },
        {
          "kr": "Reduce re-submission rate to under 5%",
          "current": 8,
          "target": 5,
          "unit": "%",
          "progress": 63,
          "status": "Behind"
        }
      ]
    }
  ]

  const okrOperationData = [
    {
      "id": 1,
      "heading": "Auto-Verification Accuracy",
      "objective": "Increase AI auto-verification accuracy across workflows",
      "description": "Enhance the precision of AI-driven auto-verification to reduce manual checks and improve operational efficiency",
      "owner": "AI Operations Team",
      "quarter": "Q1 2025",
      "progress": 97,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Increase auto-verification rate",
          "current": 87,
          "target": 90,
          "unit": "%",
          "progress": 97,
          "status": "On Track"
        }
      ]
    },
    {
      "id": 2,
      "heading": "Verification Speed Optimization",
      "objective": "Reduce average verification time for AI-assisted processes",
      "description": "Improve AI model performance and workflow efficiency to minimize the time taken for verifications",
      "owner": "AI Performance Team",
      "quarter": "Q1 2025",
      "progress": 48,
      "status": "Behind",
      "statusColor": "text-red-600 bg-red-50 border-red-200",
      "keyResults": [
        {
          "kr": "Reduce average verification time",
          "current": 4.2,
          "target": 2.0,
          "unit": "min",
          "progress": 48,
          "status": "Behind"
        }
      ]
    },
    {
      "id": 3,
      "heading": "Turnaround Time Excellence",
      "objective": "Achieve industry-standard turnaround times for processing requests",
      "description": "Streamline operational workflows to meet or exceed turnaround time targets for improved customer satisfaction",
      "owner": "Operations Efficiency Team",
      "quarter": "Q1 2025",
      "progress": 95,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Achieve target turnaround time (TAT)",
          "current": 2.1,
          "target": 2.0,
          "unit": "days",
          "progress": 95,
          "status": "On Track"
        }
      ]
    },
    {
      "id": 4,
      "heading": "Agent Latency Optimization",
      "objective": "Maintain low AI agent latency for seamless operations",
      "description": "Enhance AI processing and response mechanisms to ensure near real-time interactions with minimal delays",
      "owner": "AI Engineering Team",
      "quarter": "Q1 2025",
      "progress": 83,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Maintain optimal agent latency",
          "current": 1.8,
          "target": 1.5,
          "unit": "sec",
          "progress": 83,
          "status": "On Track"
        }
      ]
    }
  ]

  const okrCompliancesData = [
    {
      "id": 1,
      "heading": "Regulatory Compliance",
      "objective": "Maintain industry-leading regulatory compliance rates",
      "description": "Sustain near-perfect adherence to all applicable regulations and internal policies",
      "owner": "Risk & Compliance Team",
      "quarter": "Q1 2025",
      "progress": 100,
      "status": "Ahead",
      "statusColor": "text-blue-600 bg-blue-50 border-blue-200",
      "keyResults": [
        {
          "kr": "Maintain 99%+ regulatory compliance rate",
          "current": 99.2,
          "target": 99,
          "unit": "%",
          "progress": 100,
          "status": "Ahead"
        }
      ]
    },
    {
      "id": 2,
      "heading": "AML Screening Accuracy",
      "objective": "Improve AML screening precision to minimize risk and noise",
      "description": "Enhance AML models and rules to increase detection accuracy while reducing false matches",
      "owner": "Risk & Compliance Team",
      "quarter": "Q1 2025",
      "progress": 99,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Achieve ≥98% AML screening accuracy",
          "current": 97.8,
          "target": 98,
          "unit": "%",
          "progress": 99,
          "status": "On Track"
        }
      ]
    },
    {
      "id": 3,
      "heading": "KYC Completion",
      "objective": "Increase successful KYC completion across all onboarding flows",
      "description": "Optimize KYC workflows and data quality to raise completion and reduce rework",
      "owner": "Risk & Compliance Team",
      "quarter": "Q1 2025",
      "progress": 99,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Maintain ≥95% KYC completion rate",
          "current": 94.5,
          "target": 95,
          "unit": "%",
          "progress": 99,
          "status": "On Track"
        }
      ]
    },
    {
      "id": 4,
      "heading": "Risk Assessment Coverage",
      "objective": "Sustain full risk assessment coverage for in-scope entities and transactions",
      "description": "Ensure every relevant case is assessed with the appropriate risk model and controls",
      "owner": "Risk & Compliance Team",
      "quarter": "Q1 2025",
      "progress": 100,
      "status": "Ahead",
      "statusColor": "text-blue-600 bg-blue-50 border-blue-200",
      "keyResults": [
        {
          "kr": "Maintain 100% risk assessment coverage",
          "current": 100,
          "target": 100,
          "unit": "%",
          "progress": 100,
          "status": "Ahead"
        }
      ]
    },
    {
      "id": 5,
      "heading": "Audit Trail Completeness",
      "objective": "Ensure end-to-end auditability across all compliance workflows",
      "description": "Strengthen logging and traceability to support investigations and regulatory audits",
      "owner": "Risk & Compliance Team",
      "quarter": "Q1 2025",
      "progress": 100,
      "status": "On Track",
      "statusColor": "text-green-600 bg-green-50 border-green-200",
      "keyResults": [
        {
          "kr": "Achieve 100% audit trail completeness",
          "current": 99.8,
          "target": 100,
          "unit": "%",
          "progress": 100,
          "status": "On Track"
        }
      ]
    },
    {
      "id": 6,
      "heading": "False Positive Reduction",
      "objective": "Reduce false positives in compliance screening to improve efficiency",
      "description": "Tune thresholds and models to lower false positives without compromising detection",
      "owner": "Risk & Compliance Team",
      "quarter": "Q1 2025",
      "progress": 71,
      "status": "At Risk",
      "statusColor": "text-orange-600 bg-orange-50 border-orange-200",
      "keyResults": [
        {
          "kr": "Reduce false positive rate to under 3%",
          "current": 4.2,
          "target": 3,
          "unit": "%",
          "progress": 71,
          "status": "At Risk"
        }
      ]
    }
  ]


  // SWOT Analysis data
  const swotData = {
    strengths: [
      { item: "Advanced AI Automation", impact: "High", category: "Technology", description: "95% automation rate with intelligent decision-making" },
      { item: "Regulatory Compliance Excellence", impact: "High", category: "Compliance", description: "99% compliance rate exceeding industry standards" },
      { item: "Experienced Banking Team", impact: "Medium", category: "Human Capital", description: "8+ years average experience in banking operations" },
      { item: "Real-time Risk Assessment", impact: "High", category: "Technology", description: "Instant risk evaluation and flagging capabilities" },
      { item: "Integrated Platform Architecture", impact: "Medium", category: "Technology", description: "Seamless workflow integration across all modules" }
    ],
    weaknesses: [
      { item: "SLA Breach Rate", impact: "High", category: "Operations", description: "8% breach rate above industry benchmark of 5%" },
      { item: "Manual Override Dependency", impact: "Medium", category: "Operations", description: "12% of cases require manual intervention" },
      { item: "Legacy System Integration", impact: "Medium", category: "Technology", description: "Some gaps in legacy system connectivity" },
      { item: "Staff Training Requirements", impact: "Low", category: "Human Capital", description: "Ongoing need for AI system training" }
    ],
    opportunities: [
      { item: "Digital Banking Growth", impact: "High", category: "Market", description: "25% annual increase in digital banking adoption" },
      { item: "AI Enhancement Potential", impact: "High", category: "Technology", description: "Machine learning improvements and new AI capabilities" },
      { item: "Cross-selling Integration", impact: "Medium", category: "Business", description: "Opportunity to integrate with other banking products" },
      { item: "Regional GCC Expansion", impact: "Medium", category: "Market", description: "Potential to expand platform across GCC markets" },
      { item: "RegTech Advancement", impact: "Medium", category: "Technology", description: "Emerging regulatory technology solutions" }
    ],
    threats: [
      { item: "Regulatory Changes", impact: "High", category: "Compliance", description: "Evolving AML/KYC regulations requiring system updates" },
      { item: "Cybersecurity Risks", impact: "High", category: "Security", description: "Increasing sophistication of cyber threats" },
      { item: "Fintech Competition", impact: "Medium", category: "Market", description: "Agile fintech companies with innovative solutions" },
      { item: "Economic Volatility", impact: "Medium", category: "Market", description: "Economic uncertainties affecting banking sector" },
      { item: "Technology Obsolescence", impact: "Low", category: "Technology", description: "Risk of current technology becoming outdated" }
    ]
  };

  const body = useMemo(
    () => ({
      timeRange: { start: "2025-01-01", end: "2025-03-31" },
      filters: {},
    }),
    []
  );

  const kPIsData = useKPIQueries(KPIList['StrategicFitKPIs'], body)

  const OperationalKPIs = useKPIQueries(KPIList['OperationalRelevanceKPIs'], body)

  const ComplianceKPIs = useKPIQueries(KPIList['ComplianceRiskRegulatoryKPIs'], body)

  // Utils: turn a KPI into a comparable score (0-100)
  const kpiScore = (kpi) => {
    // Prefer explicit progressPct if provided (already normalized)
    if (typeof kpi.progressPct === 'number') {
      return Math.max(0, Math.min(100, kpi.progressPct));
    }
    // Fallback: compute vs target when both exist
    if (kpi.target != null && typeof kpi.value === 'number') {
      if (kpi.direction === 'lower') {
        return Math.max(0, Math.min(100, Math.round((kpi.target / kpi.value) * 100)));
      }
      // default: higher is better
      return Math.max(0, Math.min(100, Math.round((kpi.value / kpi.target) * 100)));
    }
    // Last resort: map value to 0-100 if it looks like a %
    if (kpi.unit === '%' && typeof kpi.value === 'number') {
      return Math.max(0, Math.min(100, Math.round(kpi.value)));
    }
    return 0;
  };

  const kpiLabel = (kpi) => kpi.title ?? kpi.name ?? kpi.id ?? 'KPI';


  const handleOkrClick = (okr) => {
    setSelectedOkr(okr);
    setShowOkrModal(true);
  };

  const closeOkrModal = () => {
    setShowOkrModal(false);
    setSelectedOkr(null);
  };

  const handleKpiClick = (kpi) => {
    setSelectedKpi(kpi);
    setShowKpiModal(true);
  };

  const closeKpiModal = () => {
    setShowKpiModal(false);
    setSelectedKpi(null);
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

  // Custom Analytics functions
  const handleDragStart = (e, kpi) => {
    setDraggedKPI(kpi);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedKPI && !selectedKPIs.find(kpi => kpi.id === draggedKPI.id)) {
      setSelectedKPIs([...selectedKPIs, draggedKPI]);
    }
    setDraggedKPI(null);
  };

  const removeKPI = (kpiId) => {
    setSelectedKPIs(selectedKPIs.filter(kpi => kpi.id !== kpiId));
  };

  const clearAllKPIs = () => {
    setSelectedKPIs([]);
  };

  // Normalize KPI values for radar chart (0-100 scale)
  const normalizeValue = (value, unit) => {
    switch (unit) {
      case '%':
        return Math.min(value, 100);
      case 'min':
        return Math.max(0, 100 - (value * 10)); // Lower is better
      case 'days':
        return Math.max(0, 100 - (value * 20)); // Lower is better
      case 'sec':
        return Math.max(0, 100 - (value * 20)); // Lower is better
      default:
        return Math.min(value, 100);
    }
  };

  // Generate radar chart SVG
  const generateRadarChart = () => {
    if (selectedKPIs.length === 0) return null;

    const size = 300;
    const center = size / 2;
    const radius = 120;
    const angleStep = (2 * Math.PI) / selectedKPIs.length;

    const points = selectedKPIs.map((kpi, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = normalizeValue(kpi.value, kpi.unit);
      const distance = (normalizedValue / 100) * radius;
      const x = center + Math.cos(angle) * distance;
      const y = center + Math.sin(angle) * distance;
      return { x, y, angle, kpi, normalizedValue };
    });

    const pathData = points.map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';



    return (
      <svg width={size} height={size} className="mx-auto">
        {/* Grid circles */}
        {[20, 40, 60, 80, 100].map(percent => (
          <circle
            key={percent}
            cx={center}
            cy={center}
            r={(percent / 100) * radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {points.map((point, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const endX = center + Math.cos(angle) * radius;
          const endY = center + Math.sin(angle) * radius;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {points.map((point, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelDistance = radius + 30;
          const labelX = center + Math.cos(angle) * labelDistance;
          const labelY = center + Math.sin(angle) * labelDistance;

          return (
            <text
              key={index}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {point.kpi.name}
            </text>
          );
        })}
      </svg>
    );
  };

  // Calculate insights
  const calculateInsights = () => {
    if (selectedKPIs.length === 0) return null;

    const normalizedValues = selectedKPIs.map(kpi => ({
      ...kpi,
      normalized: normalizeValue(kpi.value, kpi.unit)
    }));

    const avgPerformance = normalizedValues.reduce((sum, kpi) => sum + kpi.normalized, 0) / normalizedValues.length;
    const strongest = normalizedValues.reduce((max, kpi) => kpi.normalized > max.normalized ? kpi : max);
    const weakest = normalizedValues.reduce((min, kpi) => kpi.normalized < min.normalized ? kpi : min);

    return {
      overall: Math.round(avgPerformance),
      strongest: strongest.name,
      weakest: weakest.name,
      recommendations: avgPerformance > 80 ? "Excellent performance across selected metrics" :
        avgPerformance > 60 ? "Good performance with room for improvement" :
          "Several areas need immediate attention"
    };
  };

  const insights = calculateInsights();

  // Generate KPI Performance Heatmap Data
  const generateHeatmapData = () => {
    const categories = ['Operational', 'Automation', 'Scalability', 'Standardization', 'Compliance'];
    const timeframes = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    return categories.map(category => ({
      category,
      data: timeframes.map(week => ({
        week,
        value: Math.floor(Math.random() * 40) + 60, // Random values between 60-100
        performance: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }))
    }));
  };

  // Generate Trend Data for Line Charts
  const generateTrendData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
      automation: days.map((day, index) => ({ day, value: 75 + Math.sin(index) * 10 + Math.random() * 5 })),
      compliance: days.map((day, index) => ({ day, value: 85 + Math.cos(index) * 8 + Math.random() * 4 })),
      efficiency: days.map((day, index) => ({ day, value: 70 + Math.sin(index * 0.5) * 12 + Math.random() * 6 }))
    };
  };

  // Generate AI Agent Performance Matrix
  const generateAgentMatrix = () => {
    const agents = ['IntakeAgent', 'OCRAgent', 'KYCAgent', 'ComplianceAgent', 'RiskAgent'];
    const metrics = ['Accuracy', 'Speed', 'Reliability', 'Efficiency'];

    return agents.map(agent => ({
      agent,
      metrics: metrics.map(metric => ({
        metric,
        value: Math.floor(Math.random() * 30) + 70,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }))
    }));
  };

  const heatmapData = generateHeatmapData();
  const trendData = generateTrendData();
  const agentMatrix = generateAgentMatrix();

  // Generate SVG Line Chart
  const generateLineChart = (data, color = '#3b82f6') => {
    const width = 300;
    const height = 150;
    const padding = 20;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = data.map((d, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((d.value - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(percent => {
          const y = height - padding - (percent / 100) * (height - 2 * padding);
          return (
            <line
              key={percent}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((d, index) => {
          const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
          const y = height - padding - ((d.value - minValue) / range) * (height - 2 * padding);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {data.map((d, index) => {
          const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
          return (
            <text
              key={index}
              x={x}
              y={height - 5}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {d.day}
            </text>
          );
        })}
      </svg>
    );
  };

  // Generate Heatmap Cell Color
  const getHeatmapColor = (value) => {
    if (value >= 85) return 'bg-green-500';
    if (value >= 75) return 'bg-green-400';
    if (value >= 65) return 'bg-yellow-400';
    if (value >= 55) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const tabs = [
    { id: 'strategic', label: 'Strategic Fit ', icon: Target },
    { id: 'operational', label: 'Operational Relevance ', icon: Activity },
    { id: 'compliance', label: 'Compliance, Risk & Regulatory ', icon: Shield },
    // { id: 'swot', label: 'SWOT Analysis', icon: BarChart3 },
    // { id: 'analytics', label: 'Custom Analytics', icon: TrendingUp },
    // { id: 'visualizations', label: 'Data Visualizations', icon: PieChart }
  ];

  const renderKPICard = (kpi, change = null, isDraggable = false) => {
    const Icon = kpi.icon;
    const title = kpi.title ?? kpi.name ?? '';
    const bg = kpi.bg ?? kpi.color ?? 'bg-white';
    const textColor = kpi.color ?? 'text-gray-900';
    const progressPct = typeof kpi.progressPct === 'number' ? kpi.progressPct : 0;
    const progressColor = kpi.progressColor ?? 'bg-gray-600';
    const status = kpi.status ?? null;
    const unit = kpi.unit ?? '';
    const description = kpi.description ?? kpi.tooltip ?? '';

    return (
      <div
        key={kpi.id ?? title}
        className={`${bg} rounded-xl p-4 shadow-sm flex flex-col gap-3 ${isDraggable ? 'cursor-move hover:shadow-md transition-shadow border border-gray-200' : ''}`}
        draggable={isDraggable}
        onDragStart={isDraggable ? (e) => handleDragStart(e, kpi) : undefined}
        title={kpi.tooltip ?? undefined}
      >
        {/* KPI Header */}
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-5 h-5 ${textColor}`} />}
          <div>
            <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
              {kpi.isAI && <AIIcon size={12} className="opacity-60" />}
              {title}
              {change !== null && (
                <span className={`ml-2 text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </p>
            <p className={`text-lg font-semibold ${textColor}`}>
              {kpi.value}
              {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {'progressPct' in kpi && (
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`${progressColor} h-2`}
              style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
            />
          </div>
        )}

        {/* Status & Description */}
        {(status || description || isDraggable) && (
          <>
            {status && (
              <div className="flex justify-between items-center text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${status === 'On Track'
                    ? 'bg-green-100 text-green-700'
                    : status === 'At Risk'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                    }`}
                >
                  {status}
                </span>
                {'progressPct' in kpi && (
                  <span className="text-gray-500">{Math.round(progressPct)}%</span>
                )}
              </div>
            )}
            {description && <p className="text-xs text-gray-600">{description}</p>}
            {isDraggable && kpi.category && (
              <p className="text-xs text-gray-500">{kpi.category}</p>
            )}
          </>
        )}
      </div>
    );
  };

  const renderKPICardR = (kpi, change = null, isDraggable = false) => {
    if (!kpi) return null;
    const Icon = kpi?.icon;
    const title = kpi?.okr ?? kpi?.name ?? '';
    //kpi.StrategicOKRName
    const bg = kpi?.bg ?? kpi?.color ?? 'bg-white';
    //add bg
    const textColor = kpi?.color ?? 'text-gray-900';
    //add textColor
    const progressPct = kpi?.data?.data[0]?.pct;
    const progressColor = kpi?.progressColor ?? 'bg-gray-600';
    //add progressColor
    const status = kpi?.status ?? null;
    const progressPctunit = kpi?.unit ?? '';
    const description = kpi?.name ?? kpi?.tooltip ?? '';
    //kpi.KPI_Description
    return (
      <div
        key={kpi?.kpiId ?? title}
        className={`${bg} rounded-xl p-4 shadow-sm flex flex-col gap-3 ${isDraggable ? 'cursor-move hover:shadow-md transition-shadow border border-gray-200' : ''}`}
        draggable={isDraggable}
        onDragStart={isDraggable ? (e) => handleDragStart(e, kpi) : undefined}
        title={kpi?.tooltip ?? undefined}
      >
        {/* KPI Header */}
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-5 h-5 ${textColor}`} />}
          <div>
            <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
              {kpi?.isAI && <AIIcon size={12} className="opacity-60" />}
              {title}
              {change !== null && (
                <span className={`ml-2 text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </p>
            <p className={`text-lg font-semibold ${textColor}`}>
              {kpi?.value}
              {progressPct && <span className="text-sm text-gray-500 ml-1">{Math.round(progressPct)}%</span>}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {progressPct && (
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`${progressColor} h-2`}
              style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
            />
          </div>
        )}

        {/* Status & Description */}
        {(status || description || isDraggable) && (
          <>
            {progressPct && (
              <div className="flex justify-between items-center text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${status === 'On Track'
                    ? 'bg-green-100 text-green-700'
                    : status === 'At Risk'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                    }`}
                >
                  {status || "on Track" /* Default to "On Track" if no status */}
                </span>
                {progressPct && (
                  <span className="text-gray-500">{Math.round(progressPct)}%</span>
                )}
              </div>
            )}
            {description && <p className="text-xs text-gray-600">{description}</p>}
            {isDraggable && kpi.category && (
              <p className="text-xs text-gray-500">{kpi.category}</p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Strategic KPIs, operational metrics, and compliance analytics for personal banking workflows</p>
      </div>
{/* Account Intelligence Center */}

{/* Banking Operations Dashboard */}
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>


      {/* Tab Content */}
      {activeTab === 'strategic' && (
        <div className="space-y-6">
          {/* Strategic OKRs */}
          {/* <RoleGuard requiredRole="MANAGER" showMessage={false}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-800">Strategic OKRs (Q1 2025)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <span className="text-xs font-medium text-purple-600">{okr.heading} </span>
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
            </div>
          </RoleGuard> */}

          {/* Operational Efficiency */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* {kPIsData.isLoading && [1, 2, 3].map(item => (<div key={item} className="h-32 bg-gray-100 animate-pulse rounded-lg" />))} */}
              {kPIsData?.map(kpi => renderKPICardR(kpi.data))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <AutomatedProcessing/>
              <ProcessingSpeedRevolution/>
              <SystemReliability/>
              {/* <KYCComplaiceMaster/>
              <SanctionsCompliance/> */}
            
              </div>
          </div>
        </div>
      )}

      {activeTab === 'operational' && (
        <div className="space-y-6">
          {/* <RoleGuard requiredRole="MANAGER" showMessage={false}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-800">Strategic OKRs (Q1 2025)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {okrOperationData.map((okr) => {
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
                          <span className="text-xs font-medium text-purple-600">{okr.heading} </span>
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
            </div>
          </RoleGuard> */}
          <div>
            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Operational Relevance KPIs</h3> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* {allKPIs.operationalRelevance.map(kpi => renderKPICard(kpi))} */}
              {OperationalKPIs?.map(kpi => renderKPICardR(kpi.data))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* <RoleGuard requiredRole="MANAGER" showMessage={false}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-800">Strategic OKRs (Q1 2025)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {okrCompliancesData.map((okr) => {
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
                          <span className="text-xs font-medium text-purple-600">{okr.heading} </span>
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
            </div>
          </RoleGuard> */}
          <div>
            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Compliance, Risk & Regulatory KPIs</h3> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* {allKPIs.compliance.map(kpi => renderKPICard(kpi))} */}
              {ComplianceKPIs?.map(kpi => renderKPICardR(kpi.data))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <KYCComplaiceMaster/>
              <SanctionsCompliance/>
              </div>
          </div>
        </div>
      )}

      {activeTab === 'swot' && (
        <div className="space-y-6">
          {/* SWOT Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Strengths
              </h3>
              <div className="space-y-3">
                {swotData.strengths.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-green-800">{item.item}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-700' :
                        item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mb-1">{item.description}</p>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Weaknesses
              </h3>
              <div className="space-y-3">
                {swotData.weaknesses.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-orange-800">{item.item}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-700' :
                        item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-xs text-orange-700 mb-1">{item.description}</p>
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Opportunities
              </h3>
              <div className="space-y-3">
                {swotData.opportunities.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-blue-800">{item.item}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-700' :
                        item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mb-1">{item.description}</p>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Threats */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Threats
              </h3>
              <div className="space-y-3">
                {swotData.threats.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-red-800">{item.item}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-700' :
                        item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mb-1">{item.description}</p>
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Strategic Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Strategic Focus</h4>
                <p className="text-sm text-gray-600">Leverage advanced AI automation capabilities while addressing performance gaps in SLA compliance and manual intervention rates.</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Competitive Advantage</h4>
                <p className="text-sm text-gray-600">Combination of cutting-edge AI technology with exceptional regulatory compliance creates strong market differentiation.</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Priority Improvements</h4>
                <p className="text-sm text-gray-600">Focus on reducing manual interventions and improving SLA performance to maximize operational efficiency.</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Mitigation</h4>
                <p className="text-sm text-gray-600">Strengthen cybersecurity measures and enhance regulatory adaptation capabilities to address key threats.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Custom Analytics Dashboard</h2>
                <p className="text-sm text-gray-600 mt-1">Drag and drop KPIs to create custom radar chart visualizations</p>
              </div>
              {selectedKPIs.length > 0 && (
                <button
                  onClick={clearAllKPIs}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* KPI Library */}
              <div className="lg:col-span-1">
                <h3 className="text-sm font-medium text-gray-700 mb-4">KPI Library</h3>
                <div className="space-y-4">
                  {Object.entries(allKPIs).map(([category, kpis]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="space-y-2">
                        {kpis.map(kpi => renderKPICard(kpi, null, true))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart Area */}
              <div className="lg:col-span-3">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 min-h-[420px] flex flex-col"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {/* Header + quick stats */}
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Custom KPI Radar</h3>
                      <p className="text-xs text-gray-500">
                        KPIs normalized to progress vs target. “Lower-is-better” metrics are auto-inverted.
                      </p>
                    </div>

                    {/* Aggregate snapshot (uses available fields only) */}
                    {selectedKPIs.length > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Avg Progress:{' '}
                          <span className="font-medium text-gray-700">
                            {
                              (() => {
                                const nums = selectedKPIs.map(k => {
                                  const hasPct = typeof k.progressPct === 'number';
                                  if (hasPct) return Math.max(0, Math.min(100, k.progressPct));
                                  if (k.target != null && typeof k.value === 'number') {
                                    const raw = k.direction === 'lower'
                                      ? (k.target / k.value) * 100
                                      : (k.value / k.target) * 100;
                                    return Math.max(0, Math.min(100, Math.round(raw)));
                                  }
                                  if (k.unit === '%' && typeof k.value === 'number') return Math.max(0, Math.min(100, Math.round(k.value)));
                                  return 0;
                                });
                                const avg = nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
                                return `${Math.round(avg)}%`;
                              })()
                            }
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          At Risk:{' '}
                          <span className="font-medium text-gray-700">
                            {selectedKPIs.filter(k => k.status === 'At Risk').length}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selected KPI chips */}
                  {selectedKPIs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {selectedKPIs.map(k => (
                        <span
                          key={k.id}
                          className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-gray-200 bg-white"
                          title={k.description ?? k.tooltip}
                        >
                          <span
                            className={`px-1.5 py-0.5 rounded ${k.status === 'On Track'
                              ? 'bg-green-100 text-green-700'
                              : k.status === 'At Risk'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {k.status ?? '—'}
                          </span>
                          <span className="text-gray-700">{k.title ?? k.name ?? k.id}</span>
                          <span className="text-gray-500">
                            {k.value}{k.unit ?? ''}
                            {k.target != null && (
                              <span className="ml-1">/ <span className="text-gray-700">{k.target}{k.unit ?? ''}</span></span>
                            )}
                          </span>
                          <button
                            onClick={() => removeKPI(k.id)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Remove KPI"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="ml-auto text-xs text-gray-500">
                        Target ring in radar represents <b>100%</b> of goal
                      </span>
                    </div>
                  )}

                  {/* Chart / Empty state */}
                  <div className="flex-1 flex items-center justify-center">
                    {selectedKPIs.length === 0 ? (
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-base font-medium text-gray-600 mb-1">Create Your Custom Analytics</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Drag KPIs from the left panel to compare progress vs target on a radar chart
                        </p>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>• Mix “higher is better” and “lower is better” metrics</p>
                          <p>• Hover points in the radar for raw value & target</p>
                          <p>• Remove a KPI using the chip controls above the chart</p>
                        </div>
                      </div>
                    ) : (
                      <KPIRadarChart selectedKPIs={selectedKPIs} removeKPI={removeKPI} insights={insights} />
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'visualizations' && (
        <div className="space-y-6">
          {/* Performance Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Grid3X3 className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">KPI Performance Heatmap</h2>
              <span className="text-sm text-gray-500 ml-2">Weekly Performance Matrix</span>
            </div>

            <HeatmapECharts heatmapData={heatmapData} />

          </div>

          {/* Trend Analysis Charts */}
          <TrendPanels trendData={trendData} />
          {/* AI Agent Performance Matrix */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AIIcon size={18} className="text-gray-500" />
                AI Agent Performance Matrix
              </h2>
              <span className="text-sm text-gray-500 ml-2">Multi-dimensional Performance View</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Agent</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Accuracy</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Speed</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Reliability</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Efficiency</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {agentMatrix.map((agent, index) => {
                    const overall = Math.round(agent.metrics.reduce((sum, m) => sum + m.value, 0) / agent.metrics.length);
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                              <AIIcon size={12} className="text-gray-600" />
                              {agent.agent}
                            </span>
                          </div>
                        </td>
                        {agent.metrics.map((metric, metricIndex) => (
                          <td key={metricIndex} className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className={`text-sm font-medium ${metric.value >= 85 ? 'text-green-600' :
                                metric.value >= 75 ? 'text-blue-600' :
                                  metric.value >= 65 ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                {metric.value}%
                              </span>
                              {metric.trend === 'up' ? (
                                <TrendingUpIcon className="w-3 h-3 text-green-500" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          <span className={`text-sm font-bold px-2 py-1 rounded-full ${overall >= 85 ? 'bg-green-100 text-green-800' :
                            overall >= 75 ? 'bg-blue-100 text-blue-800' :
                              overall >= 65 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {overall}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* KPI Distribution Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <RiskDistribution />

            {/* Application Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Application Status</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Completed</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">In Progress</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/5 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Pending</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/20 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">5%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">156</div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUpIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">Performance Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">↗ 12%</div>
                <div className="text-sm text-gray-600">Automation Improvement</div>
                <div className="text-xs text-gray-500 mt-1">vs. last month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2.1 days</div>
                <div className="text-sm text-gray-600">Avg. Processing Time</div>
                <div className="text-xs text-gray-500 mt-1">15% faster than target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">94.5%</div>
                <div className="text-sm text-gray-600">Overall Efficiency</div>
                <div className="text-xs text-gray-500 mt-1">Above industry benchmark</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Detail Modal */}
      {showKpiModal && selectedKpi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {selectedKpi.icon && React.createElement(selectedKpi.icon, { className: "w-6 h-6 text-purple-600" })}
                <h3 className="text-lg font-semibold text-gray-800">KPI Details</h3>
              </div>
              <button
                onClick={closeKpiModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* KPI Overview */}
            <div className={`${selectedKpi.bg} rounded-lg p-4 mb-6 border border-gray-200`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{selectedKpi.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedKpi.description || 'Key performance indicator for operational monitoring'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${selectedKpi.color}`}>{selectedKpi.value}</p>
                  <p className="text-sm text-gray-600">{selectedKpi.trend || 'Current Value'}</p>
                </div>
              </div>
            </div>

            {/* KPI Breakdown */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-4">Performance Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Current Period</span>
                  <span className="text-sm font-medium text-gray-800">{selectedKpi.value}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Previous Period</span>
                  <span className="text-sm text-gray-600">{selectedKpi.previousValue || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Target</span>
                  <span className="text-sm text-gray-600">{selectedKpi.target || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Variance</span>
                  <span className={`text-sm font-medium ${selectedKpi.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedKpi.variance || '+5.2%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-3">Trend Analysis</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• Performance has been {selectedKpi.trendDirection || 'improving'} over the last 30 days</p>
                  <p>• {selectedKpi.insight || 'Automated processes contributing to efficiency gains'}</p>
                  <p>• {selectedKpi.recommendation || 'Continue monitoring for sustained performance'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                View Detailed Report
              </button>
              <button className="flex-1 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                Export Data
              </button>
              <button
                onClick={closeKpiModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
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
                <h3 className="text-lg font-semibold text-gray-800">Strategic OKR Details</h3>
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

export default Dashboard;