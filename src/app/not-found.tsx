'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center px-4">
      <Card className="bg-crypto-dark-card border-crypto-dark-border max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-crypto-accent/10">
              <TrendingUp className="h-12 w-12 text-crypto-accent" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
          <p className="text-xl text-muted-foreground">Page Not Found</p>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/" className="flex items-center justify-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Go to Markets</span>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/watchlist" className="flex items-center justify-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>View Watchlist</span>
              </Link>
            </Button>
          </div>
          
          {pathname && pathname !== '/' && (
            <div className="mt-6 pt-4 border-t border-crypto-dark-border">
              <p className="text-sm text-muted-foreground">
                Requested path: <code className="bg-muted px-1 py-0.5 rounded text-xs">{pathname}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
