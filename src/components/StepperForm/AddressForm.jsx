import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AddressForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mailingAddress: "",
    buildingName: "",
    streetName: "",
    areaOrLandmark: "",
    flatNo: "",
    city: "",
    emirate: "",
    country: "",
    POBox: "",
    mobileNo: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    emirateCity: "",
  });
  const {handleAllFormsdata} = useAuth();

  const mailingOptions = ["Residential", "Business", "Other"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.addressLine1 &&
      formData.emirateCity
    );
  };

  const handleNext = () => {
    handleAllFormsdata(formData)
    navigate("/tax-declaration");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-950">
      <div className="bg-white rounded-xl h-[85%] overflow-y-auto w-full max-w-2xl">
        <div className="px-6 py-3 flex items-center justify-between bg-white rounded-xl">
          <button
            onClick={() => navigate("/personal-details")}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Residential Address
          </h1>
          <p className="text-gray-600 mb-4">
            Please provide your address details to continue.
          </p>

          <div className="space-y-4 mb-4">
            {/* Mailing Address (Radio) */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Mailing Address Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mailingOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.mailingAddress === option
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="mailingAddress"
                      value={option}
                      checked={formData.mailingAddress === option}
                      onChange={(e) =>
                        handleInputChange("mailingAddress", e.target.value)
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            {[
              { name: "buildingName", label: "Building Name", placeholder: "Enter building name" },
              { name: "streetName", label: "Street Name", placeholder: "Enter street name" },
              { name: "areaOrLandmark", label: "Area Or Landmark", placeholder: "Enter Area" },
              { name: "flatNo", label: "Flat No", placeholder: "Enter Flat No" },
              { name: "city", label: "City", placeholder: "Enter city" },
              { name: "emirate", label: "Emirate", placeholder: "Enter emirate" },
              { name: "POBox", label: "PO Box", placeholder: "Enter PO Box" },
              { name: "addressLine1", label: "Address Line1", placeholder: "Enter Address Line1" },
              { name: "emirateCity", label: "Emirate City", placeholder: "Enter Emirate City" },
            ].map(({ name, label, placeholder, required }) => (
              <div key={name}>
                <label className="block text-gray-600 text-sm mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={formData[name]}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
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
