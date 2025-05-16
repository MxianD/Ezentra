import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import axios from 'axios';

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

const API_BASE_URL = 'http://localhost:8080';

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleAccountsChanged = (accounts: string[]) => {
    setAccount(accounts[0] || null);
    onConnect?.(accounts[0] || '');
  };

  const connectWallet = async () => {
    if (Platform.OS !== 'web') return;
    
    try {
      setIsConnecting(true);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      setAccount(address);
      onConnect?.(address);

      // Register user in database
      try {
        const response = await axios.post(`${API_BASE_URL}/api/user`, {
          walletAddress: address,
          publicUsername: `User_${address.slice(0, 6)}`,
          privateUsername: `User_${address.slice(0, 6)}`,
          abilityDescription: '',
          level: 0,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          createBy: 0,
          updateBy: 0,
          passwordHash: '', // Not needed for wallet-based auth
        });

        if (response.status === 200) {
          console.log('User registered successfully');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    onConnect?.('');
  };

  useEffect(() => {
    if (Platform.OS === 'web' && window.ethereum) {
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            onConnect?.(accounts[0]);
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup listener on unmount
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [onConnect]);

  if (Platform.OS !== 'web') return null;

  return (
    <View style={styles.container}>
      {!account ? (
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={connectWallet}
          disabled={isConnecting}
        >
          <Text style={styles.buttonText}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.connectedState}
          onPress={disconnectWallet}
        >
          <Text style={styles.addressText}>
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
  },
  connectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(31, 32, 32, 0.7)',
    borderRadius: 5,
  },
  connectedState: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(86, 86, 86, 0.5)',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressText: {
    color: 'white',
    fontSize: 14,
  },
});

export default WalletConnect; 