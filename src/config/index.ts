import dotenv from "dotenv";

dotenv.config();

let mongoUri = "mongodb://localhost:27017/cryptoalerts";
let redisUrl = "redis://localhost:6379";

if (process.env.NODE_ENV === "production") {
  mongoUri = "mongodb://mongodb:27017/cryptoalerts";
  redisUrl = "redis://redis:6379";
}

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || mongoUri,
  redisUrl: process.env.REDIS_URL || redisUrl,
  coingeckoApiUrl:
    process.env.COINGECKO_API_URL ||
    "https://api.coingecko.com/api/v3/simple/price",
  cryptoSymbols: process.env.CRYPTO_SYMBOLS
    ? process.env.CRYPTO_SYMBOLS.split(",")
    : ["bitcoin", "ethereum"],
  alertCheckIntervalMinutes: parseInt(
    process.env.ALERT_CHECK_INTERVAL_MINUTES || "1",
    10,
  ),
};
