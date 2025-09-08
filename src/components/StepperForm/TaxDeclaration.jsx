import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { PostInteractive, PostSchema } from "../../API/Api";
import { agentIds, SchemaId } from "../../Constants";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

function generateRandomUniqueId() {
  const prefix = "FAB";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000);
  const paddedSeq = String(random).padStart(6, "0");
  return `${prefix}-${year}-${paddedSeq}`;
}

export const teams = [
  "Alpha Support Team",
  "Bravo Banking Desk",
  "Capital Care Group",
  "Delta Service Crew",
  "Echo Response Unit",
  "Finance Helpdesk",
];

let interactivepayload = {
  agentId: "",
  query: "",
  userId: "1",
  sessionId: "",
  referenceId: "",
  edit: false,
  regenerate: false,
  streaming: false,
  overrideConfig: {},
};

let AgentConsolepayload = {
  agent_name: "",
  agent_id: "",
  lastused: "",
  response_time: "",
  activity_log: "",
  status: "",
};

export default function TaxDeclaration() {
  const navigate = useNavigate();
  const { allformsData } = useAuth();

  const [formData, setFormData] = useState({
    isUSPerson: "",
    isTaxResidentOther: "",
  });
  const [loading,setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return formData.isUSPerson !== "" && formData.isTaxResidentOther !== "";
  };

  const handleNext = async () => {
    console.log("Tax declaration submitted:", { ...allformsData, ...formData });
    setLoading(true);
    try {
      let allData = { ...allformsData, ...formData };
      let id = uuidv4();
      let date = new Date().toISOString().slice(0, 10);
      let customer_id = generateRandomUniqueId();
      const creditRiskData = {data:[{
        credit_report_id:uuidv4(),
        customer_id,
        monthly_income:allData.monthlySalary,
        employment_details:{
          employer:allData.employer,
          position:allData.position
        }
      }]}
      const filterData = {
        data: [
          {
            residency_status: "Business",
            full_name: allData.fullName,
            nationality: allData.nationality,
            contact_details: {
              country: allData.countryOfResidence,
              email: allData.email,
              mobile: allData.phoneNumber,
              address: allData.addressLine1,
            },
            customer_id,
            application_id: id,
            emirates_id: allData.emiratesIDNo,
            created_at: `${Date.now()}`,
          },
        ],
      };
      const randomIndex = Math.floor(Math.random() * teams.length);
      const personalBankAccountApplicationData = {
        data: [
          {
            account_type: allData.selectedAccountType,
            assigned_ops_team: teams[randomIndex],
            application_status: "In Progress",
            application_id: id,
            submission_date: `${Date.now()}`,
            sla_due_date: `${Date.now()}`,
            kyc_status: allData.kyc_status,
          },
        ],
      };

      await PostSchema(
        `${SchemaId.PersonalBankAccountApplication}/instances`,
        personalBankAccountApplicationData
      );
      await PostSchema(`${SchemaId.CustomerProfile}/instances`, filterData);

      await PostSchema(`${SchemaId.DocumentBundle}/instances`, {data:[{...allData.docbundle,application_id:id}]});

      await PostSchema(`${SchemaId.creditRiskScore}/instances`, creditRiskData);
 
      const kycquery = `emirates_id:${allData.emiratesIDNo}`;

      let kycpayload = {
        ...interactivepayload,
        agentId: agentIds.kycAgent,
        query: kycquery,
      };

      let startTime = performance.now();

      let kycoutput = await PostInteractive("interact", kycpayload);

      let endTime = performance.now();

      let kycRes = JSON.parse(kycoutput.usedTools[1].toolOutput);

      let kycConsole = {
        ...AgentConsolepayload,
        id:uuidv4(),
        agent_name: "kyc_agent",
        agent_id: agentIds.kycAgent,
        lastused: new Date().toISOString(),
        response_time: ((endTime - startTime)/1000).toFixed(2),
        activity_log: kycRes.retrbidy.data[0].activity_log,
        status: "Active"
      }

      await PostSchema(`${SchemaId.AgentConsole}/instances`, {data:[{...kycConsole}]});

      const complaincequery = `Check compliance for the following details: name: ${allData.fullName}, id_number: ${allData.emiratesIDNo}, nationality: ${allData.nationality}, application_id: ${id}.`;
      
      let complaincepayload = {
        ...interactivepayload,
        agentId: agentIds.complianceAgent,
        query: complaincequery,
      };

      startTime = performance.now();

      let complainceoutput = await PostInteractive("interact", complaincepayload);

      endTime = performance.now();

      complainceoutput = JSON.parse(complainceoutput.usedTools[1].toolOutput);

      let complainceConsole = {
        ...AgentConsolepayload,
        id:uuidv4(),
        agent_name: "Compliance_agent",
        agent_id: agentIds.complianceAgent,
        lastused: new Date().toISOString(),
        response_time: ((endTime - startTime)/1000).toFixed(2),
        activity_log: complainceoutput.retrbidy.data[0].activity_log,
        status: "Active"
      }

      await PostSchema(`${SchemaId.AgentConsole}/instances`, {data:[{...complainceConsole}]});

      let finaldecisionquery = `Kyc status is verified and complaiance status is clear and 'companies': [ 'Bright Future Technologies LLC', 'Desert Star Trading FZE', 'Oasis Hospitality Group', 'Skyline Construction LLC', 'EmirTech Solutions', 'Golden Sands Finance', 'Pearl Marine Services', 'Falcon Aviation Services', 'Blue Horizon Media', 'Sunrise Retail Group' ] } give me verifed or not verifed? and application_id is '${id}' and decision_id is ${uuidv4()}`;
      
      let finaldecisionlogpayload = {
        ...interactivepayload,
        agentId: agentIds.mainAgent,
        query: finaldecisionquery,
        "fileUrl": [
        "https://cdn.gov-cloud.ai/_ENC(nIw4FQRwLOQd0b8T2HcImBUJ5a9zjZEImv/UhJi8/+yUl7Ez+m0qAiCCaOJbNgi5)/FAB/e42b68b0-fe0a-4935-9c4a-fafdb3b71c19_$$_V1_sample_payslip_with_company.pdf"
    ]
      };
      await PostInteractive("interact", finaldecisionlogpayload);
      navigate("/personal-banking/new-application");
      setLoading(false);
      // PostSchema(`${SchemaId.MasterSchema}/instances`, reqData).then((data) => {
      //   console.log("Form submitted successfully", data);
      //   toast.success("Form submitted successfully");
      //   setTimeout(() => {
      //     navigate("/dashboard");
      //   }, 1500);
      // });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      navigate("/personal-banking/new-application");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-950">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="px-6 py-3 flex items-center justify-between bg-white rounded-xl">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Tax Declaration
          </h1>
          <p className="text-gray-600 mb-4">
            Please answer the following questions for tax residency.
          </p>

          <div className="space-y-6 mb-4">
            {/* US Person */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Are you a US person for tax purposes?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.isUSPerson === option
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="isUSPerson"
                      value={option}
                      checked={formData.isUSPerson === option}
                      onChange={(e) =>
                        handleInputChange("isUSPerson", e.target.value)
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tax Resident of Other Country */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Are you a tax resident of a country other than UAE/US?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.isTaxResidentOther === option
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="isTaxResidentOther"
                      value={option}
                      checked={formData.isTaxResidentOther === option}
                      onChange={(e) =>
                        handleInputChange("isTaxResidentOther", e.target.value)
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 bg-white rounded-xl">
          <button
            onClick={handleNext}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              isFormValid()
                ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid() || loading}
          >
            {loading?"Submitting...": "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
