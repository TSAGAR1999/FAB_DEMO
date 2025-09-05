import { useNavigate } from "react-router-dom";
import UploadDocs from "./UploadDocs";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { PostInteractive } from "../../API/Api";
import { agentIds } from "../../Constants";
import { toast } from "react-toastify";

const payload = {
    "agentId": agentIds.kycAgent,
    "query": "",
    "userId": "1",
    "sessionId": "",
    "referenceId": "",
    "edit": false,
    "regenerate": false,
    "streaming": false,
    "overrideConfig": {}
}

export default function KYCCompletion() {
  const navigate = useNavigate();
  const {extractedData,handleAllFormsdata} = useAuth();
  const mutation = useMutation({
        mutationFn: ({ endpoint, payload }) => PostInteractive(endpoint, payload),
        onSuccess: (data) => {
            handleAllFormsdata({"kyc_status":data.text.split(":")[1].trim()})
            navigate("/personal-details")
        },
        onError:(error)=>{
            toast.error(error.message)
            navigate("/personal-details")
        }
    });
  return (
    <div className="h-screen flex mx-auto flex-col items-center justify-center bg-blue-950 p-3">
      <div className="w-full h-[80%] overflow-y-auto max-w-2xl bg-white rounded-xl flex flex-col">
        <div className="px-6 py-3 flex items-center bg-white rounded-xl">
          <button
            onClick={() => navigate("/employment-details")}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
           <h1 className="text-3xl font-bold text-gray-900 ml-4 leading-tight">
            {/* KYC Verification */}
            Upload Documents
           </h1>
        </div>
        <UploadDocs />
        <button
          onClick={() => {
            navigate("/personal-details")
            // payload.query = `emirates_id: ${extractedData.emiratesFront?.["ID Number"]}`
            // mutation.mutate({endpoint:"interact",payload})
          }}
          className={`w-[60%] mx-auto my-2 py-2 px-2 rounded-xl font-semibold text-lg transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 shadow-md`}
        >
          {mutation.isPending ? "Verifying...":"Next"}
        </button>
      </div>
    </div>
  );
}
