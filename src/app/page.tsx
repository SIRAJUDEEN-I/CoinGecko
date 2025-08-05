'use client';

import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import CoinTable from '@/components/CoinTable';
import SearchAndFilters from '@/components/SearchAndFilters';
import { Button } from '@/components/ui/button';
import { getCoins } from '@/services/coingecko';
import { Coin } from '@/types/crypto';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [priceRange, setPriceRange] = useState('all');
  const [changeFilter, setChangeFilter] = useState('all');

  const coinsPerPage = 50;

  // Fetch coins data
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCoins(currentPage, coinsPerPage);
        setCoins(data);
      } catch (err) {
        setError('Failed to fetch market data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, [currentPage]);

  // Filter and sort coins
  const filteredAndSortedCoins = useMemo(() => {
    let filtered = [...coins];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(coin => {
        const price = coin.current_price;
        switch (priceRange) {
          case 'under_1':
            return price < 1;
          case '1_to_10':
            return price >= 1 && price < 10;
          case '10_to_100':
            return price >= 10 && price < 100;
          case '100_to_1000':
            return price >= 100 && price < 1000;
          case 'over_1000':
            return price >= 1000;
          default:
            return true;
        }
      });
    }

    // Change filter
    if (changeFilter !== 'all') {
      filtered = filtered.filter(coin => {
        const change = coin.price_change_percentage_24h;
        switch (changeFilter) {
          case 'gainers':
            return change > 0;
          case 'losers':
            return change < 0;
          case 'over_5':
            return change > 5;
          case 'over_10':
            return change > 10;
          case 'under_neg5':
            return change < -5;
          case 'under_neg10':
            return change < -10;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'market_cap_desc':
          return b.market_cap - a.market_cap;
        case 'market_cap_asc':
          return a.market_cap - b.market_cap;
        case 'price_desc':
          return b.current_price - a.current_price;
        case 'price_asc':
          return a.current_price - b.current_price;
        case 'volume_desc':
          return b.total_volume - a.total_volume;
        case 'percent_change_desc':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'percent_change_asc':
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        default:
          return 0;
      }
    });

    return filtered;
  }, [coins, searchTerm, sortBy, priceRange, changeFilter]);

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="bg-crypto-red/10 border border-crypto-red/20 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
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
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Cryptocurrency Markets
          </h1>
          <p className="text-muted-foreground">
            Track the latest prices and market data for cryptocurrencies
          </p>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          changeFilter={changeFilter}
          onChangeFilterChange={setChangeFilter}
        />

        {/* Results Count */}
        {!isLoading && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedCoins.length} of {coins.length} coins
          </div>
        )}

        {/* Coins Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-accent"></div>
          </div>
        ) : (
          <CoinTable coins={filteredAndSortedCoins} />
        )}

        {/* Pagination */}
        {!isLoading && !searchTerm && (
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {currentPage}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={filteredAndSortedCoins.length < coinsPerPage}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
