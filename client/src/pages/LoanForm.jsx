import React, { useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import Toast from "../components/Toast.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  validateRequired,
  validateAmount,
  validateEmail,
  validateIncome,
} from "../utils/validators.jsx";
import { calcMonthlyPayment } from "../utils/calculator.jsx";
import { useNavigate } from "react-router-dom";
import API from "../config/api.js";

const LoanForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    term: "",
    interestRate: 8.5,
    income: "",
    employment: "",
    purpose: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!validateRequired(formData.type))
        newErrors.type = "Loan type is required";
      if (!validateAmount(formData.amount, 1000))
        newErrors.amount = "Amount must be at least ₹1,000";
      if (!validateAmount(formData.term, 6, 360))
        newErrors.term = "Term must be between 6–360 months";
    }

    if (step === 2) {
      if (!validateIncome(formData.income))
        newErrors.income = "Valid income is required";
      if (!validateRequired(formData.employment))
        newErrors.employment = "Employment status is required";
      if (!validateRequired(formData.purpose))
        newErrors.purpose = "Loan purpose is required";
    }

    if (step === 3) {
      if (!validateRequired(formData.firstName))
        newErrors.firstName = "First name is required";
      if (!validateRequired(formData.lastName))
        newErrors.lastName = "Last name is required";
      if (!validateEmail(formData.email))
        newErrors.email = "Valid email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    try {
      await API.post("/api/loans/apply", formData);

      setToast({
        message: "Loan application submitted successfully!",
        type: "success",
      });

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.error?.includes("EMI")
      ) {
        setToast({
          message:
            "For additional loans, please make at least one EMI payment on your existing loan or contact support.",
          type: "warning",
        });
      } else {
        setToast({
          message: err.response?.data?.error || "Application failed",
          type: "error",
        });
      }
    }
  };

  const monthlyPayment =
    formData.amount && formData.term
      ? calcMonthlyPayment(
          parseFloat(formData.amount),
          formData.interestRate,
          parseInt(formData.term)
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <form onSubmit={handleSubmit} className="mt-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Loan Details</h2>

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select Loan Type</option>
                <option value="personal">Personal</option>
                <option value="home">Home</option>
                <option value="auto">Auto</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
              </select>

              <input
                type="number"
                placeholder="Loan Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              />

              <input
                type="number"
                placeholder="Term (months)"
                value={formData.term}
                onChange={(e) =>
                  setFormData({ ...formData, term: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              {monthlyPayment > 0 && (
                <p className="mt-4 font-bold">
                  Estimated EMI: ₹{monthlyPayment.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrev}>
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit">Submit</button>
            )}
          </div>
        </form>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LoanForm;
