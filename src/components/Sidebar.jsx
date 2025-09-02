import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Building2, CreditCard, Banknote, TrendingUp, Smartphone, ArrowRightLeft, FileCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ currentPage }) => {
  const { user, hasPermission, hasMinimumRole } = useAuth();
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemClick = (sectionId, item) => {
    // Map menu items to routes
    const routeMap = {
      'Dashboard': '/dashboard',
      'New Application': `/${sectionId}/new-application`,
      'KYC & Risk Screening': '/personal-banking/kyc-risk-screening',
      'Application Status': '/personal-banking/application-status',
      'Compliance Check': '/personal-banking/compliance-check',
      'Final Decision Log': '/personal-banking/decision-log',
      'Agent Console':'/personal-banking/agent-log',
      'Ownership Verification': '/corporate-banking/ownership-verification',
      'KYC & AML': '/corporate-banking/kyc-aml',
      'Risk Assessment': '/corporate-banking/risk-assessment',
      'Status & Escalations': '/corporate-banking/status-escalations',
      'Credit Scoring': '/credit-cards/credit-scoring',
      'Issuance Tracker': '/credit-cards/issuance-tracker',
      'DBR & Income Review': '/loans/dbr-income-review',
      'Risk Scorecard': '/loans/risk-scorecard',
      'Legal Document Check': '/loans/legal-document-check',
      'Final Approval': '/loans/final-approval',
      'Risk Appetite': '/wealth/risk-appetite',
      'Product Suitability': '/wealth/product-suitability',
      'Portfolio Tracker': '/wealth/portfolio-tracker',
      'Mobile App Activation': '/mobile-banking/mobile-app-activation',
      'Customer ID Verification': '/mobile-banking/customer-id-verification',
      'Bank Transfer Setup': '/salary-transfer/bank-transfer-setup',
      'Regulatory Screening': '/trade-finance/regulatory-screening',
      'Issuance & Status': '/trade-finance/issuance-status'
    };

    let route = routeMap[item];
    
    // Handle generic routes for sections
    if (!route && item === 'New Application') {
      route = `/${sectionId}/new-application`;
    }
    
    if (route) {
      navigate(route);
    }
  };

  // Role-based screen filtering
  const getFilteredItems = (items, sectionId) => {
    return items.filter(item => {
      // Executive can see everything
      if (hasMinimumRole('EXECUTIVE')) return true;
      
      // Manager access
      if (hasMinimumRole('MANAGER')) {
        // Managers can see most screens except some executive-only ones
        if (item === 'Audit Trail') return hasPermission('view_audit_complete');
        return true;
      }
      
      // Specialist access
      if (hasMinimumRole('SPECIALIST')) {
        // Specialists can see review and screening screens
        const specialistScreens = [
          'KYC & Risk Screening',
          'Application Status', 
          'Compliance Check',
          'Risk Assessment',
          'Credit Scoring',
          'DBR & Income Review',
          'Risk Scorecard',
          'Risk Appetite',
          'Product Suitability'
        ];
        return specialistScreens.includes(item);
      }
      
      // Operator access
      if (hasMinimumRole('OPERATOR')) {
        // Operators can see application management and document screens
        const operatorScreens = [
          'New Application',
          'Application Status',
          'Ownership Verification',
          'Issuance Tracker',
          'Legal Document Check',
          'Portfolio Tracker',
          'Mobile App Activation',
          'Customer ID Verification',
          'Bank Transfer Setup',
          'Issuance & Status'
        ];
        return operatorScreens.includes(item);
      }
      
      // Support access (most limited)
      if (user?.role === 'SUPPORT') {
        // Support can only see basic application and status screens
        const supportScreens = [
          'New Application',
          'Application Status',
          'Customer ID Verification'
        ];
        return supportScreens.includes(item);
      }
      
      return false;
    });
  };

  // Filter sections based on role
  const getFilteredSections = () => {
    return menuSections.filter(section => {
      const filteredItems = getFilteredItems(section.items, section.id);
      return filteredItems.length > 0; // Only show sections that have accessible items
    }).map(section => ({
      ...section,
      items: getFilteredItems(section.items, section.id)
    }));
  };
  const menuSections = [
    {
      id: 'personal-banking',
      title: 'Personal Account Opening',
      icon: Building2,
      items: [
        'Dashboard',
        'New Application',
        'KYC & Risk Screening', 
        'Application Status',
        'Compliance Check',
        'Final Decision Log',
        'Agent Console'
      ]
    },
    // {
    //   id: 'corporate-banking',
    //   title: 'Corporate Account Opening',
    //   icon: Building2,
    //   items: [
    //     'New Application',
    //     'Ownership Verification',
    //     'KYC & AML',
    //     'Risk Assessment', 
    //     'Status & Escalations'
    //   ]
    // },
    // {
    //   id: 'credit-cards',
    //   title: 'Credit Card Applications',
    //   icon: CreditCard,
    //   items: [
    //     'New Application',
    //     'Credit Scoring',
    //     'Compliance Check',
    //     'Issuance Tracker'
    //   ]
    // },
    // {
    //   id: 'loans',
    //   title: 'Loan Applications',
    //   icon: Banknote,
    //   items: [
    //     'New Application',
    //     'DBR & Income Review',
    //     'Risk Scorecard',
    //     'Legal Document Check',
    //     'Final Approval'
    //   ]
    // },
    // {
    //   id: 'wealth',
    //   title: 'Investment Products',
    //   icon: TrendingUp,
    //   items: [
    //     'New Application',
    //     'Risk Appetite',
    //     'Product Suitability',
    //     'Portfolio Tracker'
    //   ]
    // },
    // {
    //   id: 'digital-wallet',
    //   title: 'Mobile Banking',
    //   icon: Smartphone,
    //   items: [
    //     'New Application',
    //     'Mobile App Activation',
    //     'Customer ID Verification'
    //   ]
    // },
    // {
    //   id: 'salary-transfer',
    //   title: 'Salary Transfer Requests',
    //   icon: ArrowRightLeft,
    //   items: [
    //     'New Application',
    //     'Bank Transfer Setup'
    //   ]
    // },
    // {
    //   id: 'trade-finance',
    //   title: 'Trade Finance / LC',
    //   icon: FileCheck,
    //   items: [
    //     'New Application',
    //     'Regulatory Screening',
    //     'Issuance & Status'
    //   ]
    // }
  ];

  const filteredSections = getFilteredSections();

  // Check if current route matches menu item
  const isCurrentPage = (sectionId, item) => {
    const routeMap = {
      'Dashboard': '/dashboard',
      'New Application': `/${sectionId}/new-application`,
      'KYC & Risk Screening': '/personal-banking/kyc-risk-screening',
      'Application Status': '/personal-banking/application-status',
      'Compliance Check': '/personal-banking/compliance-check',
      'Final Decision Log': '/personal-banking/decision-log',
      'Agent Console':'/personal-banking/agent-log',
      'Ownership Verification': '/corporate-banking/ownership-verification',
      'KYC & AML': '/corporate-banking/kyc-aml',
      'Risk Assessment': '/corporate-banking/risk-assessment',
      'Status & Escalations': '/corporate-banking/status-escalations',
      'Credit Scoring': '/credit-cards/credit-scoring',
      'Issuance Tracker': '/credit-cards/issuance-tracker',
      'DBR & Income Review': '/loans/dbr-income-review',
      'Risk Scorecard': '/loans/risk-scorecard',
      'Legal Document Check': '/loans/legal-document-check',
      'Final Approval': '/loans/final-approval',
      'Risk Appetite': '/wealth/risk-appetite',
      'Product Suitability': '/wealth/product-suitability',
      'Portfolio Tracker': '/wealth/portfolio-tracker',
      'Mobile App Activation': '/mobile-banking/mobile-app-activation',
      'Customer ID Verification': '/mobile-banking/customer-id-verification',
      'Bank Transfer Setup': '/salary-transfer/bank-transfer-setup',
      'Regulatory Screening': '/trade-finance/regulatory-screening',
      'Issuance & Status': '/trade-finance/issuance-status'
    };

    let route = routeMap[item];
    if (!route && item === 'New Application') {
      route = `/${sectionId}/new-application`;
    }
    
    return location.pathname === route;
  };

  return (
    <div className="w-64 bg-blue-950 text-white h-screen fixed left-0 top-0 overflow-y-auto no-scroll">
      {/* FAB Logo/Title */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-300" />
          <div>
            <h1 className="text-lg font-bold">FAB</h1>
            <p className="text-xs text-blue-300">Operational Platform</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{user?.avatar}</span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-blue-300">{user?.roleInfo?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2">
        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.id];
          
          return (
            <div key={section.id} className="mb-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-1 rounded-lg hover:bg-blue-900 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* <Icon className="w-5 h-5 text-blue-300" /> */}
                  <span className="text-sm font-medium">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-blue-300" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-blue-300" />
                )}
              </button>
              
              {/* Collapsible Content */}
              <div className={`transition-all duration-300 overflow-hidden ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="ml-8 mt-2 space-y-1">
                  {section.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleItemClick(section.id, item)}
                      className={`w-full text-left p-2 text-sm rounded transition-all duration-200 ${
                        isCurrentPage(section.id, item)
                          ? 'text-white bg-blue-800 font-medium' 
                          : 'text-blue-200 hover:text-white hover:bg-blue-900'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Role Access Indicator */}
      <div className="p-4 border-t border-blue-800">
        <div className="text-xs text-blue-300">
          <p className="mb-1">Access Level:</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${user?.roleInfo?.color}`}>
            {user?.roleInfo?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;