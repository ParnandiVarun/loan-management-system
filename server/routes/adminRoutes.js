const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllLoans,
  updateLoanStatus,
  getAllUsers,
  updateUserRole,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/loans", getAllLoans);
router.put("/loans/:id", updateLoanStatus);

router.get("/users", getAllUsers);
router.put("/users/:id", updateUserRole);

module.exports = router;
