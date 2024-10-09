"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex items-center justify-center min-h-[100dvh] bg-gray-50">
        <div className="max-w-md space-y-8 p-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Oops! Something Went Wrong
          </h2>
          <p className="text-base text-gray-500">
            We encountered an error. Don’t worry, you can try again to resolve
            the issue.
          </p>
          <Button
            className="max-w-48 mx-auto flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => reset()}
          >
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}
