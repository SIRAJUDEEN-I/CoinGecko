'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Coin } from '@/types/crypto';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CoinTableProps {
  coins: Coin[];
}

export default function CoinTable({ coins }: CoinTableProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    const IconComponent = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <IconComponent className="h-3 w-3" />
        <span>{Math.abs(percentage).toFixed(2)}%</span>
      </span>
    );
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  return (
    <div className="rounded-md border border-crypto-dark-border bg-crypto-dark-card">
      <Table>
        <TableHeader>
          <TableRow className="border-crypto-dark-border hover:bg-crypto-dark-hover">
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right">7d %</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => (
            <TableRow 
              key={coin.id} 
              className="border-crypto-dark-border hover:bg-crypto-dark-hover transition-colors"
            >
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWatchlist(coin)}
                  className={`w-8 h-8 p-0 ${
                    isInWatchlist(coin.id) 
                      ? 'text-crypto-gold hover:text-crypto-gold/80' 
                      : 'text-muted-foreground hover:text-crypto-gold'
                  }`}
                >
                  {isInWatchlist(coin.id) ? '★' : '☆'}
                </Button>
              </TableCell>
              <TableCell className="font-medium text-muted-foreground">
                {coin.market_cap_rank}
              </TableCell>
              <TableCell>
                <Link 
                  href={`/coin/${coin.id}`}
                  className="flex items-center space-x-3 hover:text-crypto-accent transition-colors"
                >
                  <Image 
                    src={coin.image} 
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-sm text-muted-foreground uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatPrice(coin.current_price)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  {formatPercentage(coin.price_change_percentage_24h)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  {formatPercentage(coin.price_change_percentage_7d_in_currency || 0)}
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatMarketCap(coin.market_cap)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatVolume(coin.total_volume)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
