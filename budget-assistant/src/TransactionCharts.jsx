import React, { useState } from 'react';
import MonthPicker from 'react-month-picker-simple';

import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const TransactionCharts = ({ transactions = [] }) => {
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'
  const [selectedKind, setSelectedKind] = useState('全部');
  const [selectedYearOfBar, setSelectedYearOfBar] = useState(2024);
  const [selectedMonthOfBar, setSelectedMonthOfBar] = useState(9);
  const [flag, setFlag] = useState(false);
  console.log(selectedMonthOfBar);
  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No transaction data available for the selected period.
      </div>
    );
  }

  // Colors for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CDEF', '#ADDCB6', '#FFE0B2', '#FFCCBC', '#E1BEE7'
  ];

  // Group transactions by kind for pie chart
  const IncomeKindTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      const amount = Math.abs(transaction.amount);
      acc[transaction.kind] = (acc[transaction.kind] || 0) + amount;
    }
    return acc;
  }, {});
  const ExpenseKindTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      const amount = Math.abs(transaction.amount);
      acc[transaction.kind] = (acc[transaction.kind] || 0) + amount;
    }
    return acc;
  }, {});

  const IncomePieData = Object.entries(IncomeKindTotals)
    .map(([kind, amount]) => ({
      name: kind || '其他',
      value: amount
    }))
    .filter(item => item.value > 0);
    const ExpensePieData = Object.entries(ExpenseKindTotals)
    .map(([kind, amount]) => ({
      name: kind || '其他',
      value: amount
    }))
    .filter(item => item.value > 0);

  // Group transactions by date for bar chart
  const dateGroups = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date) || 'Unknown Date';
    const month = selectedMonthOfBar;
    const year = selectedYearOfBar;
    if (!acc[`${year}-${month}`]) {
      acc[`${year}-${month}`] = {
        date,
        income: 0,
        expense: 0
      };
    }
    const transactionMonth = date.getMonth() + 1;
    const transactionYear = date.getFullYear();
        console.log(selectedMonthOfBar);
        console.log(selectedYearOfBar);
        console.log(transactionMonth);
        console.log(transactionYear);
        console.log("           ");
    if (selectedMonthOfBar == transactionMonth && selectedYearOfBar == transactionYear) {
        
        if(transaction.type === 'income'){
            acc[`${year}-${month}`].income += Math.abs(transaction.amount);
            
        }else{
            acc[`${year}-${month}`].expense += Math.abs(transaction.amount);
        }
    }
    
    return acc;
  }, {});

  const barData = Object.values(dateGroups);

  // Function to get time period key based on date
  const getTimePeriodKey = (date) => {
    const d = new Date(date);
    switch (timeRange) {
      case 'week':
        // Get week number
        const weekNumber = Math.ceil((d.getDate() + (d.getDay() + 6) % 7) / 7);
        const startDate = new Date(d.getFullYear(), 0, 1); // 每年的第一天
        const days = Math.floor((d - startDate) / (24 * 60 * 60 * 1000)); // 計算距離當年第一天的天數
        const week = Math.ceil((days + 1) / 7); // 計算週數
        return `${(d.getFullYear()).toString() +'年'+ (week).toString()}週`;
      case 'month':
        return `${(d.getFullYear()).toString() +'年'+ (d.getMonth() + 1 ).toString()}月`;
      case 'year':
        return `${d.getFullYear()}年`;
      default:
        return date;
    }
  };

  // Group transactions by kind and time period for line chart
  const lineData = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      const timePeriodKey = getTimePeriodKey(transaction.date);
      if (!acc[timePeriodKey]) {
        acc[timePeriodKey] = {
          timePeriod: timePeriodKey,
        };
      }
      const kind = transaction.kind || '其他';
      if(selectedKind === '全部'){
      acc[timePeriodKey][kind] = (acc[timePeriodKey][kind] || 0) + Math.abs(transaction.amount);
      }else{
        if(kind === selectedKind){
            acc[timePeriodKey][kind] = (acc[timePeriodKey][kind] || 0) + Math.abs(transaction.amount);
        }
      }
    }
    return acc;
  }, {});

  const lineChartData = Object.values(lineData);
  const allKinds = [...new Set(transactions.map(t => t.kind || '其他'))];

  return (
    <div className="w-full space-y-8">
      {/* Bar Chart */}
      
          
      {barData.length > -1 && (

        

        <div className="p-4 bg-white rounded-lg shadow">
            {/* 左側: 刪除按鈕 */}
        <div style={{ flex: 0.2, paddingLeft: '20px' }}>
        <button onClick={() => setFlag(!flag)}>
          選擇
        </button>
        {flag && (
            <aside
              style={{
                position: 'absolute',
                top: '50px', // 可根據需求調整位置
                left: '120px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 10,
                width: '200px' // 調整寬度以適合內容
              }}
            >
              <MonthPicker
                handleChange={(date) => {
                  setSelectedMonthOfBar(date.getMonth() + 1);
                  setSelectedYearOfBar(date.getFullYear());
                  
                 
                }}
              />
              <button onClick={() => setFlag(!flag)} className="mb-4 p-2 bg-red-500 text-black rounded">
            X
          </button>
            </aside>
            
          )}
      </div>
          <h3 className="text-lg font-semibold mb-4">{selectedYearOfBar}年{selectedMonthOfBar}月收支圖</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedKind} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name="收入" fill="#4CAF50" />
              <Bar dataKey="expense" name="支出" fill="#FF5252" />
            </BarChart>
          </ResponsiveContainer>
          
        </div>
      )}

      {/* Line Chart */}
      {lineChartData.length > 0 && (
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">支出類別趨勢</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="week">週</option>
              <option value="month">月</option>
              <option value="year">年</option>
            </select>
            <select 
              value={selectedKind}
              onChange={(e) => setSelectedKind(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="全部">全部</option>
              <option value="食物">食物</option>
              <option value="交通">交通</option>
              <option value="娛樂">娛樂</option>
              <option value="健康">健康</option>
              <option value="教育">教育</option>
              <option value="服飾">服飾</option>
              <option value="居住">居住</option>
              <option value="通訊">通訊</option>
              <option value="水電">水電</option>
              <option value="保險">保險</option>
              <option value="投資">投資</option>
              <option value="人情">人情</option>
              <option value="旅遊">旅遊</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timePeriod" />
              <YAxis />
              <Tooltip />
              <Legend />
              {allKinds.map((kind, index) => (
                <Line
                  key={kind}
                  type="linear"
                  dataKey={kind}
                  stroke={COLORS[index % COLORS.length]}
                  name={kind}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    

      {/* Pie Chart */}
      {IncomePieData.length > 0 && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">收入類別分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={IncomePieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {IncomePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          
        </div>
        
      )}

      {/* Pie Chart */}
      {ExpensePieData.length > 0 && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">支出類別分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ExpensePieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ExpensePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      </div>
  );
};
export default TransactionCharts;