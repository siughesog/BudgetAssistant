const Transaction = require('../models/TransactionModel');

exports.createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).send(transaction); // 201 Created
    } catch (error) {
        res.status(400).send(`Error creating transaction: ${error.message}`); // 400 Bad Request
    }
};

exports.getAllTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.send(transactions);
    } catch (error) {
        res.status(500).send(`Error fetching transactions: ${error.message}`); // 500 Internal Server Error
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        await Transaction.findByIdAndDelete(id);
        res.status(200).send(`Transaction with id ${id} deleted successfully.`);
    } catch (error) {
        res.status(500).send(`Error deleting transaction: ${error.message}`);
    }
};