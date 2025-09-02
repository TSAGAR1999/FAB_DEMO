import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function EmploymentDetailsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employmentStatus: "",
    monthlySalary: "",
    emirateArea: "",
    nearestFabBranch: "",
  });
  const {handleAllFormsdata} = useAuth();

  const employmentStatuses = [
    'Employed',
    'Self-employed',
    'Business owner',
    'Student',
    'Retired',
    'Unemployed'
  ];

  const monthlySalaries = [
    'AED 3,000 - AED 5,000',
    'AED 5,000 - AED 10,000',
    'AED 10,000 - AED 15,000',
    'AED 15,000 - AED 25,000',
    'AED 25,000 - AED 50,000',
    'AED 50,000+'
  ];

  const emiratesAreas = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
  ];

  const fabBranches = [
    "Abu Dhabi - Corniche Branch",
    "Abu Dhabi - Marina Mall Branch",
    "Abu Dhabi - Al Wahda Mall Branch",
    "Dubai - DIFC Branch",
    "Dubai - Dubai Mall Branch",
    "Dubai - Jumeirah Beach Road Branch",
    "Dubai - Deira City Centre Branch",
    "Sharjah - City Centre Branch",
    "Sharjah - Mega Mall Branch",
    "Ajman - City Centre Branch",
    "Ras Al Khaimah - RAK Mall Branch",
    "Fujairah - Fujairah Mall Branch",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.employmentStatus &&
      formData.monthlySalary &&
      formData.emirateArea &&
      formData.nearestFabBranch
    );
  };

  const handleNext = () => {
    handleAllFormsdata(formData)
    navigate("/complete-kyc")
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-950">
      <div className="bg-white rounded-xl mx-4 w-full max-w-2xl">
        <div className="px-6 py-3  flex items-center justify-between bg-white rounded-xl">
          <button onClick={()=>navigate("/verify-otp")} className="text-blue-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Employment details
          </h1>

          <p className="text-gray-600 mb-4">
            Tell us about your employment and preferred branch location.
          </p>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Employment Status
              </label>
              <div className="relative">
                <select
                  value={formData.employmentStatus}
                  onChange={(e) =>
                    handleInputChange("employmentStatus", e.target.value)
                  }
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled className="text-gray-400">
                    Select employment status
                  </option>
                  {employmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Monthly Salary
              </label>
              <div className="relative">
                <select
                  value={formData.monthlySalary}
                  onChange={(e) =>
                    handleInputChange("monthlySalary", e.target.value)
                  }
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled className="text-gray-400">
                    Select monthly salary range
                  </option>
                  {monthlySalaries.map((salary) => (
                    <option key={salary} value={salary}>
                      {salary}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Emirate/Area
              </label>
              <div className="relative">
                <select
                  value={formData.emirateArea}
                  onChange={(e) =>
                    handleInputChange("emirateArea", e.target.value)
                  }
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled className="text-gray-400">
                    Select emirate/area
                  </option>
                  {emiratesAreas.map((emirate) => (
                    <option key={emirate} value={emirate}>
                      {emirate}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Nearest FAB Branch */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Nearest FAB Branch
              </label>
              <div className="relative">
                <select
                  value={formData.nearestFabBranch}
                  onChange={(e) =>
                    handleInputChange("nearestFabBranch", e.target.value)
                  }
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled className="text-gray-400">
                    Select nearest branch
                  </option>
                  {fabBranches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
            disabled={!isFormValid()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
