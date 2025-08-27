"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "input-field min-h-[120px] max-h-[400px] w-full px-4 py-4 text-sm font-body text-text-primary placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50 resize-y leading-relaxed overflow-y-auto",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
