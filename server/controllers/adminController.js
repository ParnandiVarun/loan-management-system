const Loan = require("../models/Loan");
const User = require("../models/User");
const Payment = require("../models/Payment");

// Get all loans
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate(
      "userId",
      "firstName lastName email"
    );

    const loansWithUserData = loans.map((loan) => ({
      ...loan.toObject(),
      firstName: loan.userId.firstName,
      lastName: loan.userId.lastName,
      email: loan.userId.email,
    }));

    res.json(loansWithUserData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Approve or Reject loan
const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      {
        status,
        progress:
          status === "approved"
            ? "Approved"
            : status === "rejected"
            ? "Rejected"
            : "Under Review",
      },
      { new: true }
    );

    if (!loan) return res.status(404).json({ error: "Loan not found" });

    // Generate EMIs when approved
    if (status === "approved") {
      const startDate = new Date();

      for (let i = 1; i <= loan.term; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        await Payment.create({
          loanId: loan._id,
          amount: loan.monthlyPayment,
          dueDate,
          paymentNumber: i,
          status: "upcoming",
        });
      }
    }

    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllLoans,
  updateLoanStatus,
  getAllUsers,
  updateUserRole,
};
