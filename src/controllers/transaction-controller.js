const { TRANSACTIONSTATUS_PENDING } = require("../configs/constants");
const prisma = require("../models/prisma");

exports.createTransaction = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);

    console.log(req.user)
    console.log(req.user.userProfile.id)
    const createTransaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        status: TRANSACTIONSTATUS_PENDING,
        workTitle: data.workTitle,
       user:+req.user.id,
       userProfileId: req.user.userProfile.id,
       work:data.id
      },
      include:{
        user :true,
        work:true
      }
    });
    console.log(createTransaction)
    res
      .status(201)
      .json({
        message: "Success create transaction from /work/transaction",
        createTransaction,
      });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransaction = async (req, res, next) => {
  try {
    const alltransaction = await prisma.transaction.findMany({});
    res
      .status(201)
      .json({
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
    res
      .status(201)
      .json({
        message:
          "Success Get all transaction By userProfileId from /transaction/alltransaction/:userProfileId",
        transactionByuserProfileId,
      });
  } catch (error) {
    next(error);
  }
};


exports.uploadSlipImage = async (req,res,next) =>{
    try{
        console.log(req.body)
        console.log(req.user)
        console.log('first')

    }catch(error){
        next(error)
    }
}