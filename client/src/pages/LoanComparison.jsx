import React, { useState, useEffect } from "react";
import {
  calcMonthlyPayment,
  calculateTotalPayment,
} from "../utils/calculator.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import API from "../config/api.js";

const LoanComparison = () => {
  const [loanOptions, setLoanOptions] = useState([]);
  const [filters, setFilters] = useState({
    amount: 10000,
    maxRate: 15,
    maxTerm: 60,
    type: "all",
  });

  const [customLoan, setCustomLoan] = useState({
    amount: 10000,
    rate: 8.5,
    term: 36,
    type: "custom",
  });

  useEffect(() => {
    fetchLoanOptions();
  }, []);

  const fetchLoanOptions = async () => {
    try {
      const res = await API.get("/api/loans/options");
      setLoanOptions(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load loan options:",
        err.response?.data || err.message
      );
    }
  };

  const filteredOptions = loanOptions.filter((option) => {
    return (
      (filters.type === "all" || option.type === filters.type) &&
      option.interestRate <= filters.maxRate &&
      option.maxTerm >= filters.maxTerm &&
      filters.amount >= option.minAmount &&
      filters.amount <= option.maxAmount
    );
  });

  const calculateLoanDetails = (option, amount, term) => {
    const monthlyPayment = calcMonthlyPayment(
      amount,
      option.interestRate,
      term
    );
    const totalPayment = calculateTotalPayment(monthlyPayment, term);
    const totalInterest = totalPayment - amount;

    return { monthlyPayment, totalPayment, totalInterest };
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const customLoanDetails = calculateLoanDetails(
    { interestRate: customLoan.rate },
    customLoan.amount,
    customLoan.term
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Loan Comparison Tool</h1>

        {/* Calculator */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="font-bold mb-4">Loan Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              value={filters.amount}
              onChange={(e) =>
                setFilters({ ...filters, amount: Number(e.target.value) || 0 })
              }
              className="border p-2 rounded"
              placeholder="Loan Amount"
            />
            <input
              type="number"
              value={filters.maxRate}
              onChange={(e) =>
                setFilters({ ...filters, maxRate: Number(e.target.value) || 0 })
              }
              className="border p-2 rounded"
              placeholder="Max Interest"
            />
            <input
              type="number"
              value={filters.maxTerm}
              onChange={(e) =>
                setFilters({ ...filters, maxTerm: Number(e.target.value) || 0 })
              }
              className="border p-2 rounded"
              placeholder="Max Term"
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="all">All</option>
              <option value="personal">Personal</option>
              <option value="home">Home</option>
              <option value="auto">Auto</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

        {/* Custom Calculator */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="font-bold mb-4">Custom Loan</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="number"
              value={customLoan.amount}
              onChange={(e) =>
                setCustomLoan({
                  ...customLoan,
                  amount: Number(e.target.value) || 0,
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              value={customLoan.rate}
              onChange={(e) =>
                setCustomLoan({
                  ...customLoan,
                  rate: Number(e.target.value) || 0,
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              value={customLoan.term}
              onChange={(e) =>
                setCustomLoan({
                  ...customLoan,
                  term: Number(e.target.value) || 0,
                })
              }
              className="border p-2 rounded"
            />
          </div>
          <p className="mt-4">
            Monthly: {formatCurrency(customLoanDetails.monthlyPayment)}
          </p>
          <p>Total: {formatCurrency(customLoanDetails.totalPayment)}</p>
          <p>Interest: {formatCurrency(customLoanDetails.totalInterest)}</p>
        </div>

        {/* Loan Options */}
        <div className="bg-white p-6 rounded-lg shadow">
          {filteredOptions.length === 0 ? (
            <p>No matching loans</p>
          ) : (
            filteredOptions.map((option, idx) => {
              const details = calculateLoanDetails(
                option,
                filters.amount,
                Math.min(filters.maxTerm, option.maxTerm)
              );

              return (
                <div key={idx} className="border-b py-4 flex justify-between">
                  <div>
                    <p className="font-bold capitalize">{option.type}</p>
                    <p>{option.interestRate}%</p>
                  </div>
                  <div>{formatCurrency(details.monthlyPayment)} / month</div>
                  <button
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      window.location.href = token
                        ? `/apply?type=${option.type}`
                        : "/login";
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Apply
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoanComparison;
