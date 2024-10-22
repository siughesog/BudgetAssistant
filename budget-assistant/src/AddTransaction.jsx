import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { filterTransactionsByRange, calculateTotalsForRange } from './transactionUtils';

function AddTransactionWithDate() {
    const [selectedDate, setSelectedDate] = useState(new Date()); // 預設為今天的日期
    const [amount, setAmount] = useState(''); // 金額
    const [description, setDescription] = useState(''); // 描述
    const [type, setType] = useState('income'); // 交易類型，預設為收入
    const [transactions, setTransactions] = useState([]); // 所有交易紀錄
    const [filteredTransactions, setFilteredTransactions] = useState([]); // 選擇日期的交易紀錄
    const [queryRange, setQueryRange] = useState('day');


    useEffect(() => { // 後端版
        const fetchTransactions = async () => {
            const response = await fetch('http://localhost:3001/transactions');
            const data = await response.json();
            setTransactions(data);
        };
    
        fetchTransactions();

    }, []);

    // 當選擇日期或交易紀錄更新時，過濾出該日期的交易
    useEffect(() => {
        const filtered = transactions.filter(
            (transaction) => transaction.date === selectedDate.toLocaleDateString()
        );
        setFilteredTransactions(filtered);
    }, [selectedDate, transactions]);

    // 新增交易處理
    const handleSubmit = (e) => {
        e.preventDefault();

        const newTransaction = {
            id: transactions.length + 1,
            date: selectedDate.toLocaleDateString(), // 使用選擇的日期
            amount: parseFloat(amount), // 將金額轉換為數字
            description,
            type,
        };



        const updatedTransactions = [...transactions, newTransaction];

        // 更新所有交易紀錄
        setTransactions(updatedTransactions);

        // 保存到 localStorage
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

        // 清空表單
        setAmount('');
        setDescription('');
    };

    // 刪除交易的處理函數
    const handleDeleteTransaction = (id) => {
        // 過濾掉不需要的交易，保留其他交易
        const updatedTransactions = transactions.filter(transaction => transaction.id !== id);

        // 更新狀態
        setTransactions(updatedTransactions);

        // 更新 localStorage
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    };


    // 計算該天的總金額
    const totalCost = filteredTransactions.reduce((sum, transaction) => {
        return parseInt(sum) + transaction.amount;
    }, 0);

    return (

        <div>
            <h2>Select Date and Add Transaction</h2>

            {/* 日期選擇器，讓使用者選擇日期 */}
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)} // 當日期改變時更新選擇的日期
                dateFormat="yyyy/MM/dd"
                inline
            />

            <form onSubmit={handleSubmit}>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}

                    />
                </label>
                <label>
                    Type:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </label>
                <button type="submit">Add Transaction</button>
            </form>

            {/* 顯示選擇日期的交易紀錄 */}
            <h3>Transactions for {selectedDate.toLocaleDateString()}</h3>
            <ul>
                {filteredTransactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.date}: {transaction.type} - {transaction.amount} ({transaction.description})
                        {/* 刪除按鈕，點擊時會調用 handleDeleteTransaction 函數 */}
                        <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* 顯示該天的總金額 */}
            <h3>Total Cost: {totalCost}</h3>


            <label htmlFor="queryRange">Select Range:</label>
            <select id="queryRange" value={queryRange} onChange={(e) => setQueryRange(e.target.value)}>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
            </select>

            <button onClick={() => {
                const { incomeTotal, expenseTotal } = calculateTotalsForRange(transactions, queryRange);
                console.log(`Income: ${incomeTotal}, Expense: ${expenseTotal}`);
            }}>
                Query Transactions
            </button>
        </div>
    );
}

export default AddTransactionWithDate;
