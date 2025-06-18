import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cryptoalerts',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  coingeckoApiUrl: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/simple/price',
  cryptoSymbols: process.env.CRYPTO_SYMBOLS ? process.env.CRYPTO_SYMBOLS.split(',') : ['bitcoin', 'ethereum'],
  alertCheckIntervalMinutes: parseInt(process.env.ALERT_CHECK_INTERVAL_MINUTES || '1', 10),
};