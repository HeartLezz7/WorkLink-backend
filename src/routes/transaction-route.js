const express = require("express");
const route = express.Router();
const transactionController = require("../controllers/transaction-controller");
const authenticateMiddleware = require("../middlewares/authenticated");
const upload = require("../middlewares/upload");
const uploadMiddleware = require("../middlewares/upload");

route.post(
  "/createtransaction",
  authenticateMiddleware,
  uploadMiddleware.single("slipImage"),
  transactionController.createTransaction
);

route.patch(
  "/slipImage/:id",
  authenticateMiddleware,
  upload.single("slipImage"),
  transactionController.uploadSlipImage
);

route.get(
  "/alltransaction",
  authenticateMiddleware,
  transactionController.getAllTransaction
);

route.get(
  "/:userProfileId",
  authenticateMiddleware,
  transactionController.getTransactionByuserId
);

module.exports = route;
