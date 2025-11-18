const router = require('express').Router();
const ensureAuthenticated = require('../Middleware/Auth');
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} = require('../Controller/TransactionController');

// All routes are protected
router.use(ensureAuthenticated);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
