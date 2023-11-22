const express = require('express');
const router = express.Router();
const workController = require('../controllers/work-controller');
const authenticatedMiddleware = require('../middlewares/authenticated');
const uploadMiddleware = require('../middlewares/upload');

router.post(
  '/creatework',
  authenticatedMiddleware,
  uploadMiddleware.single('workImage'),
  workController.createWork
);
router.get('/mysignwork', authenticatedMiddleware, workController.getSignWork);
router.patch('/editwork', authenticatedMiddleware, workController.editWork);
router.patch(
  '/cancel/:workId',
  authenticatedMiddleware,
  workController.cancelWork
);
router.get('/', workController.getAllWork);
router.get('/waitreview', workController.waitingreview);

router.get(
  '/getdelegatedworkbyid/:workId',
  workController.getDelegatedWorkById
);
router.delete('/delete/:id', workController.deleteWork);
router.post('/createcategories', workController.createworkCategories);
router.get('/allCategories', workController.getAllCategories);
router.post(
  '/challenger/:workId',
  authenticatedMiddleware,
  workController.createChallenger
);
router.delete(
  '/signoutwork/:workId',
  authenticatedMiddleware,
  workController.deleteChallenger
);
router.patch('/review/:id', workController.updatereview);
router.patch(
  '/updateStatus',
  authenticatedMiddleware,
  workController.updateStatusWork
);
router.patch('/makeDeal', authenticatedMiddleware, workController.makeDealWork);
router.patch('/acceptDeal', authenticatedMiddleware, workController.acceptWork);
router.patch('/rejectDeal', authenticatedMiddleware, workController.rejectWork);
router.patch('/success', authenticatedMiddleware, workController.successWork);

router.get('/latlng', workController.getlatlng);

module.exports = router;
