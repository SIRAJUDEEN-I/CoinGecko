import axios from 'axios';
import { Coin, CoinDetails, MarketChartData } from '@/types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Get API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(API_KEY && { 'x-cg-demo-api-key': API_KEY }),
  },
});

// Add request interceptor for rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

api.interceptors.request.use(async (config) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('CoinGecko API Error:', error.response.status, error.response.data);
      throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
      throw new Error('Network error: Unable to reach CoinGecko API');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
);

export const coingeckoAPI = {
  // Get market data for coins
  getMarkets: async (page = 1, perPage = 100): Promise<Coin[]> => {
    try {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: perPage,
          page: page,
          sparkline: false,
          price_change_percentage: '24h',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching markets:', error);
      throw error;
    }
  },

  // Get detailed data for a specific coin
  getCoinDetails: async (coinId: string): Promise<CoinDetails> => {
    try {
      const response = await api.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coin details:', error);
      throw error;
    }
  },

  // Get market chart data for a specific coin
  getMarketChart: async (
    coinId: string,
    days = 7
  ): Promise<MarketChartData> => {
    try {
      const response = await api.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days === 1 ? 'hourly' : 'daily',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching market chart:', error);
      throw error;
    }
  },

  // Search coins
  searchCoins: async (query: string) => {
    try {
      const response = await api.get('/search', {
        params: { query },
      });
      return response.data.coins;
    } catch (error) {
      console.error('Error searching coins:', error);
      throw error;
    }
  },
};

// Export individual methods for convenience (maintaining backward compatibility)
export const {
  getMarkets: getCoins,
  getCoinDetails,
  getMarketChart: getCoinMarketChart,
  searchCoins,
} = coingeckoAPI;
