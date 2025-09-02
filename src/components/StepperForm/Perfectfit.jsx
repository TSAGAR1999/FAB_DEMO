import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HandCoins } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { PostInteractive, PostSchema } from '../../API/Api';
import { agentIds } from '../../Constants';
import { toast } from 'react-toastify';

let AgentConsolepayload = {
  agent_name: "AccountIntakeAgent",
  agent_id: "0198e4f4-8bbe-7bdb-8040-864e31efe299",
  last_used: "",
  response_time: "",
  activity_log: "",
  status: "",
};

export default function PerfectFit() {
  const navigate = useNavigate();
  const [workStatus, setWorkStatus] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const { handleFabAccountTypes,handleAllFormsdata } = useAuth();


  const mutation = useMutation({
    mutationFn: ({ endpoint, payload }) => PostInteractive(endpoint, payload),
    onSuccess: (data) => {
      // PostSchema(`${SchemaId.AgentConsole}/instances`, {data:[{...complainceConsole}]})
      let list = JSON.parse(data?.text)
      handleFabAccountTypes(list)  
      navigate('/accounts-list') 
    },
    onError:(error)=>{
      toast.error(error.message)
    }
  });

  const workOptions = [
    'Employed',
    'Self-employed',
    'Business owner',
    'Student',
    'Retired',
    'Unemployed'
  ];

  const incomeOptions = [
    'AED 3,000 - AED 5,000',
    'AED 5,000 - AED 10,000',
    'AED 10,000 - AED 15,000',
    'AED 15,000 - AED 25,000',
    'AED 25,000 - AED 50,000',
    'AED 50,000+'
  ];

  const handleBack = () => {
    navigate('/fab-services');
  };

  const handleNext = () => {
    let payload = {
      "agentId": agentIds.fileRead,
      "query": `need to open a FAB account. I am ${workStatus} with the income between ${monthlyIncome}`,
      "userId": "1",
      "sessionId": "",
      "referenceId": "",
      "edit": false,
      "regenerate": false,
      "streaming": false,
      "fileUrl": [],
      "overrideConfig": {}
    }
    handleAllFormsdata({workStatus,monthlyIncome})
    mutation.mutate({ endpoint: "interact", payload });
  }

  return (
    <div className="flex justify-center items-center bg-blue-950 min-h-screen">
      <div className="bg-white rounded-xl h-[70%] overflow-y-auto">
        <div className="px-6 py-4">
          <button
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6">
          <div className="mb-8 ">
            <HandCoins className="w-16 h-16 text-gray-700" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Let's find your perfect fit!
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            A few quick questions to help us show you the ideal account for you.
          </p>

          <div className="space-y-6 mb-12">
            <div className="relative">
              <select
                value={workStatus}
                onChange={(e) => setWorkStatus(e.target.value)}
                className="w-full px-3 py-3 text-gray-500 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>
                  For work, I am
                </option>
                {workOptions.map((option) => (
                  <option key={option} value={option} className="text-gray-900">
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full px-3 py-3 text-gray-500 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>
                  My monthly income
                </option>
                {incomeOptions.map((option) => (
                  <option key={option} value={option} className="text-gray-900">
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="px-6">
          <button
            onClick={handleNext}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 mb-6 lg:py-5 ${workStatus && monthlyIncome
                ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            disabled={!workStatus || !monthlyIncome || mutation.isPending}
          >
            {mutation.isPending ? "Filtering Accounts..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
