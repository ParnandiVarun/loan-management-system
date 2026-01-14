import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Toast from "../components/Toast.jsx";
import API from "../config/api.js";

const LoanDetails = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const res = await API.get(`/api/loans/${id}`);
      setLoan(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        setToast({
          message: err.response?.data?.error || "Failed to fetch loan details",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      case "approved":
      case "active":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading loan details...</div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h2 className="text-2xl font-bold">Loan Not Found</h2>
          <a href="/dashboard" className="text-blue-600 underline">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {loan.type} Loan Details
            </h1>
            <p>Application ID: {loan._id}</p>
          </div>
          <span className={`px-4 py-2 rounded ${getStatusColor(loan.status)}`}>
            {loan.status}
          </span>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <p>Amount: {formatCurrency(loan.amount)}</p>
          <p>Interest Rate: {loan.interestRate}%</p>
          <p>Term: {loan.term} months</p>
          <p>Monthly EMI: {formatCurrency(loan.monthlyPayment)}</p>
        </div>

        <div className="flex justify-center gap-4">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-gray-600 text-white rounded"
          >
            Back to Dashboard
          </a>
        </div>

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

export default LoanDetails;
