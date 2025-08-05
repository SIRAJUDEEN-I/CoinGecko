'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center px-4">
      <Card className="bg-crypto-dark-card border-crypto-dark-border max-w-lg w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-crypto-red/10">
              <AlertTriangle className="h-12 w-12 text-crypto-red" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold mb-2 text-crypto-red">
            Something went wrong!
          </CardTitle>
          <p className="text-muted-foreground">
            An unexpected error occurred while loading the page.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error.message && (
            <div className="bg-crypto-red/10 border border-crypto-red/20 rounded-lg p-4">
              <p className="text-sm text-crypto-red font-medium mb-1">Error Details:</p>
              <p className="text-sm text-muted-foreground font-mono break-words">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/" className="flex items-center justify-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Go to Home</span>
              </Link>
            </Button>
          </div>
          
          {error.digest && (
            <div className="mt-6 pt-4 border-t border-crypto-dark-border text-center">
              <p className="text-xs text-muted-foreground">
                Error ID: <code className="bg-muted px-1 py-0.5 rounded">{error.digest}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
