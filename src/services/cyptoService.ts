import axios from "axios";
import { config } from "../config";
import { CryptoPrice } from "../types";

import { redisClient } from "../config/db";
import { logger } from "../utils/logger";

const CRYPTO_PRICES_KEY = "crypto_prices";

export const fetchCryptoPrices = async (): Promise<CryptoPrice | null> => {
  try {
    const symbolsParam = config.cryptoSymbols.join(",");
    const url = `${config.coingeckoApiUrl}?ids=${symbolsParam}&vs_currencies=usd`;

    logger.info(`Fetching prices from: ${url}`);
    const response = await axios.get<CryptoPrice>(url);
    const prices = response.data;

    if (prices) {
      await redisClient.set(
        CRYPTO_PRICES_KEY,
        JSON.stringify(prices),
        "EX",
        60,
      );

      logger.info("Crypto prices fetched and cached successfully.", prices);

      return prices;
    }
    return null;
  } catch (error: any) {
    logger.error("Error fetching crypto prices: " + (error.message || error));
    return null;
  }
};

export const getCachedCryptoPrices = async (): Promise<CryptoPrice | null> => {
  try {
    const cachedPrices = await redisClient.get(CRYPTO_PRICES_KEY);
    if (cachedPrices) {
      logger.info("Crypto prices retrieved from cache.");
      return JSON.parse(cachedPrices);
    }
    logger.info("No cached prices found, fetching new.");
    return await fetchCryptoPrices();
  } catch (error) {
    logger.error("Error getting cached crypto prices:", error);
    return null;
  }
};

export const getCurrentPrice = async (
  symbol: string,
): Promise<number | null> => {
  const prices = await getCachedCryptoPrices();
  if (prices && prices[symbol] && prices[symbol].usd) {
    return prices[symbol].usd;
  }
  return null;
};
