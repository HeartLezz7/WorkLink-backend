const express = require('express')
const route = express.Router()
const transactionController = require("../controllers/transaction-controller")
const authenticateMiddleware = require('../middlewares/authenticated')


route.post('/',authenticateMiddleware,transactionController.createTransaction)
route.get('/alltransaction',authenticateMiddleware,transactionController.getAllTransaction)

route.get('/alltransaction/:userProfileId',authenticateMiddleware,transactionController.getTransactionByuserProfileId)

module.exports = route;