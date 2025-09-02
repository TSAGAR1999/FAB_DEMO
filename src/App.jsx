import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewApplication from './pages/NewApplication';
import KYCRiskScreening from './pages/KYCRiskScreening';
import ApplicationStatus from './pages/ApplicationStatus';
import ComplianceCheck from './pages/ComplianceCheck';
import AuditTrail from './pages/AuditTrail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import  StepperForm  from './components/StepperForm/StepperForm';
import  PerfectFit  from './components/StepperForm/Perfectfit';
import AccountCards from './components/StepperForm/AccountCards';
import OPTVerification from './components/StepperForm/OTPVerification';
import FABServices from './components/StepperForm/FABServices.jsx';
import VerifyEmail from './components/StepperForm/VerifyEmail.jsx';
import EmploymentDetailsForm from './components/StepperForm/EmploymentDetailsForm.jsx';
import KYCCompletion from './components/StepperForm/KYCCompletion.jsx';
import PersonalDetails from './components/StepperForm/PersonalDetails.jsx';
import AddressForm from './components/StepperForm/AddressForm.jsx';
import TaxDeclaration from './components/StepperForm/TaxDeclaration.jsx';
import AgentLog from './pages/AgentLog.jsx';


const queryClient = new QueryClient()


const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Navigate to="/dashboard" replace />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/personal-banking/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/personal-banking/kyc-risk-screening" element={
        <ProtectedRoute>
          <Layout>
            <KYCRiskScreening />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/personal-banking/application-status" element={
        <ProtectedRoute>
          <Layout>
            <ApplicationStatus />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/personal-banking/compliance-check" element={
        <ProtectedRoute>
          <Layout>
            <ComplianceCheck />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/personal-banking/decision-log" element={
        <ProtectedRoute>
          <Layout>
            <AuditTrail />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/personal-banking/agent-log" element={
        <ProtectedRoute>
          <Layout>
            <AgentLog />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/corporate-banking/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/corporate-banking/ownership-verification" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Ownership Verification</h2>
              <p className="text-gray-600">Corporate ownership verification module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/corporate-banking/kyc-aml" element={
        <ProtectedRoute>
          <Layout>
            <KYCRiskScreening />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/corporate-banking/risk-assessment" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Risk Assessment</h2>
              <p className="text-gray-600">Corporate risk assessment module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/corporate-banking/status-escalations" element={
        <ProtectedRoute>
          <Layout>
            <ApplicationStatus />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/credit-cards/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/credit-cards/credit-scoring" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Credit Scoring</h2>
              <p className="text-gray-600">Credit scoring and assessment module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/credit-cards/compliance-check" element={
        <ProtectedRoute>
          <Layout>
            <ComplianceCheck />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/credit-cards/issuance-tracker" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Issuance Tracker</h2>
              <p className="text-gray-600">Credit card issuance tracking module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/loans/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/loans/dbr-income-review" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">DBR & Income Review</h2>
              <p className="text-gray-600">Debt-to-income ratio and income verification module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/loans/risk-scorecard" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Risk Scorecard</h2>
              <p className="text-gray-600">Loan risk assessment scorecard</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/loans/legal-document-check" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Legal Document Check</h2>
              <p className="text-gray-600">Legal documentation verification module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/loans/final-approval" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Final Approval</h2>
              <p className="text-gray-600">Loan final approval module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/wealth/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/wealth/risk-appetite" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Risk Appetite</h2>
              <p className="text-gray-600">Investment risk appetite assessment</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/wealth/product-suitability" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Suitability</h2>
              <p className="text-gray-600">Investment product suitability assessment</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/wealth/portfolio-tracker" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Tracker</h2>
              <p className="text-gray-600">Investment portfolio tracking module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/mobile-banking/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/mobile-banking/mobile-app-activation" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Mobile App Activation</h2>
              <p className="text-gray-600">Mobile banking app activation module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/mobile-banking/customer-id-verification" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Customer ID Verification</h2>
              <p className="text-gray-600">Customer identity verification module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/salary-transfer/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/salary-transfer/bank-transfer-setup" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Bank Transfer Setup</h2>
              <p className="text-gray-600">Salary transfer setup module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/trade-finance/new-application" element={
        <ProtectedRoute>
          <Layout>
            <NewApplication />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/trade-finance/regulatory-screening" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Regulatory Screening</h2>
              <p className="text-gray-600">Trade finance regulatory screening module</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/trade-finance/issuance-status" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Issuance & Status</h2>
              <p className="text-gray-600">Letter of credit issuance and status tracking</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/forms" element={
        <ProtectedRoute>
          <StepperForm/>
        </ProtectedRoute>
      } />
      <Route path="/fab-services" element={
        <FABServices/>
      } />
       <Route path="/account-fit" element={
        <PerfectFit/>
      } />
      <Route path="/accounts-list" element={
        <AccountCards/>
      } />
      <Route path="/verify-email" element={
        <VerifyEmail/>
      } />
       <Route path="/verify-otp" element={
        <OPTVerification/>
      } />
      <Route path="/employment-details" element={
        <EmploymentDetailsForm/>
      } />
      <Route path="/complete-kyc" element={
        <KYCCompletion/>
      } />
       <Route path="/personal-details" element={
        <PersonalDetails/>
      } />
       <Route path="/address-form" element={
        <AddressForm/>
      } />
      <Route path="/tax-declaration" element={
        <TaxDeclaration/>
      } />
      <Route path="*" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
              <p className="text-gray-600">The requested page could not be found.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen />

    </QueryClientProvider>
  );
}

export default App;