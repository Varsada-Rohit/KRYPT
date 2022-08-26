import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );
  console.log({ transactionContract });
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [transactionCount, setTransactionCount] = useState(0);
  const [transferring, setTransferring] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert("Please install metamask.");
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      getAllTransactions();
      listToEvents();
    }
  };

  const listToEvents = () => {
    try {
      const transactionContract = getEthereumContract();
      transactionContract.on(
        "Transfer",
        (addressFrom, addressTo, amount, message, timestamp, keyword) => {
          setTransactions((t) => [
            ...t,
            {
              addressFrom,
              addressTo,
              amount: parseInt(amount._hex) / 10 ** 18,
              message,
              timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),

              keyword,
            },
          ]);
        }
      );
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object!.");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask.");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object!.");
    }
  };

  const sendTransaction = async (formData) => {
    try {
      setTransferring(true);
      if (!ethereum) return alert("Please install metamask.");
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWEI
            value: parsedAmount._hex,
          },
        ],
      });
      const transactionHash = await transactionContract.addToBloackchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      console.log("Loading " + transactionHash.hash);
      await transactionHash.wait();
      console.log("Success " + transactionHash.hash);

      const tc = await transactionContract.getTransactionCount();
      setTransactionCount(tc.toNumber());
      setTransferring(false);
    } catch (error) {
      console.log(error);
      setTransferring(false);
      throw new Error("No ethereum object!.");
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      const transactionContract = getEthereumContract();
      const tc = await transactionContract.getTransactionCount();
      localStorage.setItem("TC", tc);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object!.");
    }
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask.");
      const transactionContract = getEthereumContract();
      const availableTransaction =
        await transactionContract.getAllTransactions();
      const structuredTransactions = availableTransaction.map(
        (transaction) => ({
          addressTo: transaction.reciever,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );
      console.log({ availableTransaction });
      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransaction,
        transferring,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
