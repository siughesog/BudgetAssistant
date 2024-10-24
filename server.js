const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const TransactionRouter = require('./routes/TransactionRoute');
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://k0920687524:CbRBAOKhAkGeHwEa@cluster0.xzprk.mongodb.net/budget');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once('open', function () {
    console.log('Connected to database...');
});
app.use('/transactions', TransactionRouter); 
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});