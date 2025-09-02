import React, { useState } from 'react';
import { Settings, ChevronDown, Bot, TrendingUp, GitBranch, Sliders, X, BarChart3, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RoleGuard from './RoleGuard';
import AIIcon from './AIIcon';

const SettingsDropdown = () => {
  const { hasPermission, hasMinimumRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const handleMenuClick = (item) => {
    setActiveModal(item);
    setIsOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const agentConfigs = [
    {
      name: 'IntakeAgent',
      domain: 'New Applications',
      enabled: true,
      mode: 'Real-time',
      threshold: 85
    },
    {
      name: 'OCRAgent',
      domain: 'Document Processing',
      enabled: true,
      mode: 'Real-time',
      threshold: 90
    },
    {
      name: 'KYCCheckerAgent',
      domain: 'Risk Screening',
      enabled: true,
      mode: 'Batch',
      threshold: 75
    },
    {
      name: 'ComplianceAgent',
      domain: 'Compliance Check',
      enabled: true,
      mode: 'Real-time',
      threshold: 95
    },
    {
      name: 'RiskFlagAgent',
      domain: 'Risk Assessment',
      enabled: false,
      mode: 'Batch',
      threshold: 80
    }
  ];

  const roiData = [
    {
      agent: 'IntakeAgent',
      purpose: 'Application initialization',
      slaImprovement: '45%',
      timeSaved: '120 hrs/month',
      roi: '340%',
      roiColor: 'text-green-600'
    },
    {
      agent: 'OCRAgent',
      purpose: 'Document extraction',
      slaImprovement: '67%',
      timeSaved: '200 hrs/month',
      roi: '520%',
      roiColor: 'text-green-600'
    },
    {
      agent: 'KYCCheckerAgent',
      purpose: 'Risk screening automation',
      slaImprovement: '38%',
      timeSaved: '85 hrs/month',
      roi: '280%',
      roiColor: 'text-green-600'
    },
    {
      agent: 'ComplianceAgent',
      purpose: 'Regulatory compliance',
      slaImprovement: '52%',
      timeSaved: '150 hrs/month',
      roi: '410%',
      roiColor: 'text-green-600'
    },
    {
      agent: 'RiskFlagAgent',
      purpose: 'Risk pattern detection',
      slaImprovement: '23%',
      timeSaved: '45 hrs/month',
      roi: '180%',
      roiColor: 'text-blue-600'
    }
  ];

  const ontologyData = [
    {
      entity: 'Application',
      type: 'Core Entity',
      relationships: ['triggers Risk Assessment', 'contains KYC Documents', 'assigned to Officer'],
      children: ['Personal Banking App', 'Corporate Banking App', 'Credit Card App']
    },
    {
      entity: 'Client',
      type: 'Core Entity',
      relationships: ['has KYC Document', 'undergoes Risk Screening', 'assigned Risk Tier'],
      children: ['Individual Client', 'Corporate Client', 'SME Client']
    },
    {
      entity: 'KYC Document',
      type: 'Supporting Entity',
      relationships: ['belongs to Client', 'processed by OCRAgent', 'validates Identity'],
      children: ['Emirates ID', 'Passport', 'Visa', 'Trade License']
    },
    {
      entity: 'Risk Assessment',
      type: 'Process Entity',
      relationships: ['evaluates Client', 'generates Risk Tier', 'triggers Compliance Check'],
      children: ['PEP Screening', 'Sanctions Check', 'Fraud Detection']
    }
  ];

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <ChevronDown className="w-3 h-3 text-gray-600" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg w-64 text-sm p-4 z-50">
            <ul className="space-y-2">
              <RoleGuard requiredRole="EXECUTIVE" showMessage={false}>
                <li>
                  <button
                    onClick={() => handleMenuClick('agent-config')}
                    className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <AIIcon size={16} className="text-gray-500" />
                    <span className="text-gray-700">Agent Configuration</span>
                  </button>
                </li>
              </RoleGuard>
              <RoleGuard requiredRole="MANAGER" showMessage={false}>
                <li>
                  <button
                    onClick={() => handleMenuClick('roi-dashboard')}
                    className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Agent ROI Dashboard</span>
                  </button>
                </li>
              </RoleGuard>
              <RoleGuard requiredRole="SPECIALIST" showMessage={false}>
                <li>
                  <button
                    onClick={() => handleMenuClick('ontology')}
                    className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <GitBranch className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Ontology Viewer</span>
                  </button>
                </li>
              </RoleGuard>
              <RoleGuard requiredRole="MANAGER" showMessage={false}>
                <li>
                  <button
                    onClick={() => handleMenuClick('system-settings')}
                    className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">System Settings</span>
                  </button>
                </li>
              </RoleGuard>
            </ul>
          </div>
        )}
      </div>

      {/* Agent Configuration Modal */}
      {activeModal === 'agent-config' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AIIcon size={18} className="text-gray-600" />
                Agent Configuration
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {agentConfigs.map((agent, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <AIIcon size={14} className="text-gray-600" />
                        {agent.name}
                      </h4>
                      <p className="text-xs text-gray-600">{agent.domain}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Enabled</span>
                      <div className={`w-10 h-5 rounded-full p-1 transition-colors ${agent.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${agent.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Execution Mode</label>
                      <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="real-time" selected={agent.mode === 'Real-time'}>Real-time</option>
                        <option value="batch" selected={agent.mode === 'Batch'}>Batch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Confidence Threshold: {agent.threshold}%</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={agent.threshold}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Save Configuration
              </button>
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROI Dashboard Modal */}
      {activeModal === 'roi-dashboard' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Agent ROI Dashboard</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SLA Improvement
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Saved
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roiData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <AIIcon size={16} className="text-blue-600" />
                          <span className="text-sm font-medium text-gray-800">{item.agent}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{item.purpose}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">{item.slaImprovement}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{item.timeSaved}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${item.roiColor}`}>{item.roi}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total ROI</span>
                </div>
                <p className="text-lg font-semibold text-blue-600">346%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Time Saved</span>
                </div>
                <p className="text-lg font-semibold text-green-600">600 hrs/month</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Cost Savings</span>
                </div>
                <p className="text-lg font-semibold text-purple-600">AED 45K/month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ontology Viewer Modal */}
      {activeModal === 'ontology' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Platform Ontology Viewer</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {ontologyData.map((entity, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">{entity.entity}</h4>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                        {entity.type}
                      </span>
                    </div>
                    <GitBranch className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Relationships:</p>
                    <div className="flex flex-wrap gap-1">
                      {entity.relationships.map((rel, relIndex) => (
                        <span key={relIndex} className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded border">
                          {rel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-2">Child Entities:</p>
                    <div className="flex flex-wrap gap-1">
                      {entity.children.map((child, childIndex) => (
                        <span key={childIndex} className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          {child}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Settings Modal */}
      {activeModal === 'system-settings' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Auto-Escalation Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Enable Auto-Escalation</p>
                  <p className="text-xs text-gray-600">Automatically escalate applications approaching SLA breach</p>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full p-1">
                  <div className="w-3 h-3 bg-white rounded-full translate-x-5 transition-transform"></div>
                </div>
              </div>

              {/* AI Suggestions Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Enable AI Suggestions</p>
                  <p className="text-xs text-gray-600">Show AI-generated recommendations in workflows</p>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full p-1">
                  <div className="w-3 h-3 bg-white rounded-full translate-x-5 transition-transform"></div>
                </div>
              </div>

              {/* SLA Threshold Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">SLA Warning Threshold: 80%</label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value="80"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Role Revalidation Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Role Revalidation Frequency</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="weekly">Weekly</option>
                  <option value="monthly" selected>Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              {/* Notification Settings */}
              <div>
                <p className="text-sm font-medium text-gray-800 mb-3">Notification Preferences</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">SLA Breach Alerts</span>
                    <div className="w-10 h-5 bg-blue-600 rounded-full p-1">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-5 transition-transform"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Agent Error Notifications</span>
                    <div className="w-10 h-5 bg-gray-300 rounded-full p-1">
                      <div className="w-3 h-3 bg-white rounded-full transition-transform"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Daily Summary Reports</span>
                    <div className="w-10 h-5 bg-blue-600 rounded-full p-1">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-5 transition-transform"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Save Settings
              </button>
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* RBAC Access Levels Reference */}
      {/* 🔴 EXECUTIVE: Access all settings, edit agents and thresholds */}
      {/* 🟡 MANAGER: Access ROI, toggles, team-level settings */}
      {/* 🟢 SPECIALIST: View ontology and AI agent logs */}
      {/* 🔵 OPERATOR: No access to Settings */}
      {/* ⚪ SUPPORT: View-only if permitted */}
    </>
  );
};

export default SettingsDropdown;