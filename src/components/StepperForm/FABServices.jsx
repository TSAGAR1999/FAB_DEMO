import { ChevronRight, Banknote, CreditCard, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FABServices = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-950">
      <div className="bg-white rounded-xl">
        <div className="px-6 py-6 lg:px-8 lg:pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-tight lg:text-4xl lg:mb-10">
            Which FAB product would you like?
          </h1>

          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <div onClick={()=>navigate("/account-fit")} className="bg-white p-6 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 cursor-pointer lg:p-8">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center lg:w-16 lg:h-16">
                  <Banknote className="w-6 h-6 text-gray-600 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">
                  Accounts
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 lg:w-6 lg:h-6" />
            </div>

            <div className="border-b border-gray-200"></div>

            <div className="bg-white p-6 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 cursor-pointer lg:p-8">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center lg:w-16 lg:h-16">
                  <CreditCard className="w-6 h-6 text-gray-600 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">
                  Credit Cards
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 lg:w-6 lg:h-6" />
            </div>

            <div className="border-b border-gray-200"></div>

            <div className="bg-white p-6 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 cursor-pointer lg:p-8">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center lg:w-16 lg:h-16">
                  <Coins className="w-6 h-6 text-gray-600 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">
                  Personal loan
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FABServices;
