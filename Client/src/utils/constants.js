import abi from "./Transactions.json";

export const contractAddress = import.meta.env.VITE_CONTRACT;
export const contractAbi = abi.abi;
export const API_KEY = import.meta.env.VITE_GIPHY_API;
