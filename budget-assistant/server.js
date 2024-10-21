const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://k0920687524:CbRBAOKhAkGeHwEa@cluster0.xzprk.mongodb.net/budget');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once('open', function () {
    console.log('Connected to database...');
});
const transactionSchema = new mongoose.Schema({
    date: String,
    amount: Number,
    description: String,
    type: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.post('/transactions', async (req, res) => {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.send(transaction);
});

app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.send(transactions);
});

app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Transaction.findByIdAndDelete(id);
        res.status(200).send(`Transaction with id ${id} deleted successfully.`);
    } catch (error) {
        res.status(500).send(`Error deleting transaction: ${error.message}`);
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});