import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatbotAssistant from './ChatbotAssistant';
import RightDrawer from './RightDrawer';

const Layout = ({ children }) => {
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const location = useLocation();

  // Generate page title and breadcrumbs from URL
  const getPageInfo = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (path === '/dashboard') {
      return {
        currentPage: 'Dashboard',
        breadcrumbs: ['FAB Home', 'Dashboard']
      };
    }

    // Map URL segments to readable names
    const segmentMap = {
      'personal-banking': 'Personal Account Opening',
      'corporate-banking': 'Corporate Account Opening',
      'credit-cards': 'Credit Card Applications',
      'loans': 'Loan Applications',
      'wealth': 'Investment Products',
      'mobile-banking': 'Mobile Banking',
      'salary-transfer': 'Salary Transfer Requests',
      'trade-finance': 'Trade Finance / LC',
      'new-application': 'New Application',
      'kyc-risk-screening': 'KYC & Risk Screening',
      'application-status': 'Application Status',
      'compliance-check': 'Compliance Check',
      'decision-log': 'Decision log',
      'agent-log':"Agent log",
      'ownership-verification': 'Ownership Verification',
      'kyc-aml': 'KYC & AML',
      'risk-assessment': 'Risk Assessment',
      'status-escalations': 'Status & Escalations',
      'credit-scoring': 'Credit Scoring',
      'issuance-tracker': 'Issuance Tracker',
      'dbr-income-review': 'DBR & Income Review',
      'risk-scorecard': 'Risk Scorecard',
      'legal-document-check': 'Legal Document Check',
      'final-approval': 'Final Approval',
      'risk-appetite': 'Risk Appetite',
      'product-suitability': 'Product Suitability',
      'portfolio-tracker': 'Portfolio Tracker',
      'mobile-app-activation': 'Mobile App Activation',
      'customer-id-verification': 'Customer ID Verification',
      'bank-transfer-setup': 'Bank Transfer Setup',
      'regulatory-screening': 'Regulatory Screening',
      'issuance-status': 'Issuance & Status'
    };

    const breadcrumbs = ['FAB Home'];
    let currentPage = 'Dashboard';

    if (segments.length >= 1) {
      const section = segmentMap[segments[0]] || segments[0];
      breadcrumbs.push(section);
    }

    if (segments.length >= 2) {
      currentPage = segmentMap[segments[1]] || segments[1];
      breadcrumbs.push(currentPage);
    }

    return { currentPage, breadcrumbs };
  };

  const { currentPage, breadcrumbs } = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Fixed Sidebar */}
      <Sidebar currentPage={currentPage} />
      
      {/* Fixed Header */}
      <Header 
        currentPage={currentPage}
        breadcrumbs={breadcrumbs}
        onToggleDrawer={() => setShowRightDrawer(!showRightDrawer)}
      />
      
      {/* Main Content Area */}
      <main className="ml-64 mt-20 p-6 w-[calc(100vw-18rem)]">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </main>
      
      {/* Optional Right Drawer */}
      {showRightDrawer && (
        <RightDrawer onClose={() => setShowRightDrawer(false)} />
      )}
      
      {/* FAB Chatbot Assistant */}
      <ChatbotAssistant 
        isOpen={showChatbot}
        onToggle={() => setShowChatbot(!showChatbot)}
      />
    </div>
  );
};

export default Layout;