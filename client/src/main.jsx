// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import {BrowserRouter as Router} from "react-router-dom"

// Define a JavaScript object to hold the chain IDs
const ChainId = {
  Mainnet: 1,
  Goerli: 5,
  Polygon: 137,
  Mumbai: 80001,
  Localhost: 1337,
  Hardhat: 31337,
  Fantom: 250,
  FantomTestnet: 4002,
  Avalanche: 43114,
  AvalancheFujiTestnet: 43113,
  Optimism: 10,
  OptimismGoerli: 420,
  Arbitrum: 42161,
  ArbitrumGoerli: 421613,
  BinanceSmartChainMainnet: 56,
  BinanceSmartChainTestnet: 97,
  Sepolia: 11155111,
};

createRoot(document.getElementById('root')).render(
  <ThirdwebProvider desiredChainId={ChainId.Sepolia}>
    <Router>
      <App />
    </Router>
  </ThirdwebProvider>
);