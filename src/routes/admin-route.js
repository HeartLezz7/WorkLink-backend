const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin-controller')

router.post('/register', adminController.register)
router.post('/login', adminController.login)
router.post('/withDraw', adminController.withDrawCheck)
router.post('/deposit', adminController.depositCheck)

router.get('/getstatus', adminController.findApprove)


module.exports = router