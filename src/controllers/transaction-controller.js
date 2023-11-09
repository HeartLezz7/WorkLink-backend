const { TRANSACTIONSTATUS_PENDING } = require("../configs/constants");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloundinary-service");
const fs = require("fs/promises");

exports.createTransaction = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    if (data.type === "withdraw" || data.type === "deposite") {
      const transaction = await prisma.transaction.create({
        data: {
          type: data.type,
          amount: data.amount,
          status: TRANSACTIONSTATUS_PENDING,
          userId: req.user.id,
        },
      });
      console.log(transaction);
      res.status(201).json({
        message: "Success create transaction from /transaction",
        transaction,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllTransaction = async (req, res, next) => {
  try {
    const alltransaction = await prisma.transaction.findMany({});
    res.status(201).json({
      message: "Success Get all transaction from /transaction/alltransaction",
      alltransaction,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionByuserProfileId = async (req, res, next) => {
  try {
    const { userProfileId } = req.params;
    const transactionByuserProfileId = await prisma.transaction.findMany({
      where: {
        userProfileId: +userProfileId,
      },
    });
    res.status(201).json({
      message:
        "Success Get all transaction By userProfileId from /transaction/alltransaction/:userProfileId",
      transactionByuserProfileId,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadSlipImage = async (req, res, next) => {
  try {
    const value = req.params;
    const response = {};

    if (req.file) {
      const url = await upload(req.file.path);
      response.slipImage = url;
    }

    const findUserProfileId = await prisma.transaction.findFirst({
      where: {
        id: +value.id,
      },
    });
    const uploadSlip = await prisma.transaction.update({
      where: {
        id: +value.id,
      },
      data: {
        slipImage: response.slipImage,
      },
    });
    res.status(201).json({
      "Message : Update SlipImage From transaction/slipImage/:id": uploadSlip,
    });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};
