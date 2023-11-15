const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction-controller");
const authenticateMiddleware = require("../middlewares/authenticated");
const upload = require("../middlewares/upload");
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
  upload.single("slipImage"),
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
