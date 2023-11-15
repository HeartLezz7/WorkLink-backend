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
  "/:userProfileId",
  authenticateMiddleware,
  transactionController.getTransactionByuserId
);

router.patch(
  "/comfirm/:id",
  authenticateMiddleware,
  transactionController.comfirmstatus
);

router.patch(
  "/reject/:id",
  authenticateMiddleware,
  transactionController.rejectstatus
);

module.exports = router;
