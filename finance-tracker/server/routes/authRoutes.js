const router = require('express').Router();
const { register, login, getMe, updateBudget } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/budget', protect, updateBudget);

module.exports = router;
