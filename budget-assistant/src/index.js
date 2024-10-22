import React from 'react';
import ReactDOM from 'react-dom/client';
import './LoginRegister.css';
import App from './App';
// import LoginRegister from './LoginRegister';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddTransaction from './AddTransaction';
// import EditTransaction from './EditTransaction';
import Signup from './Signup'
import Login from './Login'; 
import ForgotPassword from './ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 
// import reportWebVitals from '../../trash/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element = {<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />}/>
        <Route path="/add-transaction" element={<AddTransaction/>} />
      </Routes>
    </Router>
    {/* <AddTransaction /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals



// reportWebVitals();
