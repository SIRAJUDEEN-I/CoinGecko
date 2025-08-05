import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center px-4">
      <Card className="bg-crypto-dark-card border-crypto-dark-border max-w-sm w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="p-4 rounded-full bg-crypto-accent/10">
              <TrendingUp className="h-8 w-8 text-crypto-accent animate-pulse" />
            </div>
            <div className="absolute inset-0 border-4 border-crypto-accent/20 border-t-crypto-accent rounded-full animate-spin"></div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold">Loading...</h2>
            <p className="text-sm text-muted-foreground">
              Fetching the latest cryptocurrency data
            </p>
          </div>
          
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
