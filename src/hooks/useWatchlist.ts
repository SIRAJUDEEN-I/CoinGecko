import { useState, useEffect } from 'react';
import { Coin, WatchlistItem } from '@/types/crypto';
import { useToast } from '@/hooks/use-toast';

const WATCHLIST_KEY = 'crypto-watchlist';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Load watchlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(WATCHLIST_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('Loaded watchlist from localStorage:', parsed);
          setWatchlist(parsed);
        } catch (error) {
          console.error('Error loading watchlist:', error);
        }
      }
    }
    setIsLoaded(true);
  }, []);

  // Save watchlist to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      console.log('Saving watchlist to localStorage:', watchlist);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const isInWatchlist = (coinId: string): boolean => {
    return watchlist.some(item => item.id === coinId);
  };

  const addToWatchlist = (coin: Coin) => {
    if (!isInWatchlist(coin.id)) {
      const watchlistItem: WatchlistItem = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        addedAt: new Date().toISOString(),
      };
      console.log('Adding to watchlist:', watchlistItem);
      setWatchlist(prev => {
        const updated = [...prev, watchlistItem];
        console.log('Updated watchlist:', updated);
        return updated;
      });
      toast({
        title: "Added to Watchlist",
        description: `${coin.name} (${coin.symbol.toUpperCase()}) has been added to your watchlist.`,
      });
    }
  };

  const removeFromWatchlist = (coinId: string) => {
    const coin = watchlist.find(item => item.id === coinId);
    setWatchlist(prev => prev.filter(item => item.id !== coinId));
    if (coin) {
      toast({
        title: "Removed from Watchlist",
        description: `${coin.name} (${coin.symbol.toUpperCase()}) has been removed from your watchlist.`,
        variant: "destructive",
      });
    }
  };

  const toggleWatchlist = (coin: Coin) => {
    if (isInWatchlist(coin.id)) {
      removeFromWatchlist(coin.id);
    } else {
      addToWatchlist(coin);
    }
  };

  const clearWatchlist = () => {
    const count = watchlist.length;
    setWatchlist([]);
    if (count > 0) {
      toast({
        title: "Watchlist Cleared",
        description: `Removed ${count} cryptocurrenc${count === 1 ? 'y' : 'ies'} from your watchlist.`,
        variant: "destructive",
      });
    }
  };

  return {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
  };
};
