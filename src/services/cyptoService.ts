import axios from 'axios';
import { config } from '../config';
import { CryptoPrice } from '../types';

export const fetchCryptoPrices = async (): Promise<CryptoPrice | null> => {
  try {
    const symbolsParam = config.cryptoSymbols.join(',');
    const url = `${config.coingeckoApiUrl}?ids=${symbolsParam}&vs_currencies=usd`;
    
    console.log(`Fetching crypto prices from: ${url}`);
    const response = await axios.get<CryptoPrice>(url);
    const prices = response.data;

    if (prices) {
      console.log('Crypto prices fetched successfully:', prices);
      return prices;
    }
    return null;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return null;
  }
};


export const getCurrentPrice = async (symbol: string): Promise<number | null> => {
  const prices = await fetchCryptoPrices();
  if (prices && prices[symbol] && prices[symbol].usd) {
    return prices[symbol].usd;
  }
  return null;
};