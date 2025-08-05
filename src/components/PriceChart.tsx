'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MarketChartData } from '@/types/crypto';

interface PriceChartProps {
  data: MarketChartData;
  timeRange: string;
}

export default function PriceChart({ data, timeRange }: PriceChartProps) {
  const chartData = useMemo(() => {
    if (!data.prices) return [];

    return data.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString(),
    }));
  }, [data.prices]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 6 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeRange === '1') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '7' || timeRange === '30') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
  };

  const isPositive = chartData.length > 1 && 
    chartData[chartData.length - 1].price > chartData[0].price;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatPrice}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: number) => [formatPrice(value), 'Price']}
              labelFormatter={(timestamp: number) => {
                const date = new Date(timestamp);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))'}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: isPositive ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
