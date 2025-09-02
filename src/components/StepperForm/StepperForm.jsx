import { useRef, useState } from 'react';
import { Button, Steps } from 'antd';
import CustomForm from '../CustomForm';
import UploadDocs from './UploadDocs';
import { toast } from 'react-toastify';

const StepperForm = () => {
  const [current, setCurrent] = useState(0);
  const [extractedData, setExtractedData] = useState({});
  const formikRef = useRef();

  const steps = [
    {
      title: 'Upload Documents',
      content: <UploadDocs handleExtractedData={(data) => setExtractedData(data)} />,
    },
    {
      title: 'Account Opening Form',
      content: <CustomForm extractedData={extractedData} formikRef={formikRef} />,
    }
  ];
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  const contentStyle = {
    marginTop: "0.5vw",
    height: "80%",
  };
  return (
    <div className="p-6 h-screen flex flex-col items-center bg-blue-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl h-full">
        <Steps current={current} items={items} />
        <div className='overflow-y-auto' style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={async () => {
              const errors = await formikRef.current.validateForm();
              formikRef.current.setTouched(
                Object.keys(formikRef.current.initialValues).reduce(
                  (acc, key) => ({ ...acc, [key]: true }),
                  {}
                )
              );
              if (Object.keys(errors).length > 0) {
                toast.error("Please fill all required fields");
                return;
              }
              formikRef.current.submitForm()
            }}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>

    </div>
  );
};
export default StepperForm;