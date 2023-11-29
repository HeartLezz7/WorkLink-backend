const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction-controller");
const authenticateMiddleware = require("../middlewares/authenticated");
const uploadMiddleware = require("../middlewares/upload");

router.post(
  "/createtransaction",
  authenticateMiddleware,
  uploadMiddleware.single("slipImage"),
  transactionController.createTransaction
);

router.patch(
  "/slipImage/:id",
  authenticateMiddleware,
  uploadMiddleware.single("slipImage"),
  transactionController.uploadSlipImage
);

router.get(
  "/alltransaction",
  authenticateMiddleware,
  transactionController.getAllTransaction
);

router.get(
  "/getme/:userId",
  authenticateMiddleware,
  transactionController.getTransactionByuserId
);

router.patch(
  "/deposit/:id",
  authenticateMiddleware,
  transactionController.deposit
);

router.patch(
  "/reject/:id",
  authenticateMiddleware,
  transactionController.rejectstatus
);

router.patch(
  "/walletupdate/:id",
  authenticateMiddleware,
  transactionController.walletupdate
);

router.patch(
  "/withdraw/:id",
  authenticateMiddleware,
  uploadMiddleware.single("slipImage"),
  transactionController.withdraw
);

router.get(
  "/pendingStatus",
  authenticateMiddleware,
  transactionController.pendingStatus
);

module.exports = router;
