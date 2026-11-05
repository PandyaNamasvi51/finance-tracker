const service = require('../services/transactionService');
const { asyncHandler } = require('../middleware/error');

// POST /api/transactions
exports.addTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, note, date } = req.body;
  if (!['income', 'expense'].includes(type)) {
    res.status(400);
    throw new Error('Type must be income or expense');
  }
  if (!category || !String(category).trim()) {
    res.status(400);
    throw new Error('Category is required');
  }
  if (!(Number(amount) > 0)) {
    res.status(400);
    throw new Error('Amount must be greater than 0');
  }
  const tx = await service.create(req.user._id, { type, category, amount: Number(amount), note, date });
  res.status(201).json(tx);
});

// GET /api/transactions?type=&category=&startDate=&endDate=
exports.getTransactions = asyncHandler(async (req, res) => {
  res.json(await service.list(req.user._id, req.query));
});

// GET /api/transactions/summary
exports.getSummary = asyncHandler(async (req, res) => {
  res.json(await service.summary(req.user._id));
});

// DELETE /api/transactions/:id
exports.deleteTransaction = asyncHandler(async (req, res) => {
  const deleted = await service.remove(req.user._id, req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json({ message: 'Transaction deleted', id: req.params.id });
});
