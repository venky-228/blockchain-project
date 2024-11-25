import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav className="nav">
      <div className="nav__brand">
        <h1>Dappazon</h1>
      </div>

      <input
        type="text"
        placeholder="Search products"
        className="nav__search"
      />

      <div className="nav__actions">
        {account ? (
          <button type="button" className="nav__connect">
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </button>
        ) : (
          <button type="button" className="nav__connect" onClick={connectHandler}>
            Connect
          </button>
        )}
      </div>

      <ul className="nav__links">
        <li>
          <a href="#Clothing & Jewelry">Clothing & Jewelry</a>
        </li>
        <li>
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li>
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
        <li>
          <Link to="/seller-login">Seller Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
