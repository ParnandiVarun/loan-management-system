import React, { useState } from "react";
import API from "../config/api";

const PaymentSummaryModel = ({ isOpen, onClose, paymentData }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !paymentData) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const statusColors = {
    paid: "bg-green-100 text-green-700",
    upcoming: "bg-yellow-100 text-yellow-700",
    overdue: "bg-red-100 text-red-700",
  };

  const handlePayNow = async () => {
    try {
      setLoading(true);
      await API.post(`/api/payments/${paymentData._id}/pay`, {
        paymentMethod: "online",
      });

      alert("Payment successful!");
      onClose();
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

        <span
          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
            statusColors[paymentData.status]
          }`}
        >
          {paymentData.status.toUpperCase()}
        </span>

        <div className="mt-6 space-y-4">
          <InfoRow label="Amount" value={formatCurrency(paymentData.amount)} />
          <InfoRow label="Due Date" value={formatDate(paymentData.dueDate)} />
          {paymentData.paidDate && (
            <InfoRow
              label="Paid Date"
              value={formatDate(paymentData.paidDate)}
            />
          )}
          {paymentData.paymentMethod && (
            <InfoRow label="Method" value={paymentData.paymentMethod} />
          )}
          {paymentData.paymentNumber && (
            <InfoRow
              label="Installment"
              value={`#${paymentData.paymentNumber}`}
            />
          )}
        </div>

        {(paymentData.status === "upcoming" ||
          paymentData.status === "overdue") && (
          <button
            onClick={handlePayNow}
            disabled={loading}
            className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition ${
              paymentData.status === "overdue"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-50`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b py-2 text-gray-700">
    <span className="font-medium">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default PaymentSummaryModel;
