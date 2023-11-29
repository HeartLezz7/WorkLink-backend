const { picture } = require("../configs/cloudinary");
const {
  TRANSACTIONSTATUS_PENDING,
  TRANSACTIONSTATUS_APPROVE,
  TRANSACTIONSTATUS_REJECT,
} = require("../configs/constants");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloundinary-service");
const fs = require("fs/promises");

exports.createTransaction = async (req, res, next) => {
  try {
    if (req.file?.path) {
      const url = await upload(req.file.path);

      req.body.slipImage = url;
    }
    const data = req.body;
    if (data.type === "withdraw" || data.type === "deposit") {
      const transaction = await prisma.transaction.create({
        data: {
          type: data.type,
          amount: data.amount,
          slipImage: data.slipImage,
          status: TRANSACTIONSTATUS_PENDING,
          userId: req.user.id,
        },
      });
      res.status(201).json({
        message: "Success create transaction from /transaction",
        transaction,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path);
    }
  }
};

exports.getTransactionByuserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: +userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(201).json({
      message:
        "Success Get all transaction By userProfileId from /transaction/alltransaction/:userProfileId",
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

exports.pendingStatus = async (req, res, next) => {
  try {
    const getpendding = await prisma.transaction.findMany({
      where: {
        status: "pending",
      },
      include: {
        work: true,
        user: {
          select: {
            id: true,
            firstName: true,
            wallet: true,
            lastName: true,
            authUser: {
              select: {
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(201).json({ getpendding });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransaction = async (req, res, next) => {
  try {
    const alltransaction = await prisma.transaction.findMany({
      include: {
        work: true,
        user: {
          select: {
            id: true,
            firstName: true,
            wallet: true,
            lastName: true,
            profileImage: true,
            authUser: {
              select: {
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(201).json({ alltransaction });
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
    res.status(201).json({ transactionByuserProfileId });
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

exports.deposit = async (req, res, next) => {
  try {
    const comfirmSlip = await prisma.transaction.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: TRANSACTIONSTATUS_APPROVE,
      },
    });
    res.status(201).json({ comfirmSlip });
  } catch (error) {
    next(error);
  }
};

exports.rejectstatus = async (req, res, next) => {
  try {
    const value = req.body;
    const reject = await prisma.transaction.update({
      where: {
        id: +req.params.id,
      },
      data: {
        comment: value.comment,
        status: TRANSACTIONSTATUS_REJECT,
      },
    });
    res.status(201).json({ reject });
  } catch (error) {
    next(error);
  }
};

exports.walletupdate = async (req, res, next) => {
  try {
    const money = req.body;
    const wallet = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        wallet: money.wallet,
      },
    });
    res.status(201).json({ wallet });
  } catch (error) {
    next(error);
  }
};

exports.withdraw = async (req, res, next) => {
  try {
    if (req.file?.path) {
      const url = await upload(req.file.path);
      req.body.slipImage = url;
    }
    const value = req.body;
    const deposit = await prisma.transaction.update({
      where: {
        id: +req.params.id,
      },
      data: {
        slipImage: value.slipImage,
        status: TRANSACTIONSTATUS_APPROVE,
      },
    });
    res.status(201).json({ deposit });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};
