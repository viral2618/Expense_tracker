const Transaction = require('../Models/Transaction');

// Create a transaction
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type } = req.body;

    const transaction = new Transaction({
      userId: req.user._id,  // comes from JWT middleware
      title,
      amount,
      type: type.toLowerCase() // normalize type
    });

    await transaction.save();
    return res.status(201).json({ success: true, transaction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all transactions for logged-in user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Normalize type if provided
    if (req.body.type) req.body.type = req.body.type.toLowerCase();

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    return res.status(200).json({ success: true, transaction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    return res.status(200).json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
};
