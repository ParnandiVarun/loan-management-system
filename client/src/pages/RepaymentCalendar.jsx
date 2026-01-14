import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import PaymentSummaryModel from "../components/PaymentSummaryModel.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import API from "../config/api.js";

const RepaymentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (selectedLoan) {
      fetchPayments(selectedLoan);
    }
  }, [selectedLoan]);

  const fetchLoans = async () => {
    try {
      const res = await API.get("/api/loans");
      const activeLoans = res.data.filter(
        (loan) => loan.status === "approved" || loan.status === "active"
      );

      setLoans(activeLoans);
      if (activeLoans.length > 0) {
        setSelectedLoan(activeLoans[0]._id);
      }
    } catch (err) {
      console.error("Failed to load loans:", err.response?.data || err.message);
    }
  };

  const fetchPayments = async (loanId) => {
    try {
      const res = await API.get(`/api/payments/${loanId}`);
      setPayments(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load payments:",
        err.response?.data || err.message
      );
    }
  };

  const getPaymentForDate = (date) => {
    return payments.find((payment) => {
      const paymentDate = new Date(payment.dueDate);
      return paymentDate.toDateString() === date.toDateString();
    });
  };

  const getTileClassName = ({ date }) => {
    const payment = getPaymentForDate(date);
    if (!payment) return "";

    switch (payment.status) {
      case "paid":
        return "payment-paid";
      case "overdue":
        return "payment-overdue";
      case "upcoming":
        return "payment-upcoming";
      default:
        return "";
    }
  };

  const getTileContent = ({ date }) => {
    const payment = getPaymentForDate(date);
    if (!payment) return null;

    const statusEmoji = {
      paid: "🟢",
      overdue: "🔴",
      upcoming: "🟡",
    };

    return (
      <div style={{ fontSize: "12px" }}>{statusEmoji[payment.status]}</div>
    );
  };

  const handleDateClick = (date) => {
    const payment = getPaymentForDate(date);
    if (payment) {
      setSelectedPayment(payment);
      setModalOpen(true);
    }
    setSelectedDate(date);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Repayment Calendar</h1>

        {loans.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold">No active loans found</h3>
            <p className="text-gray-500">
              Apply for a loan to see your repayment schedule.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="mr-3 font-medium">Select Loan:</label>
              <select
                value={selectedLoan}
                onChange={(e) => setSelectedLoan(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                {loans.map((loan) => (
                  <option key={loan._id} value={loan._id}>
                    {loan.type} - {formatCurrency(loan.amount)}
                  </option>
                ))}
              </select>
            </div>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              onClickDay={handleDateClick}
              tileClassName={getTileClassName}
              tileContent={getTileContent}
            />

            {payments.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-green-100 p-4 rounded text-center">
                  <div className="text-xl font-bold">
                    {payments.filter((p) => p.status === "paid").length}
                  </div>
                  Paid
                </div>
                <div className="bg-yellow-100 p-4 rounded text-center">
                  <div className="text-xl font-bold">
                    {payments.filter((p) => p.status === "upcoming").length}
                  </div>
                  Upcoming
                </div>
                <div className="bg-red-100 p-4 rounded text-center">
                  <div className="text-xl font-bold">
                    {payments.filter((p) => p.status === "overdue").length}
                  </div>
                  Overdue
                </div>
              </div>
            )}
          </>
        )}

        <PaymentSummaryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          paymentData={selectedPayment}
        />
      </div>

      <Footer />
    </div>
  );
};

export default RepaymentCalendar;
