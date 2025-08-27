"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent",
  {
    variants: {
      variant: {
        default: "button-primary",
        destructive: "bg-error text-white hover:bg-error/90 border-error/30 hover:border-error/50",
        outline: "border-2 border-border/60 bg-background/60 hover:bg-surface/80 hover:text-text-primary hover:border-border-focus/40 backdrop-blur-sm",
        secondary: "bg-surface/80 text-text-primary hover:bg-surface-elevated border-border/40 hover:border-border/60 backdrop-blur-sm",
        ghost: "hover:bg-surface/60 hover:text-text-primary border-transparent hover:border-border/30",
        link: "text-brand-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
