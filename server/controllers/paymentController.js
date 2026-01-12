const Payment = require("../models/Payment");
const Loan = require("../models/Loan");
const User = require("../models/User");

const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.loanId,
      userId: req.user.userId,
    });
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const payments = await Payment.find({ loanId: req.params.loanId });
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const processPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const loan = await Loan.findById(payment.loanId);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const user = await User.findById(loan.userId);

    // 1️⃣ Late fee logic
    let lateFee = 0;
    let wasOverdue = false;

    if (payment.status === "overdue") {
      lateFee = payment.amount * 0.02; // 2% penalty
      payment.amount += lateFee;
      wasOverdue = true;
    }

    // 2️⃣ Mark payment as paid
    payment.status = "paid";
    payment.paidDate = new Date();
    payment.paymentMethod = req.body.paymentMethod || "online";
    await payment.save();

    // 3️⃣ Credit score logic
    if (!user.creditScore) user.creditScore = 600;

    if (wasOverdue) {
      user.creditScore -= 20;
    } else {
      user.creditScore += 10;
    }

    await user.save();

    // 4️⃣ Auto-close loan if all EMIs paid
    const remaining = await Payment.find({
      loanId: payment.loanId,
      status: { $ne: "paid" },
    });

    if (remaining.length === 0) {
      loan.status = "closed";
      await loan.save();
    }

    res.json({
      message: "Payment processed successfully",
      lateFeeApplied: wasOverdue,
      lateFee,
      finalAmountPaid: payment.amount,
      creditScore: user.creditScore,
      loanStatus: loan.status,
      payment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPayment, getPayments, updatePayment, processPayment };
