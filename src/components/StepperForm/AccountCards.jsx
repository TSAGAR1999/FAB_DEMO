import {
  Banknote,
  CreditCard,
  Wallet,
  PiggyBank,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const accountTypes = [<Banknote />, <CreditCard />, <Wallet />, <PiggyBank />];

const AccountCards = () => {
  const navigate = useNavigate();
  const { fabAccountTypes,handleAllFormsdata } = useAuth();
  
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-100 to-blue-100 p-7 overflow-y-auto">
      <div className="px-2 py-3 flex items-center space-x-7 rounded-xl mb-3">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-extrabold text-center text-indigo-800">
          💳 Explore FAB Account Types
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {fabAccountTypes.length > 0 &&
          fabAccountTypes.map((account, idx) => {
            const Icon =
              accountTypes[Math.floor(Math.random() * accountTypes.length)];
            return (
              <div
                key={idx}
                onClick={() => {
                  handleAllFormsdata({"selectedAccountType":account})
                  navigate("/verify-email")
                }}
                className="group relative bg-white bg-opacity-30 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-600 text-white p-3 rounded-full shadow-md group-hover:rotate-12 transition-transform">
                    {Icon}
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-900">
                    {account}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  A premium FAB offering tailored to your needs. Click to learn
                  more or apply.
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AccountCards;
