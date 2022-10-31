const user = require('../controllers/user');
const { isLoggedIn } = require('../middleware/middleware');
const router = require('./postRoutes');
// single user routes

router.get('/user/posts', isLoggedIn, user.userPosts);

router.get('/offer/:currUserPostId/confirm/:postBeingViewedId', isLoggedIn, user.offerConfirm);
router.get('/offer/:id', isLoggedIn, user.offerForm);
router.post('/offer/:currUserPostId/confirm/:postBeingViewedId', isLoggedIn, user.offerConfirmPost);
router.post('/:currUserPostId/accept/:offerPostId', isLoggedIn, user.acceptOffer);
router.delete('/:currUserPostId/accept/:offerPostId', isLoggedIn, user.exchanged);

module.exports = router;