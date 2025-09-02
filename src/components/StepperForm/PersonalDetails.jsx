import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prefix: "",
    fullName: "",
    nationality: "",
    countryOfResidence: "",
    dateOfBirth: "",
    emiratesIDNo: "",
    purposeOfTheAccount: "",
    expectedTypeOfAccountActivity: "",
    EstimatedSpendperMonth: "",
  });
  const { handleAllFormsdata, extractedData, allformsData } = useAuth();

  useEffect(() => {
    if (Object.keys(extractedData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        fullName:
          extractedData?.emiratesFront?.Name ||
          extractedData?.passport?.Name ||
          prev.fullName,
        nationality:
          extractedData?.emiratesFront?.Nationality ||
          extractedData?.passport?.Nationality ||
          prev.nationality,
        countryOfResidence:
          extractedData?.emiratesFront?.["Passport Country"] ||
          extractedData?.passport?.["Passport Country"] ||
          prev.countryOfResidence,
        dateOfBirth: extractedData?.passport?.["Date of Birth"]
          ? formatDate(extractedData?.passport["Date of Birth"])
          : prev.dateOfBirth,
        emiratesIDNo:
          extractedData?.emiratesFront?.["ID Number"] || prev.emiratesIDNo,
      }));
    }
  }, []);

  useEffect(() => {
    console.log("allformsData.workStatus", allformsData.workStatus);
  }, [allformsData.workStatus]);

  const formatDate = (dob) => {
    const [day, month, year] = dob.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const prefixOptions = ["Mr", "Mrs", "Miss", "Others"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.prefix &&
      formData.fullName &&
      formData.nationality &&
      formData.countryOfResidence &&
      formData.dateOfBirth &&
      formData.emiratesIDNo &&
      formData.purposeOfTheAccount &&
      formData.expectedTypeOfAccountActivity &&
      formData.EstimatedSpendperMonth
    );
  };

  const handleNext = () => {
    // console.log("Personal details form submitted:", formData);
    handleAllFormsdata(formData);
    navigate("/address-form");
    // Navigate to next step
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-950">
      <div className="w-full max-w-2xl bg-white rounded-xl h-[85%] overflow-y-auto">
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
            Personal details
          </h1>

          <p className="text-gray-600 mb-4">
            Please provide your personal information to continue.
          </p>

          <div className="space-y-4 mb-4">
            {/* Prefix */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Prefix</label>
              <div className="grid grid-cols-2 gap-2">
                {prefixOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.prefix === option
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="prefix"
                      value={option}
                      checked={formData.prefix === option}
                      onChange={(e) =>
                        handleInputChange("prefix", e.target.value)
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                placeholder="Enter nationality"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* emiratesIDNo */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Emirates ID
              </label>
              <input
                type="text"
                value={formData.emiratesIDNo}
                onChange={(e) =>
                  handleInputChange("emiratesIDNo", e.target.value)
                }
                placeholder="Enter Emirates ID"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* purposeOfTheAccount */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Purpose of the Account
              </label>
              <input
                type="text"
                value={formData.purposeOfTheAccount}
                onChange={(e) =>
                  handleInputChange("purposeOfTheAccount", e.target.value)
                }
                placeholder="Enter purpose"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {allformsData.workStatus === "Business owner" && (
              <>
                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    Trade License Number
                  </label>
                  <input
                    type="text"
                    // value={formData.purposeOfTheAccount}
                    onChange={(e) =>
                      handleInputChange("Trade_License_Number", e.target.value)
                    }
                    placeholder="Enter License Number"
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    Company Name And Legal Form
                  </label>
                  <input
                    type="text"
                    // value={formData.purposeOfTheAccount}
                    onChange={(e) =>
                      handleInputChange(
                        "Company_Name_And_Legal_Form",
                        e.target.value
                      )
                    }
                    placeholder="Enter purpose"
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* expectedTypeOfAccountActivity */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Expected Activity <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-4">
                {["Deposits", "Withdrawals", "Transfers"].map((opt) => {
                  return (
                    <div key={opt} className="flex items-center gap-2">
                      <input
                        id={opt}
                        type="radio"
                        name="expectedTypeOfAccountActivity"
                        value={opt}
                        checked={formData.expectedTypeOfAccountActivity === opt}
                        onChange={(e) =>
                          handleInputChange(
                            "expectedTypeOfAccountActivity",
                            e.target.value
                          )
                        }
                        className="form-radio text-blue-500"
                      />
                      <label htmlFor={opt}>{opt}</label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EstimatedSpendperMonth */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Estimated Spend Per Month{" "}
              </label>
              <input
                type="text"
                value={formData.EstimatedSpendperMonth}
                onChange={(e) =>
                  handleInputChange("EstimatedSpendperMonth", e.target.value)
                }
                placeholder="Enter amount"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Country of Residence */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Country of Residence
              </label>
              <input
                type="text"
                value={formData.countryOfResidence}
                onChange={(e) =>
                  handleInputChange("countryOfResidence", e.target.value)
                }
                placeholder="Enter country of residence"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Residence Status */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Residence Status
              </label>
              <input
                type="text"
                value={formData.residenceStatus}
                onChange={(e) =>
                  handleInputChange("residenceStatus", e.target.value)
                }
                placeholder="Enter residence status"
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
