import { Upload, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { PostFabDocs, PostInteractive, UploadFiles } from "../../API/Api";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { agentIds } from "../../Constants";

export default function UploadItem({
    doc,
    handleUploadedFilesInfo,
    file,
    files,
    handleFiles,
}) {
    const {handleExtractedData,handleAllFormsdata} = useAuth();
    const mutation = useMutation({
        mutationFn: ({ endpoint, formData }) => endpoint === "interact" ? PostInteractive(endpoint, formData) : PostFabDocs(endpoint, formData),
        onSuccess: (data) => {
            let {document_id,document_status,documents_submitted,upload_method,verification_status,...obj} = JSON.parse(data.text);
            handleExtractedData({[doc.id]:obj})
            handleAllFormsdata({"docbundle":{document_id,document_status,documents_submitted,upload_method,verification_status}})
            handleUploadedFilesInfo(doc.id, data);
        },
        onError:(error)=>{
            toast.error(error.message);
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        handleFiles(doc.id, file);
    };

    useEffect(() => {
        if (!file) return;

        const uploadDocument = async () => {
            const formData = new FormData();

            switch (doc.endpoint) {
                case "Passport":
                    try {
                        formData.append("file", files[doc.id]);
                        const contentResponse = await UploadFiles("upload?filePath=FAB",formData);
                        if (contentResponse.msg == "Success") {
                            toast.success("Uploaded file to content service");
                            let formData = {
                                "agentId": agentIds.extractionAgent,
                                "query": "analyze above image wisely, extract and give me usefull information and no extra words",
                                "userId": "1",
                                "sessionId": "",
                                "referenceId": "",
                                "edit": false,
                                "regenerate": false,
                                "streaming": false,
                                "fileUrl": [
                                    `https://cdn.gov-cloud.ai/${contentResponse.cdnUrl}`
                                ],
                                "overrideConfig": {}
                            }
                            mutation.mutate({ endpoint: "interact", formData });
                        } else {
                            console.error("Content service failed", contentResponse);
                        }
                    } catch (error) {
                        toast.error(error.message);
                    }
                    break;

                case "OCR":
                    try {
                        formData.append("file", files[doc.id]);
                        const contentResponse = await UploadFiles("upload?filePath=FAB",formData);
                        if (contentResponse.msg == "Success") {
                            toast.success("Uploaded file to content service");
                            let formData = {
                                "agentId": agentIds.extractionAgent,
                                "query": "analyze above image wisely, extract and give me usefull information and no extra words",
                                "userId": "1",
                                "sessionId": "",
                                "referenceId": "",
                                "edit": false,
                                "regenerate": false,
                                "streaming": false,
                                "fileUrl": [
                                    `https://cdn.gov-cloud.ai/${contentResponse.cdnUrl}`
                                ],
                                "overrideConfig": {}
                            }
                            mutation.mutate({ endpoint: "interact", formData });
                        } else {
                            console.error("Content service failed", contentResponse);
                        }
                    } catch (error) {
                        toast.error(error.message);
                    }
                    break;

                case "SignatureSimilarity":
                    formData.append("emirateBackSide", files["emiratesBack"]);
                    formData.append("userSignature", files["signature"]);
                    mutation.mutate({ endpoint: doc.endpoint, formData });
                    break;

                case "ImageSimilarity":
                    formData.append("primaryUserImage", files["emiratesFront"]);
                    formData.append("secondaryUserImage", files["passportPhoto"]);
                    mutation.mutate({ endpoint: doc.endpoint, formData });
                    break;
            }
        };

        uploadDocument();
    }, [file]);

    return (
        <div
            key={doc.id}
            className="border-[0.14vw] border-dashed border-gray-300 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-blue-400 hover:bg-blue-50 transition"
        >
            <div className="mb-3 sm:mb-0">
                <p className="font-medium text-gray-800">{doc.label}</p>
                <p className="text-xs text-gray-500 mt-1">{doc.desc}</p>

                {mutation.isSuccess && (
                    <p className="text-xs text-green-700 mt-2">
                        Uploaded: {mutation.data?.fileName || "Success"}
                    </p>
                )}
                {mutation.isError && (
                    <p className="text-xs text-red-700 mt-2">Upload failed</p>
                )}
            </div>

            {doc.type === "file" && (
                <label className="flex items-center gap-2 cursor-pointer bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded">
                    {mutation.isPending ? (
                        <Loader className="w-6 h-6 animate-spin text-blue-500" />
                    ) : (
                        <Upload size={16} />
                    )}
                    {mutation.isPending ? "Uploading..." : "Upload Document"}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
            )}
        </div>
    );
}
