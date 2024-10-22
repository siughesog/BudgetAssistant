import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { calculateTotalsForRange } from './transactionUtils';

function AddTransactionWithDate() {
    const [selectedDate, setSelectedDate] = useState(new Date()); // 預設為今天的日期
    const [startDate, setStartDate] = useState(new Date()); // 篩選的起始日期
    const [endDate, setEndDate] = useState(new Date()); // 篩選的結束日期
    const [amount, setAmount] = useState(''); // 金額
    const [description, setDescription] = useState(''); // 描述
    const [type, setType] = useState('expense'); // 交易類型，預設為支出
    const [transactions, setTransactions] = useState([]); // 所有交易紀錄
    const [filteredTransactions, setFilteredTransactions] = useState([]); // 選擇日期的交易紀錄
    const [queryRange, setQueryRange] = useState('day');

    // 從後端獲取交易資料
    useEffect(() => {
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
            (transaction) => {
                const transactionDate = new Date(transaction.date).toLocaleDateString();
                return transactionDate >= startDate.toLocaleDateString() && transactionDate <= endDate.toLocaleDateString();
            }
        );
        setFilteredTransactions(filtered);
    }, [startDate, endDate, transactions]);

    // 新增交易處理
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTransaction = {
            date: selectedDate.toLocaleDateString(), // 使用選擇的日期
            amount: parseFloat(amount), // 將金額轉換為數字
            description,
            type,
        };

        // 透過API將交易儲存到後端資料庫
        const response = await fetch('http://localhost:3001/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTransaction),
        });

        const savedTransaction = await response.json();

        // 更新狀態
        setTransactions([...transactions, savedTransaction]);

        // 清空表單
        setAmount('');
        setDescription('');
    };

    // 刪除交易處理
    const handleDeleteTransaction = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/transactions/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // 更新狀態，移除刪除的交易
                setTransactions(transactions.filter(transaction => transaction._id !== id));
            } else {
                console.error(`Failed to delete transaction: ${await response.text()}`);
            }
        } catch (error) {
            console.error(`Error deleting transaction: ${error}`);
        }
    };

    // 計算該天的總金額
    const { incomeTotal, expenseTotal, netTotal } = filteredTransactions.reduce((totals, transaction) => {
        if (transaction.type == 'income') {
            totals.incomeTotal += transaction.amount;
        }
        else if (transaction.type == 'expense') {
            totals.expenseTotal += transaction.amount;
        }
        totals.netTotal = totals.incomeTotal - totals.expenseTotal;
        return totals;
    }, { incomeTotal: 0, expenseTotal: 0, netTotal: 0 });

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
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </label>
                <button className="btn btn-info" type="submit">Add Transaction</button>
            </form>

            {/* 篩選日期範圍的部分 */}
            <h2>查詢範圍</h2>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy/MM/dd"
            />
            <div><h1>To</h1></div>
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy/MM/dd"
            />

            {/* 顯示篩選後的交易紀錄 */}
            <h3>Transactions from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}</h3>
            <ul>
                {filteredTransactions.map((transaction) => (
                    <li key={transaction._id}>
                        {transaction.date}: {transaction.type} - {transaction.amount} ({transaction.description})
                        {/* 刪除按鈕，點擊時會調用 handleDeleteTransaction 函數 */}
                        <button onClick={() => handleDeleteTransaction(transaction._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* 顯示該天的總金額 */}
            <h3>總共賺到：{incomeTotal}</h3>
            <h3>總共花費：{expenseTotal}</h3>
            <h1>淨值   ：{netTotal}</h1>

            {/* 範圍查詢 */}
            {/* <label htmlFor="queryRange">Select Range:</label>
            <select id="queryRange" value={queryRange} onChange={(e) => setQueryRange(e.target.value)}>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
            </select> */}

            {/* <button className="btn btn-danger" onClick={() => {
                const { incomeTotal, expenseTotal } = calculateTotalsForRange(transactions, queryRange);
                console.log(`Income: ${incomeTotal}, Expense: ${expenseTotal}`);
            }}>
                Query Transactions
            </button> */}
        </div>
    );
}

export default AddTransactionWithDate;
