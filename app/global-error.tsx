'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Application Error
              </h1>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-center text-gray-600">
                A critical error occurred. Please refresh the page or try again later.
              </p>
              {error.digest && (
                <p className="text-center text-sm text-gray-500">
                  Error ID: {error.digest}
                </p>
              )}
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
