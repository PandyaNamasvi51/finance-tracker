const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// Business logic lives here; controllers only handle HTTP.
exports.create = (userId, data) => Transaction.create({ ...data, user: userId });

exports.list = (userId, { type, category, startDate, endDate }) => {
  const query = { user: userId };
  if (type) query.type = type;
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }
  return Transaction.find(query).sort({ date: -1, createdAt: -1 });
};

exports.remove = (userId, id) => Transaction.findOneAndDelete({ _id: id, user: userId });

// Totals + current-month expense via MongoDB aggregation
exports.summary = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [totals, month] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: uid } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: { user: uid, type: 'expense', date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const income = totals.find((t) => t._id === 'income')?.total || 0;
  const expense = totals.find((t) => t._id === 'expense')?.total || 0;
  return { income, expense, balance: income - expense, monthExpense: month[0]?.total || 0 };
};
