import { useState } from 'react';

const ResetPassword = () => {
  const [email, setEmail] = useState(''); // 用戶輸入的電子郵件
  const [message, setMessage] = useState(''); // 顯示提示訊息

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 模擬發送重設密碼的郵件
    setMessage(`A password reset link has been sent to ${email}`);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // 更新電子郵件狀態
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>} {/* 顯示提示訊息 */}
    </div>
  );
};

export default ResetPassword;
