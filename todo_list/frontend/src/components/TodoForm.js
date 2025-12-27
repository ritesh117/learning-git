import React, { useState } from 'react';
import axios from 'axios';
import './TodoForm.css';

function TodoForm() {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName.trim()) {
      setMessage('Item name is required');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/submittodoitem', {
        itemName: itemName.trim(),
        itemDescription: itemDescription.trim(),
      });

      setMessage('✓ To-Do item added successfully!');
      setItemName('');
      setItemDescription('');
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.message || 'Failed to submit'}`);
      } else if (error.request) {
        setMessage('Error: Unable to connect to server. Please make sure the backend is running.');
      } else {
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>Create New To-Do Item</h2>

      <div className="form-group">
        <label htmlFor="itemName">Item Name</label>
        <input
          type="text"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item name"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="itemDescription">Item Description</label>
        <textarea
          id="itemDescription"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          placeholder="Enter item description (optional)"
          rows="4"
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit To-Do Item'}
      </button>

      {message && <p className={`message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</p>}
    </form>
  );
}

export default TodoForm;
