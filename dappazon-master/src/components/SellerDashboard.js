import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Dappazon from '../abis/Dappazon.json';
import config from '../config.json';
import './SellerDashboard.css'; // Import the updated CSS

const SellerDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const predefinedCredentials = {
    username: 'seller',
    password: 'dappazon123',
  };

  const handleLogin = () => {
    if (
      credentials.username === predefinedCredentials.username &&
      credentials.password === predefinedCredentials.password
    ) {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials.');
    }
  };

  useEffect(() => {
    if (!loggedIn) return;

    const loadOrders = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const network = await provider.getNetwork();
        const dappazon = new ethers.Contract(
          config[network.chainId].dappazon.address,
          Dappazon.abi,
          signer
        );

        const orders = await dappazon.getOrders();
        const formattedOrders = orders.map((order) => ({
          time: new Date(order.time * 1000).toLocaleString(),
          itemId: order.itemId.toString(),
          buyer: order.buyer,
          cost: ethers.utils.formatEther(order.cost.toString()),
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h2>Seller Login</h2>
        <div className="login-form">
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
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Seller Dashboard</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Buyer</th>
              <th>Cost (ETH)</th>
              <th>Order Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.itemId}</td>
                <td>{order.buyer}</td>
                <td>{order.cost}</td>
                <td>{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default SellerDashboard;
