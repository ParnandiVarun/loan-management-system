const cron = require("node-cron");
const Payment = require("../models/Payment");

cron.schedule("0 0 * * *", async () => {
  const today = new Date();

  await Payment.updateMany(
    {
      status: "upcoming",
      dueDate: { $lt: today },
    },
    {
      $set: { status: "overdue" },
    }
  );

  console.log("Overdue EMIs updated");
});

module.exports = cron;
