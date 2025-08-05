# CoinGecko API Service - Enhanced with Axios

## 🚀 Improvements Made

### Security & Best Practices
- ✅ **Environment Variables**: API key now stored in `.env.local` instead of hardcoded
- ✅ **Git Security**: `.env.example` provided for developers, `.env.local` excluded from git
- ✅ **Production Ready**: Easy to configure different API keys for dev/staging/production

### Technical Enhancements
- ✅ **Axios Integration**: Replaced fetch with axios for better HTTP handling
- ✅ **Request Interceptors**: Automatic rate limiting (1 second between requests)
- ✅ **Response Interceptors**: Comprehensive error handling and logging
- ✅ **Timeout Protection**: 10-second timeout to prevent hanging requests
- ✅ **Better Error Messages**: More descriptive error messages for debugging

### API Features
- ✅ **Rate Limiting**: Automatic 1-second delay between API calls
- ✅ **Error Handling**: Proper error categorization (network, server, request errors)
- ✅ **Request Configuration**: Centralized axios configuration
- ✅ **Backward Compatibility**: Existing function names still work

## 📋 Usage

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Add your CoinGecko API key:
   ```
   NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here
   ```
3. Get your free API key from: https://www.coingecko.com/en/api/pricing

### Available Methods

```typescript
import { coingeckoAPI, getCoins, getCoinDetails, getCoinMarketChart } from '@/services/coingecko';

// Modern object-based API
const markets = await coingeckoAPI.getMarkets(1, 50);
const coinDetails = await coingeckoAPI.getCoinDetails('bitcoin');
const chartData = await coingeckoAPI.getMarketChart('bitcoin', 7);
const searchResults = await coingeckoAPI.searchCoins('ethereum');

// Backward-compatible named exports
const markets = await getCoins(1, 50);
const coinDetails = await getCoinDetails('bitcoin');
const chartData = await getCoinMarketChart('bitcoin', 7);
```

## 🛡️ Error Handling

The service now provides three types of error handling:

1. **Network Errors**: When the API is unreachable
2. **Server Errors**: When CoinGecko returns 4xx/5xx status codes
3. **Request Errors**: When the request configuration is invalid

## 🔧 Configuration

### Rate Limiting
- **Interval**: 1 second between requests (configurable)
- **Method**: Request interceptor with automatic delays

### Timeout
- **Duration**: 10 seconds (configurable)
- **Behavior**: Throws timeout error if request takes too long

### Headers
- **API Key**: Automatically added if present in environment
- **Content-Type**: `application/json`
- **Accept**: `application/json`

## 🚀 Benefits

1. **Better Security**: No hardcoded API keys
2. **Improved Reliability**: Automatic rate limiting and error handling
3. **Better Developer Experience**: Clear error messages and timeout protection
4. **Production Ready**: Easy environment configuration
5. **Maintainable**: Centralized axios configuration
6. **Future-Proof**: Easy to extend with additional interceptors or features
