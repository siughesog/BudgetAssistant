// transactionUtils.js

// 篩選出某個範圍內的交易紀錄
export const filterTransactionsByRange = (transactions, rangeType) => {
    const now = new Date();
    
    let startDate;
    if (rangeType === 'day') {
      startDate = new Date(now.setHours(0, 0, 0, 0)); // 今天
    } else if (rangeType === 'week') {
      const firstDayOfWeek = now.getDate() - now.getDay(); // 當週的第一天
      startDate = new Date(now.setDate(firstDayOfWeek));
      startDate.setHours(0, 0, 0, 0);
    } else if (rangeType === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // 當月第一天
    } else if (rangeType === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1); // 當年第一天
    }
  
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate;
    });
  };
  
  // 計算特定範圍內的收入與支出總和
  export const calculateTotalsForRange = (transactions, rangeType) => {
    const filteredTransactions = filterTransactionsByRange(transactions, rangeType);
  
    const incomeTotal = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  
    const expenseTotal = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  
    return { incomeTotal, expenseTotal };
  };
  