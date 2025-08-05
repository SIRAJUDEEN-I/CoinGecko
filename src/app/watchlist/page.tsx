'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import CoinTable from '@/components/CoinTable';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/useWatchlist';
import { getCoins } from '@/services/coingecko';
import { Coin } from '@/types/crypto';
import { Star, Trash2 } from 'lucide-react';

export default function WatchlistPage() {
  const { watchlist, clearWatchlist } = useWatchlist();
  const [watchlistCoins, setWatchlistCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlistCoins = async () => {
      if (watchlist.length === 0) {
        setWatchlistCoins([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch current market data for watchlist coins
        const markets = await getCoins(1, 250);
        const filteredCoins = markets.filter(coin => 
          watchlist.some(item => item.id === coin.id)
        );
        
        // Sort by the order they were added to watchlist
        const sortedCoins = filteredCoins.sort((a, b) => {
          const aIndex = watchlist.findIndex(item => item.id === a.id);
          const bIndex = watchlist.findIndex(item => item.id === b.id);
          return aIndex - bIndex;
        });
        
        setWatchlistCoins(sortedCoins);
      } catch (err) {
        setError('Failed to fetch watchlist data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistCoins();
  }, [watchlist]);

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      clearWatchlist();
    }
  };

  if (watchlist.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="bg-crypto-dark-card border border-crypto-dark-border rounded-lg p-8 max-w-md mx-auto">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your Watchlist is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Start building your watchlist by clicking the star icon next to any cryptocurrency.
            </p>
            <Button asChild>
              <Link href="/">Browse Markets</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Your Watchlist
            </h1>
            <p className="text-muted-foreground">
              {watchlist.length} cryptocurrenc{watchlist.length === 1 ? 'y' : 'ies'} in your watchlist
            </p>
          </div>
          
          {watchlist.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWatchlist}
              className="text-crypto-red hover:text-crypto-red border-crypto-red hover:bg-crypto-red/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-crypto-red/10 border border-crypto-red/20 rounded-lg p-4">
            <p className="text-crypto-red">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-accent"></div>
          </div>
        )}

        {/* Watchlist Table */}
        {!isLoading && (
          <CoinTable coins={watchlistCoins} />
        )}

        {/* Missing coins notice */}
        {!isLoading && !error && watchlist.length > watchlistCoins.length && (
          <div className="bg-crypto-gold/10 border border-crypto-gold/20 rounded-lg p-4">
            <p className="text-crypto-gold text-sm">
              <strong>Note:</strong> Some coins in your watchlist may not be visible if they&apos;re not in the top 250 by market cap.
            </p>
          </div>
        )}

        {/* Watchlist Info */}
        {!isLoading && watchlistCoins.length > 0 && (
          <div className="bg-muted/30 border border-crypto-dark-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Your watchlist is saved locally in your browser. 
              Click the star icon again to remove coins from your watchlist.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
