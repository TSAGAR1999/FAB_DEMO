import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OTPApi } from "../../API/Api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nationality: "United Arab Emirates",
    phoneNumber: "",
    email: "",
    confirmEmail: "",
  });

  const {handleAllFormsdata} = useAuth();

  const nationalities = [
    "United Arab Emirates",
    "Saudi Arabia",
    "Kuwait",
    "Qatar",
    "Bahrain",
    "Oman",
    "India",
    "Pakistan",
    "Bangladesh",
    "Philippines",
    "Egypt",
    "Jordan",
    "Lebanon",
    "Syria",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.nationality &&
      formData.phoneNumber &&
      formData.email &&
      formData.confirmEmail &&
      formData.email === formData.confirmEmail
    );
  };

  const mutation = useMutation({
    mutationFn: ({ endpoint, payload }) => OTPApi(endpoint, payload),
    onSuccess: (_) => {
      toast.success("OTP sent to mail successfully");
      navigate("/verify-otp"); 
    },
  });

  const handleContinue = () => {
    let payload = {
    "email": formData.email,
    "userType": "TENANT",
    "provider": "PASSWORD"
    }
    handleAllFormsdata(formData)
    mutation.mutate({ endpoint: "sign-up", payload })
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-950">
      <div className="bg-white rounded-xl shadow-xl">
        <div className="px-6 py-4 flex  bg-white rounded-xl">
          <button
            onClick={() => navigate("/accountlist")}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight lg:text-4xl lg:mb-6">
            Let's get you started
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            First, share your contact details so we can send you secure
            verification codes.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isFormValid()) return;
              handleContinue();
            }}
            className="space-y-6 mb-8"
          >
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Nationality
              </label>
              <div className="relative">
                <select
                  value={formData.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {nationalities.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                required
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Confirm email"
                value={formData.confirmEmail}
                onChange={(e) =>
                  handleInputChange("confirmEmail", e.target.value)
                }
                className={`w-full px-4 py-2 text-gray-900 bg-white border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  formData.confirmEmail &&
                  formData.email !== formData.confirmEmail
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              />
              {formData.confirmEmail &&
                formData.email !== formData.confirmEmail && (
                  <p className="text-red-500 text-sm mt-2">
                    Emails do not match
                  </p>
                )}
            </div>
            <button
              type="submit"
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 lg:py-5 ${
                isFormValid()
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid() || mutation.isPending}
            >
              {mutation.isPending ? "Sending OTP..." : "Next"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
