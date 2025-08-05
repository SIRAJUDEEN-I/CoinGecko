'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  changeFilter: string;
  onChangeFilterChange: (value: string) => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  changeFilter,
  onChangeFilterChange,
}: SearchAndFiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(debouncedSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, onSearchChange]);

  const hasActiveFilters = sortBy !== 'market_cap_desc' || 
                          priceRange !== 'all' || 
                          changeFilter !== 'all';

  const clearFilters = () => {
    onSortChange('market_cap_desc');
    onPriceRangeChange('all');
    onChangeFilterChange('all');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cryptocurrencies..."
          value={debouncedSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDebouncedSearch(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Sort By */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-48 bg-card border-border">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="market_cap_desc">Market Cap (High to Low)</SelectItem>
          <SelectItem value="market_cap_asc">Market Cap (Low to High)</SelectItem>
          <SelectItem value="price_desc">Price (High to Low)</SelectItem>
          <SelectItem value="price_asc">Price (Low to High)</SelectItem>
          <SelectItem value="volume_desc">Volume (High to Low)</SelectItem>
          <SelectItem value="percent_change_desc">24h Change (High to Low)</SelectItem>
          <SelectItem value="percent_change_asc">24h Change (Low to High)</SelectItem>
        </SelectContent>
      </Select>

      {/* Additional Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-popover border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <Select value={priceRange} onValueChange={onPriceRangeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under_1">Under $1</SelectItem>
                  <SelectItem value="1_to_10">$1 - $10</SelectItem>
                  <SelectItem value="10_to_100">$10 - $100</SelectItem>
                  <SelectItem value="100_to_1000">$100 - $1,000</SelectItem>
                  <SelectItem value="over_1000">Over $1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 24h Change */}
            <div className="space-y-2">
              <label className="text-sm font-medium">24h Change</label>
              <Select value={changeFilter} onValueChange={onChangeFilterChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Changes</SelectItem>
                  <SelectItem value="gainers">Gainers Only (+)</SelectItem>
                  <SelectItem value="losers">Losers Only (-)</SelectItem>
                  <SelectItem value="over_5">Over +5%</SelectItem>
                  <SelectItem value="over_10">Over +10%</SelectItem>
                  <SelectItem value="under_neg5">Under -5%</SelectItem>
                  <SelectItem value="under_neg10">Under -10%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
