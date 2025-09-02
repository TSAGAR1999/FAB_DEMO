import { useCallback, useState } from "react";
import UploadItem from "./UploadItem";


export default function UploadDocs() {
  const docs = [
    { id: "emiratesFront", label: "1. Emirates ID (Front)", desc: "Upload the front side of your Emirates ID.", type: "file", endpoint: "OCR" },
    { id: "emiratesBack", label: "2. Emirates ID (Back)", desc: "Upload the back side of your Emirates ID.", type: "file" },
    { id: "passportPhoto", label: "3. Passport Size Photo", desc: "Upload your recent passport-sized photograph.", type: "file", endpoint: "ImageSimilarity" },
    { id: "signature", label: "4. Signature", desc: "Upload your signature image.", type: "file", endpoint: "SignatureSimilarity" },
    { id: "passport", label: "5. Passport", desc: "Upload your passport.", type: "file", endpoint: "Passport" },
    { id: "payslip", label: "5. Payslip", desc: "Upload your payslip.", type: "file", endpoint: "Payslip" }
  ];

  const [uploadedFilesInfo, setUploadedFilesInfo] = useState({});
  const [files, setFiles] = useState({});

  const handleUploadedFilesInfo = useCallback((id, data) => {
    setUploadedFilesInfo((prev) => {
      let updated = { ...prev, [id]: data }
      // handleExtractedData(updated);
      return updated;
    });
  }, []);

  const handleFiles = useCallback((id, data) => {
    setFiles((prev) => ({ ...prev, [id]: data }));
  }, [files]);


  return (
    <div className="space-y-4 p-4">
      {docs.map((doc) => (
        <UploadItem key={doc.id} doc={doc} handleUploadedFilesInfo={handleUploadedFilesInfo} file={files[doc.id]} files={files} handleFiles={handleFiles} />
      ))}
    </div>
  );
}
