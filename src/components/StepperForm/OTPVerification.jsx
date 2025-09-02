import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { OTPApi } from "../../API/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function OPTVerification() {
  const length = 6;
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const {allformsData} = useAuth();
  

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  const code = values.join("");
  const isComplete = code.length === length && values.every((v) => v !== "");

  function updateValue(idx, val) {
    const updated = [...values];
    updated[idx] = val;
    setValues(updated);
  }

  function handleChange(idx, val) {
    const next = val.replace(/\D/g, "");
    if (!next) {
      updateValue(idx, "");
      return;
    }
    const chars = next.split("");
    const updated = [...values];
    for (let i = 0; i < chars.length && idx + i < length; i++) {
      updated[idx + i] = chars[i];
    }
    setValues(updated);
    const firstEmpty = updated.findIndex((v, i) => i > idx && v === "");
    const nextIndex =
      firstEmpty !== -1 ? firstEmpty : Math.min(idx + chars.length, length - 1);
    if (inputsRef.current[nextIndex]) inputsRef.current[nextIndex].focus();
  }

  function handleKeyDown(idx, e) {
    if (e.key === "Backspace") {
      if (values[idx] === "") {
        const prev = Math.max(0, idx - 1);
        if (inputsRef.current[prev]) inputsRef.current[prev].focus();
        updateValue(prev, "");
      } else {
        updateValue(idx, "");
      }
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      const prev = Math.max(0, idx - 1);
      if (inputsRef.current[prev]) inputsRef.current[prev].focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      const next = Math.min(length - 1, idx + 1);
      if (inputsRef.current[next]) inputsRef.current[next].focus();
      e.preventDefault();
    }
  }

  function handlePaste(idx, e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    handleChange(idx, pasted);
  }

  const mutation = useMutation({
    mutationFn: ({ endpoint, payload }) => OTPApi(endpoint, payload),
    onSuccess: (_) => {
      toast.success("OTP Verified successfully");
      navigate("/employment-details")
      setValues(Array(length).fill(""));
    },
    onError:(error)=>{
      toast.error(error.response.data.errorMessage);  
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    let payload = {
      email: allformsData?.email,
      userType: "TENANT",
      otp: values.join(""),
    };
    mutation.mutate({ endpoint: "otp-verify", payload });
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center"
      >
        <h1 className="text-2xl font-semibold mb-2">Verify OTP</h1>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit code we sent to your Email
        </p>

        <div className="grid grid-cols-6 gap-3 justify-items-center mb-4">
          {Array.from({ length }).map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              className="w-12 h-14 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={values[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!isComplete || mutation.isPending}
          className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
