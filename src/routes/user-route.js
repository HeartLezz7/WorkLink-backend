const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const uploadMiddleware = require('../middlewares/upload')
const authenticateMiddleware = require('../middlewares/authenticated')

router.post('/createprofile',
authenticateMiddleware,
uploadMiddleware.fields([{name:'profileImage',maxCount:1},{name:'identifyImage',maxCount:1}]),
userController.createUserProfile)




router.patch('/uploadprofileimage/:id',
authenticateMiddleware,
uploadMiddleware.single('profileImage'),
userController.updateProfile
)

module.exports = router