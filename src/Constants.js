import { BadgeCheck, Bell, CheckCircle, ClipboardList, Clock, FileText, Gauge, Rocket, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp, Triangle, Users } from "lucide-react"

export const SchemaId = {
  newApplicationTable: '6883712129961d7e05e7d628',
  applicationStatusTable: '68837b6329961d7e05e7d652',
  kycRiskScreeningTable: '6883773129961d7e05e7d62d',
  AuditTrailsTable: '688c682cb96e37785768eed6',
  CustomerProfile: "6899eeb2e9c2d32956987b9d",
  PersonalBankAccountApplication: "6899ed16e9c2d32956987b9c",
  MasterSchema: "68a5c4fd4e7cc90774f5dafb",
  FinalDecisionLog :"689b1ed4e9c2d3295698807d",
  CustomerProfileother:"68b05d844e7cc90774f5db85",
  AgentConsole:"68b59458449b0c059a42ade8"
}

export const teams = [
  "Alpha Support Team",
  "Bravo Banking Desk",
  "Capital Care Group",
  "Delta Service Crew",
  "Echo Response Unit",
  "Finance Helpdesk"
]

export const newaccountFormConfig = {
  "AccountInfo": [
    // ACCOUNT INFO
    { name: "accountTitle", label: "Account Title", type: "text", placeholder: "Enter account title", required: true },
    {
      name: "account_Type",
      label: "Account Type",
      type: "select",
      placeholder: "Select Account Type",
      required: true,
      options: [
        "Saving",
        "Current"
      ],
    },
    { name: "etihadGuestNo", label: "Etihad Guest No", type: "number", placeholder: "Enter Etihad Guest No" },
    { name: "etihadGuestStatus", label: "Etihad Guest Status", type: "text", placeholder: "Enter status" },

    // ACCOUNT NATURE (radio)
    {
      name: "accountNature",
      label: "Account Nature",
      type: "radio",
      required: true,
      options: ["Individual", "Joint", "Minor", "Others"],
    },

    // ACCOUNT CURRENCY (radio)
    {
      name: "accountCurrency",
      label: "Account Currency",
      type: "radio",
      required: true,
      options: ["AED", "USD", "Others"],
    },

    // CHECKBOXES
    { name: "chequeBook", label: "Cheque Book", type: "checkbox" },
    { name: "debitCard", label: "Debit Card", type: "checkbox" }
  ],
  "ApplicationDetails": [
    { name: "nameOfAnyOtherAccountWithFirstAbuDhabiBank", label: "Name of any other account with First Abu Dhabi Bank", type: "text", placeholder: "Enter account" },
    { name: "accountNo", label: "Account Number", type: "text", placeholder: "Enter account number" },
    { name: "nameAsItShouldAppearOnCard", label: "Name as it should appear on card", type: "text", placeholder: "Enter name" },
  ],
  "BasicInfo": [
    {
      name: "prefix",
      label: "Prefix",
      type: "radio",
      required: true,
      options: ["Mr", "Mrs", "Miss", "Others"],
    },
    { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter full name", required: true },
    { name: "nationality", label: "Nationality", type: "text", placeholder: "Enter nationality", required: true },
    { name: "countryOfResidence", label: "Country of Residence", type: "text", placeholder: "Enter country of residence", required: true },
    { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    { name: "residenceStatus", label: "Residence Status", type: "text", placeholder: "Enter residence status" }
  ],
  "Identification": [
    { name: "passportNo", label: "Passport No", type: "text", placeholder: "Enter passport number", required: true },
    { name: "passportExpiryDate", label: "Passport Expiry", type: "date", required: true },
    { name: "residenceVisaNo", label: "Residence Visa No", type: "text", placeholder: "Enter visa number" },
    { name: "visaExpiryDate", label: "Visa Expiry", type: "date" },
    { name: "emiratesIDNo", label: "Emirates ID", type: "text", placeholder: "Enter Emirates ID", required: true },
    { name: "EIDExpiryDate", label: "EID Expiry", type: "date", required: true }
  ],
  "Communication": [
    {
      name: "mailingAddress",
      label: "Mailing Address",
      type: "radio",
      options: ["Residential", "Business", "Other"],
    },
    { name: "buildingName", label: "Building Name", type: "text", placeholder: "Enter building name" },
    { name: "streetName", label: "Street Name", type: "text", placeholder: "Enter street name" },
    { name: "areaOrLandmark", label: "Area Or Landmark", type: "text", placeholder: "Enter Area" },
    { name: "flatNo", label: "Flat No", type: "text", placeholder: "Enter Flat No" },
    { name: "city", label: "City", type: "text", placeholder: "Enter city" },
    { name: "emirate", label: "emirate", type: "text", placeholder: "Enter emirate" },
    { name: "country", label: "Country", type: "text", placeholder: "Enter country" },
    { name: "POBox", label: "PO Box", type: "text", placeholder: "Enter PO Box" },
    { name: "mobileNo", label: "Mobile", type: "text", placeholder: "Enter mobile number", required: true },
    { name: "email", label: "Email", type: "text", placeholder: "Enter email", required: true },
    { name: "addressLine1", label: "Address Line1", type: "text", placeholder: "Enter Address Line1", required: true },
    { name: "addressLine2", label: "Address Line2", type: "text", placeholder: "Enter Address Line2", required: true },
    { name: "emirateCity", label: "Emirate City", type: "text", placeholder: "Enter Emirate City", required: true }
  ],
  "CustomerProfile": [
    { name: "purposeOfTheAccount", label: "Purpose of Account", type: "text", placeholder: "Enter purpose", required: true },
    { name: "sourceOfIncome", label: "Source of Income", type: "text", placeholder: "Enter source of income", required: true },
    { name: "specifyEmployer", label: "Specify Employer", type: "text", placeholder: "Enter Employer", required: true },
    { name: "specificCompanyNameAndTradeLicense", label: "Specific CompanyName And Trade License", type: "text", placeholder: "Enter source of income", required: true },
    {
      name: "expectedTypeOfAccountActivity",
      label: "Expected Activity",
      type: "radio",
      options: ["Deposits", "Withdrawals", "Transfers"],
    },
    { name: "EstimatedAmountTurnover", label: "Estimated Annual Turnover", type: "text", placeholder: "Enter estimated turnover" },
    // { name: "estimatedTransactions", label: "Estimated Transactions", type: "text", placeholder: "Enter estimated transactions" }
  ]
}

export const KPIList = {
  "StrategicFitKPIs": [
    {
      "StrategicOKRName": "Automated Processing Excellence",
      "ObjectiveDescription": "Achieve 90% straight-through processing",
      "PrimaryKPIs": "Straight-through processing rate",
      "TargetValue": "≥90%",
      "Timeline": "Q3 2025",
      "KPI_ID": "KPI-007-02",
      "KPI_Description": "Straight-through processing rate",
      "KPI_Calculation_Logic": "(Applications completed without manual intervention ÷ Total applications) × 100",
      "KPI_Frequency": "Daily",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "Schema_Required": "ALTER TABLE FinalDecisionLog ADD COLUMN manual_intervention BOOLEAN DEFAULT FALSE;",
      "Query": "SELECT 100.0 * SUM(CASE WHEN manual_intervention = 0 THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b1ed4e9c2d3295698807d_t WHERE decision_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "StrategicOKRName": "Processing Speed Revolution",
      "ObjectiveDescription": "Reduce end-to-end processing time by 50%",
      "PrimaryKPIs": "End-to-end processing time",
      "TargetValue": "≤4 hours",
      "Timeline": "Q4 2025",
      "KPI_ID": "KPI-007-01",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "End-to-end processing time",
      "KPI_Calculation_Logic": "Average time from application start to completion",
      "KPI_Frequency": "Daily",
      "Schema_Required": "Existing PersonalBankAccountApplication and FinalDecisionLog tables",
      "Query": "SELECT AVG(TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(p.submission_date/1000), FROM_UNIXTIME(f.decision_date/1000)))/60.0 AS pct FROM t_6899ed16e9c2d32956987b9c_t p JOIN t_689b1ed4e9c2d3295698807d_t f ON p.application_id = f.application_id WHERE p.submission_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "StrategicOKRName": "System Reliability Goal",
      "ObjectiveDescription": "Maintain 99% system availability",
      "PrimaryKPIs": "System availability rate",
      "TargetValue": "≥99%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-007-03",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "System availability rate",
      "KPI_Calculation_Logic": "(System uptime ÷ Total time) × 100",
      "KPI_Frequency": "Real-time",
      "Schema_Required": "CREATE TABLE SystemUptimeMetric (metric_date DATE, uptime_seconds BIGINT, total_seconds BIGINT DEFAULT 86400);",
      "Query": "SELECT  100.0 * SUM(CAST(uptime_seconds AS DECIMAL(20,2))) / SUM(CAST(total_seconds AS DECIMAL(20,2))) AS pct FROM t_68a6e9af4e7cc90774f5db06_t WHERE metric_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "StrategicOKRName": "Digital Transformation Target",
      "ObjectiveDescription": "Achieve 95% first-time data capture accuracy",
      "PrimaryKPIs": "Data capture accuracy rate",
      "TargetValue": "≥95%",
      "Timeline": "Q1 2025",
      "KPI_ID": "KPI-001-01",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Data capture accuracy rate",
      "KPI_Calculation_Logic": "(Correctly captured applications ÷ Total applications) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE ApplicationCaptureAudit (application_id VARCHAR(64) PRIMARY KEY, captured_by VARCHAR(64), captured_at DATETIME, is_correct BOOLEAN, correction_count INT DEFAULT 0, notes TEXT);",
      "Query": "SELECT 100.0 * SUM(IF(is_correct,1,0)) / COUNT(*) AS pct FROM t_689b2b5ce9c2d329569880cf_t WHERE captured_at BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "StrategicOKRName": "Process Optimization",
      "ObjectiveDescription": "Eliminate duplicate customer records by 95%",
      "PrimaryKPIs": "Duplicate reduction rate",
      "TargetValue": "≥95%",
      "Timeline": "Q3 2025",
      "KPI_ID": "KPI-002-02",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "Duplicate reduction rate",
      "KPI_Calculation_Logic": "((Previous duplicates - Current duplicates) ÷ Previous duplicates) × 100",
      "KPI_Frequency": "Weekly",
      "Schema_Required": "CREATE TABLE DuplicateDetectionLog (detection_date DATE, duplicates_found INT, total_checked INT);",
      "Query": "SELECT 100.0 * (SUM(duplicates) / SUM(total_checked)) AS pct FROM (SELECT COUNT(*) - COUNT(DISTINCT emirates_id) AS duplicates, COUNT(*) AS total_checked FROM t_6899eeb2e9c2d32956987b9d_t WHERE created_at BETWEEN '1735689600000' AND '1743609599000') t"
    }
  ],
  "OperationalRelevanceKPIs": [
    {
      "OperationalOKRName": "Data Capture Excellence",
      "ObjectiveDescription": "Minimize re-submission rate to <5%",
      "PrimaryKPIs": "Re-submission rate",
      "TargetValue": "≤5%",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-001-02",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "Re-submission rate",
      "KPI_Calculation_Logic": "(Re-submitted applications ÷ Total applications) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE ApplicationHistory (history_id BIGINT AUTO_INCREMENT PRIMARY KEY, application_id VARCHAR(64) NOT NULL, event_type VARCHAR(50), event_time DATETIME, actor VARCHAR(64), details JSON);",
      "Query": "SELECT 100.0 * SUM(CASE WHEN event_type='resubmission' THEN 1 ELSE 0 END) / COUNT(DISTINCT application_id) AS pct FROM t_689b2ba6e9c2d329569880d3_t WHERE event_time BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "OperationalOKRName": "Faster Document Processing",
      "ObjectiveDescription": "Reduce document processing time by 40%",
      "PrimaryKPIs": "Document processing time",
      "TargetValue": "≤5 minutes",
      "Timeline": "Q3 2025",
      "KPI_ID": "KPI-003-02",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Document processing time",
      "KPI_Calculation_Logic": "Average time from document upload to verification completion",
      "KPI_Frequency": "Hourly",
      "Schema_Required": "CREATE TABLE t_689b3ad0e9c2d3295698815c_t   (document_id VARCHAR(64), bundle_id VARCHAR(64), received_at DATETIME, processed_at DATETIME, processor VARCHAR(64));",
      "Query": "SELECT AVG(CAST(processed_at AS SIGNED) - CAST(received_at AS SIGNED)) / 60000.0 AS pct FROM t_689b3ad0e9c2d3295698815c_t WHERE processed_at IS NOT NULL;"
    },
    {
      "OperationalOKRName": "Format Standards Adherence",
      "ObjectiveDescription": "Ensure 100% format compliance",
      "PrimaryKPIs": "Format validation accuracy",
      "TargetValue": "100%",
      "Timeline": "Ongoing",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_ID": "KPI-003-03",
      "KPI_Description": "Format validation accuracy",
      "KPI_Calculation_Logic": "(Documents with correct format ÷ Total documents) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE t_689b2e97e9c2d329569880f3_t (document_id VARCHAR(64) PRIMARY KEY, bundle_id VARCHAR(64), document_type VARCHAR(50), submitted_at DATETIME, status VARCHAR(20), is_format_valid BOOLEAN);",
      "Query": "SELECT 100.0 * SUM(CASE WHEN is_format_valid THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b2e97e9c2d329569880f3_t;"
    },
    {
      "OperationalOKRName": "Identity Precision Goal",
      "ObjectiveDescription": "Achieve 99% identity matching accuracy",
      "PrimaryKPIs": "Identity match accuracy",
      "TargetValue": "≥99%",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-002-01",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "Identity match accuracy",
      "KPI_Calculation_Logic": "(Correct identity matches ÷ Total identity checks) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE IdentityMatchLog (id BIGINT PRIMARY KEY AUTO_INCREMENT, application_id VARCHAR(64), customer_id VARCHAR(64), match_score DECIMAL(5,2), match_result VARCHAR(20), checked_at DATETIME);",
      "Query": "SELECT 100.0 * SUM(CASE WHEN match_result='MATCH' THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b3a7fe9c2d3295698815a_t WHERE checked_at BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "OperationalOKRName": "Error-Free Validation",
      "ObjectiveDescription": "Reduce validation failure rate to <2%",
      "PrimaryKPIs": "Validation success rate",
      "TargetValue": "≥98%",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-002-03",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Validation success rate",
      "KPI_Calculation_Logic": "(Successful validations ÷ Total validation attempts) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "Existing DocumentBundle table",
      "Query": "SELECT 100.0 * SUM(CASE WHEN verification_status ='Verified' THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_6899ef64e9c2d32956987b9e_t WHERE application_id IN (SELECT application_id FROM t_6899ed16e9c2d32956987b9c_t WHERE submission_date BETWEEN '1735689600000' AND '1743609599000'); "
    },
    {
      "OperationalOKRName": "KYC Compliance Mastery",
      "ObjectiveDescription": "Ensure 100% KYC compliance",
      "PrimaryKPIs": "KYC pass rate",
      "TargetValue": "100%",
      "Timeline": "Ongoing",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_ID": "KPI-001-04",
      "KPI_Description": "KYC pass rate",
      "KPI_Calculation_Logic": "(KYC passed applications ÷ Total KYC checks) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "Existing ComplianceCheckReport table",
      "Query": "SELECT  100.0 * SUM(CASE WHEN compliance_status IN ('Clear', 'Cleared_Override') THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_6899f04ee9c2d32956987b9f_t WHERE screening_date BETWEEN '1735689600000' AND '1743609599000'; "
    },
    {
      "OperationalOKRName": "SLA Performance Target",
      "ObjectiveDescription": "Maintain 98% SLA compliance",
      "PrimaryKPIs": "SLA compliance rate",
      "TargetValue": "≥98%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-001-06",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "SLA compliance rate",
      "KPI_Calculation_Logic": "(Applications completed within SLA ÷ Total applications) × 100",
      "KPI_Frequency": "Real-time",
      "Schema_Required": "Existing PersonalBankAccountApplication and FinalDecisionLog tables",
      "Query": "SELECT 100.0 * SUM(CASE WHEN f.decision_date <= p.sla_due_date THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_6899ed16e9c2d32956987b9c_t p JOIN t_689b1ed4e9c2d3295698807d_t f ON p.application_id = f.application_id WHERE p.submission_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "OperationalOKRName": "Timely Decision Making",
      "ObjectiveDescription": "Complete 95% of decisions within SLA",
      "PrimaryKPIs": "Decision completion rate",
      "TargetValue": "≥95%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-006-01",
      "KPI_Description": "Decision completion rate",
      "KPI_Calculation_Logic": "(Decisions completed within SLA ÷ Total decisions) × 100",
      "KPI_Frequency": "Real-time",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "Schema_Required": "Existing FinalDecisionLog and PersonalBankAccountApplication tables",
      "Query": "SELECT 100.0 * SUM(CASE WHEN f.decision_date <= p.sla_due_date THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b1ed4e9c2d3295698807d_t f JOIN t_6899ed16e9c2d32956987b9c_t p ON f.application_id = p.application_id WHERE f.decision_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "OperationalOKRName": "Customer Communication Success",
      "ObjectiveDescription": "Achieve 98% notification delivery rate",
      "PrimaryKPIs": "Notification delivery rate",
      "TargetValue": "≥98%",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-006-03",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Notification delivery rate",
      "KPI_Calculation_Logic": "(Successfully delivered notifications ÷ Total notifications) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE NotificationLog (notification_id BIGINT AUTO_INCREMENT PRIMARY KEY, application_id VARCHAR(64), channel VARCHAR(20), send_time DATETIME, delivered BOOLEAN, delivered_at DATETIME);",
      "Query": "SELECT 100.0 * SUM(CASE WHEN notified_to_customer=1 THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b1ed4e9c2d3295698807d_t WHERE decision_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "OperationalOKRName": "Instant Customer Updates",
      "ObjectiveDescription": "Send notifications within 30 minutes",
      "PrimaryKPIs": "Notification delivery time",
      "TargetValue": "≤30 minutes",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-006-04",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Notification delivery time",
      "KPI_Calculation_Logic": "Average time from decision to customer notification",
      "KPI_Frequency": "Hourly",
      "Schema_Required": "Existing FinalDecisionLog and NotificationLog tables",
      "Query": "SELECT AVG(TIMESTAMPDIFF(SECOND, f.decision_date, n.delivered_at))/60.0 AS pct FROM t_689b1ed4e9c2d3295698807d_t f JOIN t_689b3271e9c2d32956988102_t n ON f.application_id = n.application_id WHERE n.delivered_at IS NOT NULL;"
    }
  ],
  "ComplianceRiskRegulatoryKPIs": [
    {
      "ComplianceRiskOKRName": "Compliance Screening Excellence",
      "ObjectiveDescription": "Achieve 99.5% screening accuracy",
      "PrimaryKPIs": "Compliance screening accuracy",
      "TargetValue": "≥99.5%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-004-01",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "Compliance screening accuracy",
      "KPI_Calculation_Logic": "(Accurate screening results ÷ Total screenings) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "Existing ComplianceCheckReport table with manual_review_result field",
      "Query": "SELECT 100.0 * SUM(CASE WHEN sanctions_list_result = compliance_status THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_6899f04ee9c2d32956987b9f_t WHERE screening_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "ComplianceRiskOKRName": "False Alert Reduction",
      "ObjectiveDescription": "Reduce false positives by 70%",
      "PrimaryKPIs": "False positive rate",
      "TargetValue": "≤30% of baseline",
      "Timeline": "Q3 2025",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_ID": "KPI-004-02",
      "KPI_Description": "False positive rate",
      "KPI_Calculation_Logic": "(False positive alerts ÷ Total alerts) × 100",
      "KPI_Frequency": "Weekly",
      "Schema_Required": "CREATE TABLE t_689b2febe9c2d329569880f8_t (alert_id BIGINT AUTO_INCREMENT PRIMARY KEY, application_id VARCHAR(64), alert_type VARCHAR(50), alert_time DATETIME, is_false_positive BOOLEAN, resolved_at DATETIME);",
      "Query": "SELECT 100.0 * SUM(CASE WHEN is_false_positive THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b2febe9c2d329569880f8_t WHERE alert_time BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "ComplianceRiskOKRName": "AML Perfect Compliance",
      "ObjectiveDescription": "Maintain 100% AML compliance",
      "PrimaryKPIs": "AML detection rate",
      "TargetValue": "100%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-004-03",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "AML detection rate",
      "KPI_Calculation_Logic": "(AML cases detected ÷ Actual AML cases) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE t_689b306ee9c2d329569880f9_t (case_id BIGINT AUTO_INCREMENT, application_id VARCHAR(64), flagged_at DATETIME, final_outcome VARCHAR(20), PRIMARY KEY(case_id));",
      "Query": "SELECT 100.0 * SUM(CASE WHEN ci.final_outcome='AML' THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b306ee9c2d329569880f9_t ci JOIN t_6899f04ee9c2d32956987b9f_t c ON ci.application_id = c.application_id WHERE ci.flagged_at BETWEEN '1735689600000' AND '1743609599000'; "
    },
    {
      "ComplianceRiskOKRName": "Rapid Compliance Check",
      "ObjectiveDescription": "Complete compliance screening within 5 minutes",
      "PrimaryKPIs": "Compliance processing time",
      "TargetValue": "≤5 minutes",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-004-04",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "Compliance processing time",
      "KPI_Calculation_Logic": "Average time from screening initiation to completion",
      "KPI_Frequency": "Hourly",
      "Schema_Required": "ALTER TABLE ComplianceCheckReport ADD COLUMN screening_start DATETIME, ADD COLUMN screening_end DATETIME;",
      "Query": "SELECT AVG((CAST(screening_end AS UNSIGNED) - CAST(screening_start AS UNSIGNED)) / 1000.0) / 60.0 AS pct FROM t_6899f04ee9c2d32956987b9f_t WHERE screening_start IS NOT NULL AND screening_end IS NOT NULL;"
    },
    {
      "ComplianceRiskOKRName": "Credit Data Reliability",
      "ObjectiveDescription": "Achieve 98% successful AECB data retrieval",
      "PrimaryKPIs": "AECB data retrieval success rate",
      "TargetValue": "≥98%",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-005-01",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "AECB data retrieval success rate",
      "KPI_Calculation_Logic": "(Successful AECB retrievals ÷ Total retrieval attempts) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE t_689b3154e9c2d329569880fa_t (id BIGINT AUTO_INCREMENT PRIMARY KEY, application_id VARCHAR(64), requested_at DATETIME, completed_at DATETIME, status VARCHAR(20), response_code INT);",
      "Query": "SELECT 100.0 * SUM(CASE WHEN status='SUCCESS' THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689b3154e9c2d329569880fa_t WHERE requested_at BETWEEN '1735689600000' AND '1743609599000'; "
    },
    {
      "ComplianceRiskOKRName": "Quick Risk Assessment",
      "ObjectiveDescription": "Complete risk assessment within 5 minutes",
      "PrimaryKPIs": "Risk assessment completion time",
      "TargetValue": "≤5 minutes",
      "Timeline": "Q2 2025",
      "KPI_ID": "KPI-005-02",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Risk assessment completion time",
      "KPI_Calculation_Logic": "Average time from data retrieval to risk category assignment",
      "KPI_Frequency": "Hourly",
      "Schema_Required": "CREATE TABLE t_689b31a0e9c2d329569880fb_t (id BIGINT AUTO_INCREMENT PRIMARY KEY, application_id VARCHAR(64), data_retrieved_at DATETIME, risk_category_assigned_at DATETIME, risk_category VARCHAR(50));",
      "Query": "SELECT AVG((CAST(risk_category_assigned_at AS UNSIGNED) - CAST(data_retrieved_at AS UNSIGNED)) / 1000.0) / 60.0 AS pct FROM t_689b31a0e9c2d329569880fb_t WHERE data_retrieved_at IS NOT NULL AND risk_category_assigned_at IS NOT NULL;"
    },
    {
      "ComplianceRiskOKRName": "Debt Ratio Precision",
      "ObjectiveDescription": "Ensure 99% DBR calculation accuracy",
      "PrimaryKPIs": "DBR calculation accuracy",
      "TargetValue": "≥99%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-005-03",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "DBR calculation accuracy",
      "KPI_Calculation_Logic": "(Accurate DBR calculations ÷ Total calculations) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "Existing CreditScoreReport table with dbr_validation_result field",
      "Query": "SELECT 100.0 * SUM(CASE WHEN dbr_validation_result='OK' THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM t_689adc47e9c2d32956987fbb_t WHERE score_date BETWEEN '1735689600000' AND '1743609599000'; "
    },
    {
      "ComplianceRiskOKRName": "Risk Portfolio Balance",
      "ObjectiveDescription": "Maintain balanced risk distribution",
      "PrimaryKPIs": "Risk distribution balance",
      "TargetValue": "≤15% variance",
      "Timeline": "Q3 2025",
      "KPI_ID": "KPI-005-04",
      "progressColor": "bg-green-500",
      "bg": "bg-green-50",
      "KPI_Description": "Risk distribution balance",
      "KPI_Calculation_Logic": "Standard deviation of risk tier assignments",
      "KPI_Frequency": "Weekly",
      "Schema_Required": "Existing CreditScoreReport table with risk_category and score fields",
      "Query": "SELECT STDDEV_POP(credit_score) AS pct FROM t_689adc47e9c2d32956987fbb_t WHERE score_date BETWEEN '1735689600000' AND '1743609599000';"
    },
    {
      "ComplianceRiskOKRName": "Complete Audit Trails",
      "ObjectiveDescription": "Maintain 100% audit trail completeness",
      "PrimaryKPIs": "Audit trail completeness",
      "TargetValue": "100%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-006-02",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Audit trail completeness",
      "KPI_Calculation_Logic": "(Complete audit trails ÷ Total decisions) × 100",
      "KPI_Frequency": "Daily",
      "Schema_Required": "CREATE TABLE t_689b3218e9c2d329569880fe_t (audit_id BIGINT AUTO_INCREMENT PRIMARY KEY, decision_id VARCHAR(64), application_id VARCHAR(64), event_time DATETIME, event_type VARCHAR(50), actor VARCHAR(64), details JSON);",
      "Query": "SELECT 100.0 * SUM(CASE WHEN cnt_events >= required_events THEN 1 ELSE 0 END) / COUNT(*) AS pct FROM ( SELECT d.decision_id, COUNT(*) AS cnt_events, 2 AS required_events FROM t_689b3218e9c2d329569880fe_t l JOIN t_689b1ed4e9c2d3295698807d_t d ON l.decision_id = d.decision_id GROUP BY d.decision_id) t;"
    },
    {
      "ComplianceRiskOKRName": "Perfect Audit Logging",
      "ObjectiveDescription": "Achieve 100% logging compliance",
      "PrimaryKPIs": "Decision logging success rate",
      "TargetValue": "100%",
      "Timeline": "Ongoing",
      "KPI_ID": "KPI-006-05",
      "progressColor": "bg-blue-500",
      "bg": "bg-blue-50",
      "KPI_Description": "Decision logging success rate",
      "KPI_Calculation_Logic": "(Successfully logged decisions ÷ Total decisions) × 100",
      "KPI_Frequency": "Real-time",
      "Schema_Required": "Existing PersonalBankAccountApplication and FinalDecisionLog tables",
      "Query": "SELECT 100.0 * COUNT(DISTINCT f.decision_id) / COUNT(DISTINCT p.application_id) AS pct FROM t_6899ed16e9c2d32956987b9c_t p LEFT JOIN t_689b1ed4e9c2d3295698807d_t f ON p.application_id = f.application_id WHERE p.submission_date BETWEEN '1735689600000' AND '1743609599000';"
    }
  ]
}

export const adhocQuerys = {
  "newApplication": [
    {
      KPI_ID: 'new-apps',
      title: 'Total New Applications',
      value: 47,
      unit: '',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      target: 50,
      direction: 'higher',
      progressPct: 94,
      status: 'On Track',
      progressColor: 'bg-blue-600',
      KPI_Description: 'Daily intake of new applications approaching target.',
      trend: { delta: '+7%', period: 'WoW', direction: 'up' },
      tooltip: 'Goal: 50 new applications today',
      Query: "select count(*) as resp from t_6899ed16e9c2d32956987b9c_t where application_status = 'In Progress';"
    },
    {
      KPI_ID: 'intake-time',
      title: 'Avg Intake Time',
      value: "",
      unit: 'min',
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 3.5,
      direction: 'lower',
      progressPct: Math.min(100, Math.round((3.5 / 4.2) * 100)), // ≈ 83%
      status: 'Behind',
      progressColor: 'bg-green-600',
      KPI_Description: 'Average time from submission to intake completion.',
      trend: { delta: '-0.3 min', period: 'WoW', direction: 'down' }, // improving
      tooltip: 'Aim to reach ≤ 3.5 min average intake time',
      Query: "SELECT AVG(diff_seconds)/60 AS resp FROM (SELECT p.application_id, TIME_TO_SEC(TIMEDIFF(FROM_UNIXTIME(CAST(latest.latest_decision_date AS UNSIGNED)/1000), FROM_UNIXTIME(CAST(p.submission_date AS UNSIGNED)/1000))) AS diff_seconds FROM t_6899ed16e9c2d32956987b9c_t p JOIN (SELECT application_id, MAX(decision_date) AS latest_decision_date FROM t_689b1ed4e9c2d3295698807d_t GROUP BY application_id) latest ON p.application_id = latest.application_id WHERE p.submission_date IS NOT NULL AND latest.latest_decision_date IS NOT NULL AND FROM_UNIXTIME(CAST(latest.latest_decision_date AS UNSIGNED)/1000) >= FROM_UNIXTIME(CAST(p.submission_date AS UNSIGNED)/1000)) t;"
    },
    {
      KPI_ID: 'applications-approved',
      title: 'Applications approved',
      value: "",
      unit: '',
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 50,
      direction: 'lower',
      progressPct: null,
      status: 'Behind',
      progressColor: 'bg-green-600',
      KPI_Description: 'Total applications approved so far.',
      trend: {},
      tooltip: '',
      Query: "select count(application_id) as resp from t_6899ed16e9c2d32956987b9c_t where kyc_status = 'approved';"
    },
    {
      KPI_ID: 'applications-pending',
      title: 'Applications pending',
      value: "",
      unit: '',
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 50,
      direction: 'lower',
      progressPct: null,
      status: 'Behind',
      progressColor: 'bg-green-600',
      KPI_Description: 'Total applications pending.',
      trend: {},
      tooltip: '',
      Query:"select count(*) as resp from t_6899ed16e9c2d32956987b9c_t where application_status = 'pending'"
    }
  ],
  "KYCRiskScreening": [
    {
      KPI_ID: 'clients-screened',
      title: 'Total Clients Screened',
      value: 89,
      unit: '',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      target: 100, // higher is better
      direction: 'higher',
      progressPct: Math.min(100, Math.round((89 / 100) * 100)), // 89%
      status: 'On Track',
      progressColor: 'bg-blue-600',
      KPI_Description: 'Number of clients screened so far, close to daily target.',
      trend: { delta: '+5%', period: 'WoW', direction: 'up' },
      tooltip: 'Goal: 100 clients screened today',
      Query: "select count(*) as resp from t_6899ef64e9c2d32956987b9e_t ;"
    },
    {
      KPI_ID: 'total kyc checked',
      title: 'Total KYC checked',
      value: 76,
      unit: '%',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 80, // higher is better
      direction: 'higher',
      progressPct: Math.min(100, Math.round((76 / 80) * 100)), // 95%
      status: 'On Track',
      progressColor: 'bg-green-600',
      KPI_Description: 'Proportion of cases checked without manual intervention.',
      trend: { delta: '+2%', period: 'WoW', direction: 'up' },
      tooltip: 'Target: 80% cleared automatically',
      Query: "SELECT  100.0 * SUM(CASE WHEN kyc_status IN ('Clear', 'Cleared_Override','Done','done','Completed','Approved') THEN 1 ELSE 0 END) / COUNT(*) AS resp FROM t_6899ed16e9c2d32956987b9c_t ;"
    }
  ],
  "ComplianceCheck": [
    {
      KPI_ID: 'Compliance pass rate',
      title: 'Compliance pass rate',
      value: null,
      unit: '%',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 95,
      direction: 'higher',
      progressPct: "",
      status: 'TBD',
      progressColor: 'bg-green-600',
      KPI_Description: 'Percentage of screenings that cleared compliance checks.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≥95% pass rate',
      Query:
        "SELECT (SUM(CASE WHEN compliance_status = 'Clear' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resp FROM t_6899f04ee9c2d32956987b9f_t;"
    },
    {
      KPI_ID: 'Risk level distribution',
      title: 'Risk level distribution',
      value: null,
      unit: '',
      icon: ShieldCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      target: null,
      direction: 'neutral',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-indigo-600',
      KPI_Description: 'Breakdown of clients by assigned risk level.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Use for stacked bar/pie showing Low/Medium/High proportions',
      Query:
        "SELECT risk_level, COUNT(*) AS resp FROM t_6899f04ee9c2d32956987b9f_t GROUP BY risk_level;"
    },
    {
      KPI_ID: 'Manual review rate',
      title: 'Manual review rate',
      value: null,
      unit: '%',
      icon: ClipboardList,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      target: 10,
      direction: 'lower',
      progressPct: "",
      status: 'TBD',
      progressColor: 'bg-amber-600',
      KPI_Description: 'Share of screenings requiring human review.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≤10% require manual review',
      Query:
        "SELECT (SUM(CASE WHEN checked_by IS NOT NULL AND checked_by != 'System' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resp FROM t_6899f04ee9c2d32956987b9f_t;"
    },
    {
      KPI_ID: 'Screening False positive rate',
      title: 'Screening False positive rate',
      value: null,
      unit: '%',
      icon: Triangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      target: 2,
      direction: 'lower',
      progressPct: "",
      status: 'TBD',
      progressColor: 'bg-red-600',
      KPI_Description: 'Rate of unclear sanction hits that turn out to be false positives.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≤2% false positives',
      Query:
        "SELECT (SUM(CASE WHEN compliance_status = 'Manual Review' and sanctions_list_result = 'Unclear' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resp FROM t_6899f04ee9c2d32956987b9f_t WHERE sanctions_list_result = 'Unclear';"
    }
  ],
  "AuditTrail": [
    {
      KPI_ID: 'Application Approval Rate',
      title: 'Application Approval Rate',
      value: null, // <- bind to query result alias: approved_percentage
      unit: '%',
      icon: ThumbsUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 90, // higher is better
      direction: 'higher',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-green-600',
      KPI_Description: 'Share of applications that receive approval.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≥90% approvals',
      Query:
        "SELECT (SUM(CASE WHEN decision_status = 'Approved' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resp FROM t_689b1ed4e9c2d3295698807d_t;"
    },
    {
      KPI_ID: 'Application Rejection Rate',
      title: 'Application Rejection Rate',
      value: null,
      unit: '%',
      icon: ThumbsDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
      target: 10, // lower is better
      direction: 'lower',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-red-600',
      KPI_Description: 'Share of applications that are rejected.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≤10% rejections',
      Query:
        "SELECT (SUM(CASE WHEN decision_status = 'Rejected' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resp FROM t_689b1ed4e9c2d3295698807d_t;"
    },
    {
      KPI_ID: 'Application Creation Success Rate',
      title: 'Application Creation Success Rate',
      value: null, // <- bind to query result alias: account_creation_percentage
      unit: '%',
      icon: Rocket,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      target: 98, // higher is better
      direction: 'higher',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-indigo-600',
      KPI_Description: 'Of approved applications, percent that successfully create an account.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≥98% account creation success',
      Query:
        "SELECT (SUM(CASE WHEN decision_status = 'Approved' and account_created_flag = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resp FROM t_689b1ed4e9c2d3295698807d_t WHERE decision_status = 'Approved';"
    },
    {
      KPI_ID: 'Customer notification rate',
      title: 'Customer notification rate',
      value: null, // <- bind to query result alias below (notification_rate_percentage)
      unit: '%',
      icon: Bell,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      target: 99, // higher is better
      direction: 'higher',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-purple-600',
      KPI_Description: 'Percent of customers notified of the decision.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≥99% customers notified',
      Query:
        "SELECT (SUM(CASE WHEN decision_status = 'Approved' and account_created_flag = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resp FROM t_689b1ed4e9c2d3295698807d_t WHERE decision_status = 'Approved';"
    }
  ],
  "ApplicationStatus": [
    {
      KPI_ID: 'Verification Status',
      title: 'Verification Status',
      value: null, // <- bind to query result alias: Verified_count
      unit: '', // count
      icon: BadgeCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
      target: 100, // higher is better (adjust to your daily/weekly target)
      direction: 'higher',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-green-600',
      KPI_Description: 'Number of records that have completed verification.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: verify at least 100 records',
      Query:
        "select count(*) as resp from t_6899ef64e9c2d32956987b9e_t where verification_status= 'Verified';"
    },
    {
      KPI_ID: 'Average Document submission score',
      title: 'Average Document submission score',
      value: null, // <- bind to query result alias: avg_verified_ocr_score (0–1)
      unit: '', // score in 0–1 scale; switch to '%' if you multiply by 100 upstream
      icon: Gauge,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      target: 0.98, // higher is better
      direction: 'higher',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-indigo-600',
      KPI_Description: 'Average OCR confidence for verified submissions.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: average OCR confidence ≥ 0.98',
      Query:
        "SELECT AVG(CAST(ocr_confidence_score AS DOUBLE)) AS resp FROM t_6899ef64e9c2d32956987b9e_t WHERE verification_status = 'Verified';"
    },
    {
      KPI_ID: 'High Confidence Submissions (Count)',
      title: 'High-confidence submissions (count)',
      value: null, // <- bind to query result alias: count_high_confidence
      unit: 'docs',
      icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      target: 80, // higher is better
      direction: 'higher',
      progressPct: null,
      status: 'TBD',
      progressColor: 'bg-purple-600',
      KPI_Description: 'Documents with OCR confidence > 0.95.',
      trend: { delta: null, period: 'WoW', direction: null },
      tooltip: 'Goal: ≥80 high-confidence docs',
      Query:
        "SELECT COUNT(*) AS resp FROM t_6899ef64e9c2d32956987b9e_t WHERE CAST(ocr_confidence_score AS DOUBLE) > 0.95;"
    }
  ]
}

export const tableQueries = {
  "newApplication": "SELECT t1.*, t2.customer_id, t2.full_name FROM t_6899ed16e9c2d32956987b9c_t AS t1 JOIN t_6899eeb2e9c2d32956987b9d_t AS t2 ON t1.application_id = t2.application_id ;",
  "applicationStatus": "SELECT t1.customer_id, t1.full_name, t2.assigned_ops_team, t3.documents_submitted, t3.verification_status FROM t_6899eeb2e9c2d32956987b9d_t AS t1 JOIN t_6899ed16e9c2d32956987b9c_t AS t2 ON t1.application_id = t2.application_id JOIN t_6899ef64e9c2d32956987b9e_t AS t3 ON t1.application_id = t3.application_id;",
  "KYCRiskScreening": "SELECT t1.application_id, t1.nationality, t2.assigned_ops_team, t2.account_type, t4.risk_level, t4.checked_by, t4.review_notes, t1.customer_id, t1.full_name, t2.kyc_status FROM t_6899eeb2e9c2d32956987b9d_t AS t1 JOIN t_6899ed16e9c2d32956987b9c_t AS t2 ON t1.application_id = t2.application_id JOIN t_6899f04ee9c2d32956987b9f_t AS t4 ON t1.application_id = t4.application_id;",
  "complianceCheck":"SELECT * FROM t_6899eeb2e9c2d32956987b9d_t a JOIN t_6899f04ee9c2d32956987b9f_t b ON a.application_id = b.application_id;"
}

export const agentIds = {
  "fileRead":"0198e4f4-8bbe-7bdb-8040-864e31efe299",
  "complianceAgent":"a6491dea-d201-447d-825c-4eb7be73a692",
  "mainAgent":"38191ed6-3a48-4bc9-a2d8-153fbf2d32a1",
  "kycAgent":"5ebd931d-83b4-459e-8e0c-edba096bc487"
};