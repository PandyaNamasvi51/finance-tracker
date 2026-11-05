const router = require('express').Router();
const { addTransaction, getTransactions, getSummary, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect); // every transaction route requires a valid JWT

router.route('/').post(addTransaction).get(getTransactions);
router.get('/summary', getSummary); // must come before /:id
router.delete('/:id', deleteTransaction);

module.exports = router;
