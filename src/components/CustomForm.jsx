import { Formik, Form } from "formik";
import * as Yup from "yup";
import { newaccountFormConfig, SchemaId, teams } from "../Constants";
import DynamicInputField from "./StepperForm/DynamicInput";
import { PostSchema } from "../API/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';

function generateRandomUniqueId() {
  const prefix = "FAB";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000);
  const paddedSeq = String(random).padStart(6, "0");
  return `${prefix}-${year}-${paddedSeq}`;
}

const CustomForm = ({ extractedData, formikRef }) => {
  console.log("Extracted Data:", extractedData);
  const navigate = useNavigate();
  const initialValues = {
    "accountTitle": "",
    "account_Type": "",
    "etihadGuestNo": "",
    "etihadGuestStatus": "",
    "accountNature": "",
    "accountCurrency": "",
    "chequeBook": "",
    "debitCard": "",
    "nameOfAnyOtherAccountWithFirstAbuDhabiBank": "",
    "accountNo": "",
    "nameAsItShouldAppearOnCard": "",
    "prefix": "",
    // "fullName": "",
    "nationality": "",
    "countryOfResidence": "",
    "dateOfBirth": "",
    "residenceStatus": "",
    "passportNo": "",
    "passportExpiryDate": "",
    "residenceVisaNo": "",
    "visaExpiryDate": "",
    // "emiratesIDNo": "",
    "EIDExpiryDate": "",
    "mailingAddress": "",
    "buildingName": "",
    "streetName": "",
    "areaOrLandmark": "",
    "flatNo": "",
    "emirate": "",
    "city": "",
    "country": "",
    "POBox": "",
    "mobileNo": "",
    "email": "",
    "addressLine1": "",
    "addressLine2": "",
    "emirateCity": "",
    // "purposeOfTheAccount": "",
    "sourceOfIncome": "",
    "specifyEmployer": "",
    "specificCompanyNameAndTradeLicense": "",
    // "expectedTypeOfAccountActivity": "",
    "EstimatedAmountTurnover": "",
    //EstimatedSpendperMonth:""
  }

  const prefilledValues = useMemo(() => {
    if (Object.keys(extractedData).length === 0) return initialValues;

    return {
      ...initialValues,
      // from passport
      passportNo: extractedData?.passport?.passport_number,
      // fullName: extractedData?.passport?.full_name || "",
      // nationality: extractedData?.passport?.nationality || "",
      dateOfBirth: extractedData?.passport?.birth_date || "",
      passportExpiryDate: extractedData?.passport?.expiry_date || "",
      // from emiratesFront
      emiratesIDNo: extractedData?.emiratesFront?.id_number || "",
      // If Emirates ID name looks more reliable, prefer it over passport full name
      fullName:
        extractedData?.emiratesFront?.name ||
        extractedData?.passport?.full_name ||
        "",
      nationality:
        extractedData?.emiratesFront?.nationality ||
        extractedData?.passport?.nationality ||
        "",
    };
  }, [extractedData]);

  const validationSchema = Yup.object({
    accountTitle: Yup.string().required("Required*"),
    account_Type: Yup.string().required("Required*"),
    accountNature: Yup.string().required("Required*"),
    accountCurrency: Yup.string().required("Required*"),
    fullName: Yup.string().required("Required*"),
    nationality: Yup.string().required("Required*"),
    countryOfResidence: Yup.string().required("Required*"),
    dateOfBirth: Yup.date().required("Required*"),
    passportNo: Yup.string().required("Required*"),
    passportExpiryDate: Yup.date().required("Required*"),
    emiratesIDNo: Yup.string().required("Required*"),
    EIDExpiryDate: Yup.date().required("Required*"),
    mobileNo: Yup.string().required("Required*"),
    email: Yup.string().email("Invalid email").required("Required*"),
    purposeOfTheAccount: Yup.string().required("Required*"),
    sourceOfIncome: Yup.string().required("Required*"),
  });


  const handleSubmit = async (values, { resetForm }) => {
    values.id = generateRandomUniqueId();
    values.date = new Date().toISOString().slice(0, 10);
    values.accountServies = [
      {
        "Cheque Book": values.chequeBook,
        "Debit Card": values.debitCard
      }
    ];
    const filterData = {
      data: [{
        "residency_status": values.residenceStatus,
        "full_name": values.fullName,
        "nationality": values.nationality,
        "contact_details": {
          "city": values.city,
          "country": values.country,
          "email": values.email,
          "mobile": values.mobileNo,
          "po_box": values.POBox,
          "address": values.addressLine1
        },
        "customer_id":uuidv4(),
        "application_id": values.id,
        "emirates_id": values.emiratesIDNo,
        "created_at": `${Date.now()}`,
      }]
    }
    delete values.chequeBook;
    delete values.debitCard;

    const reqData = {
      data: [values]
    };

    const randomIndex = Math.floor(Math.random() * teams.length);

    const personalBankAccountApplicationData = {
      data: [{
        "account_type": values.account_Type,
        "assigned_ops_team": teams[randomIndex],
        "application_status": "In Progress",
        "application_id": values.id,
        "submission_date": `${Date.now()}`,
        "sla_due_date": `${Date.now()}`,
        "kyc_status": "Pending"
      }]

    }
    PostSchema(`${SchemaId.PersonalBankAccountApplication}/instances`, personalBankAccountApplicationData).then(data => {
      console.log("Posted to personalBankAccountApplicationData successfully", data);
    })
    PostSchema(`${SchemaId.CustomerProfile}/instances`, filterData).then(data => {
      console.log("Posted to Customers successfully", data);
    })
    PostSchema(`${SchemaId.MasterSchema}/instances`, reqData).then(data => {
      console.log("Form submitted successfully", data);
      toast.success("Form submitted successfully");
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    })
    resetForm({ values: initialValues });
  };

  return (
    <div className="bg-white rounded-lg p-6">

      <Formik
        innerRef={formikRef}
        initialValues={prefilledValues}
        enableReinitialize //required to update when extractedData changes
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => (
          <>
            <div className="bg-[#1677ff] flex items-center p-2 rounded-lg mb-2 space-x-3">
              <img src="/Images/fab-logo.svg" alt="fab-logo" className="w-[4vw] aspect-square" />
              <h2 className="text-2xl font-bold text-[#ffffff]">FAB Account Opening Form</h2>
            </div>

            <Form className="space-y-6">

              <h4 className="text-xl text-[#1677ff] my-3">Account Information</h4>

              {newaccountFormConfig["AccountInfo"].map((field) => {
                return (
                  <DynamicInputField
                    key={field.name}
                    field={field}
                    values={values}
                  />
                );
              })}

              <h4 className="text-xl text-[#1677ff] my-3">Applicant Details</h4>

              {newaccountFormConfig["ApplicationDetails"].map((field) => {
                return (
                  <DynamicInputField
                    key={field.name}
                    field={field}
                    values={values}
                  />
                );
              })}

              <h4 className="text-xl text-[#1677ff] mb-3">Basic Information</h4>

              {newaccountFormConfig["BasicInfo"].map((field) => {
                return (
                  <DynamicInputField
                    key={field.name}
                    field={field}
                    values={values}
                  />
                );
              })}

              <h4 className="text-xl text-[#1677ff] mb-3">Identification Details</h4>

              {newaccountFormConfig["Identification"].map((field) => {
                return (
                  <DynamicInputField
                    key={field.name}
                    field={field}
                    values={values}
                  />
                );
              })}

              <h4 className="text-xl text-[#1677ff] mb-3">Communication Details</h4>

              {newaccountFormConfig["Communication"].map((field) => {
                return (
                  <DynamicInputField
                    key={field.name}
                    field={field}
                    values={values}
                  />
                );
              })}

              <h4 className="text-xl text-[#1677ff] mb-3">Customer Profile</h4>

              {newaccountFormConfig["CustomerProfile"].map((field) => {
                return (
                  <DynamicInputField
                    key={field.name}
                    field={field}
                    values={values}
                  />
                );
              })}

            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CustomForm;

