const express = require('express')
const route = express.Router()
const transactionController = require("../controllers/transaction-controller")
const authenticateMiddleware = require('../middlewares/authenticated')
const upload = require('../middlewares/upload')


route.post('/',authenticateMiddleware,transactionController.createTransaction)

route.post('/slipImage',authenticateMiddleware,upload.single('slipImage'),transactionController.uploadSlipImage)

route.get('/alltransaction',authenticateMiddleware,transactionController.getAllTransaction)
route.get('/alltransaction/:userProfileId',authenticateMiddleware,transactionController.getTransactionByuserProfileId)

module.exports = route;