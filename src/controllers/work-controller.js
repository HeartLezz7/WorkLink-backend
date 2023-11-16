const {
  STATUS_WORK_ADMINREVIEW,
  STATUS_WORK_CANCEL,
  STATUS_WORK_FINDING,
  TRANSACTIONTYEP_TRENSFER,
  TRANSACTIONSTATUS_PENDING,
  TRANSACTIONTYEP_RECIEVE,
  TRANSACTIONSTATUS_APPROVE,
  STATUS_WORK_SUCCESS,
} = require("../configs/constants");
const prisma = require("../models/prisma");
const fs = require("fs/promises");
const { upload } = require("../utils/cloundinary-service");
const createError = require("../utils/create-error");
const { picture } = require("../configs/cloudinary");
const { error } = require("console");

exports.createWork = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);

    if (req.file?.path) {
      const url = await upload(req.file.path);
      data.workImage = url;
    }
    if (data.startDate) {
      data.startDate = data.startDate + "T00:00:00Z";
    }
    if (data.endDate) {
      data.endDate = data.endDate + "T00:00:00Z";
    }
    if (+data.isOnsite) {
      data.isOnsite = true;
    } else {
      data.isOnsite = false;
    }
    console.log(data.endDate, "-------");
    const createWork = await prisma.work.create({
      data: {
        title: data.title,
        description: data.description,
        price: +data.price,
        isOnsite: data.isOnsite,
        addressLat: data.addressLat,
        addressLong: data.addressLong,
        startDate: data.startDate,
        endDate: data.endDate,
        statusWork: STATUS_WORK_ADMINREVIEW,
        ownerId: req.user.id,
        categoryId: +data.categoryId,
        workImage: data.workImage,
      },
    });
    res.status(201).json({ createWork });
  } catch (err) {
    next(err);
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path);
    }
  }
};

exports.editWork = async (req, res, next) => {
  try {
    console.log(req.body);
    const data = req.body;
    if (!data.startDate.includes("T00")) {
      data.startDate = data.startDate + "T00:00:00Z";
    }
    if (!data.endDate.includes("T00")) {
      data.endDate = data.endDate + "T00:00:00Z";
    }
    const editedWork = await prisma.work.update({
      where: {
        id: data.id,
      },
      data: {
        description: data.description,
        price: +data.price,
        startDate: data.startDate,
        endDate: data.endDate,
        isOnsite: +data.isOnsite,
        addressLat: data.addressLat,
        addressLong: data.addressLong,
      },
      include: {
        challenger: true,
        category: true,
      },
    });
    // console.log(value);
    res.status(201).json({ editedWork });
  } catch (err) {
    next(err);
  }
};

exports.cancleWork = async (req, res, next) => {
  try {
    console.log("first");
    const { workId } = req.params;
    const cancleWork = await prisma.work.update({
      where: {
        id: +workId,
      },
      data: {
        statusWork: STATUS_WORK_CANCEL,
      },
      include: {
        challenger: true,
        category: true,
      },
    });
    res.status(201).json({ cancleWork });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllWork = async (req, res, next) => {
  try {
    const allWork = await prisma.work.findMany({
      include: {
        challenger: true,
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(201).json({ allWork });
  } catch (err) {
    next(err);
  }
};

exports.getDelegatedWorkById = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const work = await prisma.work.findUnique({
      where: {
        id: +workId,
      },
      include: {
        challenger: {
          include: {
            user: true,
          },
        },
        category: true,
        chatRoom: true,
        report: true,
        transaction: true,
        review: true,
      },
    });
    res.status(201).json({ work });
  } catch (err) {
    next(err);
  }
};

exports.deleteWork = async (req, res, next) => {
  try {
    const deleteWork = await prisma.work.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.status(201).json({ message: `Delete ${deleteWork} Success` });
  } catch (err) {
    next(err);
  }
};

exports.createworkCategories = async (req, res, next) => {
  try {
    const value = req.body;
    console.log(value);
    const workCategories = await prisma.workCategories.create({
      data: {
        category: value.category,
      },
    });
    res.status(201).json({ workCategories });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const allCategories = await prisma.workCategories.findMany({});
    console.log(allCategories);
    res.status(201).json({ allCategories });
  } catch (error) {
    next(error);
  }
};

exports.createChallenger = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const findWorkid = await prisma.challenger.findFirst({
      where: {
        AND: { workId: +workId, userId: req.user.id },
      },
    });

    if (findWorkid) {
      return next(createError("You have Submit this workID"));
    }

    const createChallenger = await prisma.challenger.create({
      data: {
        workId: +workId,
        userId: req.user.id,
      },
    });
    res.status(200).json({
      Message: "Success Create Challenger /work/challenger/:workid",
      createChallenger,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteChallenger = async (req, res, next) => {
  try {
    const { workId } = req.params;
    const existChallenger = await prisma.challenger.findFirst({
      where: {
        AND: [{ workId: +workId }, { userId: req.user.id }],
      },
    });
    if (!existChallenger) {
      return res.status(404).json({ error: "Challenger not found" });
    }
    const deleteChallenger = await prisma.challenger.delete({
      where: {
        id: existChallenger.id,
      },
    });
    res.status(200).json({ deleteChallenger });
  } catch (error) {
    next(error);
  }
};

exports.getSignWork = async (req, res, next) => {
  try {
    const mySignWork = await prisma.challenger.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        work: true,
      },
    });
    res.status(200).json({ mySignWork });
    // console.log(data);
  } catch (error) {
    next(error);
  }
};

exports.waitingreview = async (req, res, next) => {
  try {
    const reviewWork = await prisma.work.findMany({
      where: {
        statusWork: STATUS_WORK_ADMINREVIEW,
      },
      include: {
        challenger: true,
        category: true,
      },
    });
    res.status(201).json({ reviewWork });
  } catch (err) {
    next(err);
  }
};

exports.updatereview = async (req, res, next) => {
  try {
    const work = req.params;
    const reviewed = await prisma.work.update({
      where: {
        id: +work.id,
      },
      data: {
        statusWork: STATUS_WORK_FINDING,
      },
    });
    res.status(201).json({ reviewed });
  } catch (err) {
    next(err);
  }
};

exports.cancelWork = async (req, res, next) => {
  try {
    const work = req.params;
    const rejectwork = await prisma.work.update({
      where: {
        id: +work.id,
      },
      data: {
        statusWork: STATUS_WORK_CANCEL,
      },
    });
    res.status(201).json({ rejectwork });
  } catch (err) {
    next(err);
  }
};

exports.makeDealWork = async (req, res, next) => {
  try {
    const { workId, workStatus, workerId } = req.body;
    console.log(req.body);
    console.log(req.user);
    const foundWork = await prisma.work.findFirst({ where: { id: +workId } });
    if (!foundWork) {
      return createError("not found work", 401);
    }
    const foundOwner = await prisma.user.findFirst({
      where: { id: req.user.id },
    });
    if (!foundOwner) {
      return createError("not found user", 401);
    }
    const [updateStatus, createTransaction, updateWallet] =
      await prisma.$transaction([
        prisma.work.update({
          where: { id: foundWork.id },
          data: { statusWork: workStatus, workerId },
        }),
        prisma.transaction.create({
          data: {
            type: TRANSACTIONTYEP_TRENSFER,
            amount: foundWork.price,
            status: TRANSACTIONSTATUS_PENDING,
            userId: req.user.id,
            workId: +workId,
          },
        }),
        prisma.user.update({
          where: { id: req.user.id },
          data: { wallet: +foundOwner.wallet - +foundWork.price },
        }),
      ]);

    console.log(updateStatus, "A");
    console.log(createTransaction, "B");
    console.log(updateWallet, "C");

    res.status(201).json({ updateStatus, createTransaction, updateWallet });
  } catch (err) {
    next(err);
  }
};

exports.acceptWork = async (req, res, next) => {
  try {
    const { workId, workStatus, workerId } = req.body;
    console.log(req.body);
    console.log(req.user);
    const foundWork = await prisma.work.findFirst({ where: { id: +workId } });
    if (!foundWork) {
      return createError("not found work", 401);
    }
    const foundOwner = await prisma.user.findFirst({
      where: { id: req.user.id },
    });
    if (!foundOwner) {
      return createError("not found user", 401);
    }
    const [updateStatus, createTransaction] = await prisma.$transaction([
      prisma.work.update({
        where: { id: foundWork.id },
        data: { statusWork: workStatus, workerId },
      }),
      prisma.transaction.create({
        data: {
          type: TRANSACTIONTYEP_RECIEVE,
          amount: foundWork.price,
          status: TRANSACTIONSTATUS_PENDING,
          userId: +workerId,
          workId: +workId,
        },
      }),
    ]);

    console.log(updateStatus, "A");
    console.log(createTransaction, "B");

    res.status(201).json({ updateStatus, createTransaction });
  } catch (err) {
    next(err);
  }
};

exports.rejectWork = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.updateStatusWork = async (req, res, next) => {
  try {
    const { workId, workStatus } = req.body;
    const foundWork = await prisma.work.findFirst({ where: { id: +workId } });
    if (!foundWork) {
      createError("not found work", 401);
    }

    const updateStatus = await prisma.work.update({
      where: { id: foundWork.id },
      data: { statusWork: workStatus },
    });
    res.status(201).json({ updateStatus });
  } catch (err) {
    next(err);
  }
};

exports.successWork = async (req, res, next) => {
  try {
    const { workId, rating, detail } = req.body;
    const foundTransaction = await prisma.transaction.findMany({
      where: { workId: +workId },
    });
    if (!foundTransaction) {
      return createError("not found transaction", 400);
    }

    const foundWork = await prisma.work.findFirst({ where: { id: +workId } });
    if (!foundWork) {
      return createError("not found work", 400);
    }

    const worker = await prisma.user.findFirst({
      where: { id: foundWork.workerId },
    });

    const [review, updatedWork, updatedTransactions, updatedUser] =
      await prisma.$transaction([
        prisma.review.create({
          data: {
            rating,
            detail,
            workId: +workId,
            reviewerId: foundWork.workerId,
            reviewById: foundWork.ownerId,
          },
        }),
        prisma.work.update({
          where: {
            id: +workId,
          },
          data: {
            statusWork: STATUS_WORK_SUCCESS,
          },
        }),
        prisma.transaction.updateMany({
          where: {
            workId: foundWork.id,
          },
          data: { status: TRANSACTIONSTATUS_APPROVE },
        }),
        prisma.user.update({
          where: {
            id: foundWork.workerId,
          },
          data: { wallet: { increment: +foundWork.price } }, // increment the wallet value
        }),
      ]);

    res
      .status(201)
      .json({ review, updatedWork, updatedTransactions, updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.getlatlng = async (req,res,next)=>{
  try{
    const latlng = await prisma.work.findMany({
      where:{
        isOnsite:true,
        statusWork:STATUS_WORK_FINDING
      },select:{
        addressLat:true,
        addressLong:true
      }
    });
   
    console.log(latlng,"xxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    res.status(200).json({ latlng });
  }catch(err){
    console.log(error)
  }
}