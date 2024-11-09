import React, { useState } from 'react';

function EditTransaction({ transaction }) {
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/transaction/${transaction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Transaction updated successfully');
        } else {
          alert('Failed to update transaction');
        }
      });
  };

  return (
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
          required
        />
      </label>
      <button type="submit">Update Transaction</button>
    </form>
  );
}

export default EditTransaction;
