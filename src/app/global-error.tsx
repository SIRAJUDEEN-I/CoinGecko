'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
          <Card className="bg-gray-800 border-gray-700 max-w-lg w-full">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-red-500/10">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold mb-2 text-red-500">
                Critical Error
              </CardTitle>
              <p className="text-gray-400">
                A critical error occurred that prevented the application from loading.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {error.message && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-sm text-red-400 font-medium mb-1">Error Details:</p>
                  <p className="text-sm text-gray-300 font-mono break-words">
                    {error.message}
                  </p>
                </div>
              )}
              
              <Button 
                onClick={reset}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Application</span>
              </Button>
              
              {error.digest && (
                <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                  <p className="text-xs text-gray-500">
                    Error ID: <code className="bg-gray-700 px-1 py-0.5 rounded">{error.digest}</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
