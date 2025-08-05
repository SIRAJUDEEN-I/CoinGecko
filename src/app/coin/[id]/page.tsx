'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CoinDetails, MarketChartData } from '@/types/crypto';
import { getCoinDetails, getCoinMarketChart } from '@/services/coingecko';
import { useWatchlist } from '@/hooks/useWatchlist';
import Layout from '@/components/Layout';
import PriceChart from '@/components/PriceChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, TrendingUp, TrendingDown } from 'lucide-react';

export default function CoinDetailPage() {
  const params = useParams();
  const coinId = params.id as string;
  
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [chartData, setChartData] = useState<MarketChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7');
  
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchCoinData = async () => {
      if (!coinId) return;

      try {
        setLoading(true);
        setError(null);
        
        const [coinData, marketData] = await Promise.all([
          getCoinDetails(coinId),
          getCoinMarketChart(coinId, parseInt(timeRange))
        ]);
        
        setCoin(coinData);
        setChartData(marketData);
      } catch (err) {
        setError('Failed to fetch coin data. Please try again later.');
        console.error('Error fetching coin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId, timeRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 6 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) {
      return `${(supply / 1e9).toFixed(2)}B`;
    } else if (supply >= 1e6) {
      return `${(supply / 1e6).toFixed(2)}M`;
    } else if (supply >= 1e3) {
      return `${(supply / 1e3).toFixed(2)}K`;
    }
    return supply.toFixed(0);
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{isPositive ? '+' : ''}{percentage.toFixed(2)}%</span>
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-accent"></div>
          <p className="mt-4 text-muted-foreground">Loading coin details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !coin) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="bg-crypto-red/10 border border-crypto-red/20 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">Error Loading Coin</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/">
              <Button>Back to Markets</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Extract values with fallbacks for both data structures
  const currentPrice = coin.market_data?.current_price?.usd || coin.current_price;
  const marketCap = coin.market_data?.market_cap?.usd || coin.market_cap;
  const volume = coin.market_data?.total_volume?.usd || coin.total_volume;
  const priceChange24h = coin.market_data?.price_change_percentage_24h || coin.price_change_percentage_24h;
  const isPositive = priceChange24h > 0;

  // Convert CoinDetails to Coin format for watchlist compatibility
  const coinForWatchlist = {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    current_price: currentPrice,
    market_cap: marketCap,
    market_cap_rank: coin.market_cap_rank || coin.market_data?.market_cap_rank || 0,
    total_volume: volume,
    price_change_percentage_24h: priceChange24h,
    price_change_24h: coin.market_data?.price_change_24h || coin.price_change_24h || 0,
    market_cap_change_24h: coin.market_cap_change_24h || 0,
    market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h || 0,
    high_24h: coin.market_data?.high_24h?.usd || coin.high_24h || currentPrice,
    low_24h: coin.market_data?.low_24h?.usd || coin.low_24h || currentPrice,
    fully_diluted_valuation: coin.fully_diluted_valuation,
    circulating_supply: coin.circulating_supply || coin.market_data?.circulating_supply || 0,
    total_supply: coin.total_supply || coin.market_data?.total_supply,
    max_supply: coin.max_supply || coin.market_data?.max_supply,
    ath: coin.ath || 0,
    ath_change_percentage: coin.ath_change_percentage || 0,
    ath_date: coin.ath_date || '',
    atl: coin.atl || 0,
    atl_change_percentage: coin.atl_change_percentage || 0,
    atl_date: coin.atl_date || '',
    roi: coin.roi,
    last_updated: coin.last_updated || new Date().toISOString(),
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Markets</span>
              </Link>
            </Button>
          </div>
          
          <Button
            variant={isInWatchlist(coin.id) ? "default" : "outline"}
            onClick={() => toggleWatchlist(coinForWatchlist)}
            className="flex items-center space-x-2"
          >
            <Star className={`h-4 w-4 ${isInWatchlist(coin.id) ? 'fill-current' : ''}`} />
            <span>{isInWatchlist(coin.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
          </Button>
        </div>

        {/* Coin Header */}
        <div className="flex items-center space-x-4">
          <Image
            src={coin.image}
            alt={coin.name}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <p className="text-lg text-muted-foreground uppercase">{coin.symbol}</p>
          </div>
        </div>

        {/* Price Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-crypto-dark-card border-crypto-dark-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{formatPrice(currentPrice)}</div>
              <div className={`flex items-center space-x-1 text-sm ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{isPositive ? '+' : ''}{priceChange24h.toFixed(2)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-crypto-dark-card border-crypto-dark-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Market Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold font-mono">{formatMarketCap(marketCap)}</div>
              <div className="text-sm text-muted-foreground">
                Rank #{coin.market_cap_rank || coin.market_data?.market_cap_rank}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-crypto-dark-card border-crypto-dark-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold font-mono">{formatMarketCap(volume)}</div>
            </CardContent>
          </Card>

          <Card className="bg-crypto-dark-card border-crypto-dark-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Circulating Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold font-mono">
                {formatSupply(coin.circulating_supply || coin.market_data?.circulating_supply || 0)}
              </div>
              <div className="text-sm text-muted-foreground">{coin.symbol.toUpperCase()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        {chartData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Price Chart</h2>
              <div className="flex space-x-2">
                {[
                  { value: '1', label: '24H' },
                  { value: '7', label: '7D' },
                  { value: '30', label: '30D' },
                  { value: '90', label: '90D' },
                ].map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
            <PriceChart data={chartData} timeRange={timeRange} />
          </div>
        )}

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-crypto-dark-card border-crypto-dark-border">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">All-Time High</span>
                <div className="text-right">
                  <div className="font-mono">{formatPrice(coin.ath)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPercentage(coin.ath_change_percentage)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">All-Time Low</span>
                <div className="text-right">
                  <div className="font-mono">{formatPrice(coin.atl)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPercentage(coin.atl_change_percentage)}
                  </div>
                </div>
              </div>
              {coin.circulating_supply && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Circulating Supply</span>
                  <span className="font-mono">{coin.circulating_supply.toLocaleString()}</span>
                </div>
              )}
              {coin.max_supply && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Supply</span>
                  <span className="font-mono">{coin.max_supply.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {coin.description?.en && (
            <Card className="bg-crypto-dark-card border-crypto-dark-border">
              <CardHeader>
                <CardTitle>About {coin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: coin.description.en.substring(0, 500) + '...' 
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
