import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/save-email', { email });
      alert(response.data.message);
      setEmail('');
    } catch (error) {
      alert('Error saving email');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Save Email to Database</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;