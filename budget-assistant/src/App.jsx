import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login'; // Your existing Login component
import Signup from './Signup'; // Your new SignUp component

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/sign-up" element={<Signup/>} />
            {/* Add more routes as needed */}
          </Routes>
      </Router>
    </div>
  );
}

export default App;
