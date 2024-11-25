import { useState } from 'react';
import SellerDashboard from './SellerDashboard';

const SellerLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const predefinedCredentials = {
    username: 'seller',
    password: 'dappazon123'
  };

  const handleLogin = () => {
    const { username, password } = credentials;
    if (username === predefinedCredentials.username && password === predefinedCredentials.password) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div className="login">
          <h2>Seller Login</h2>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <SellerDashboard />
      )}
    </div>
  );
};

export default SellerLogin;
