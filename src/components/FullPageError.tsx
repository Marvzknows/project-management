import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type FullPageErrorProps = {
  message?: string;
  onRetry?: () => void;
};

const FullPageError = ({ message, onRetry }: FullPageErrorProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-[9999]">
      {/* Error Icon */}
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />

      {/* Error Message */}
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
        {message || "An unexpected error occurred. Please try again."}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <Button
          variant="destructive"
          onClick={onRetry}
          className="px-6 py-2 text-sm font-medium"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default FullPageError;
