import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--teal)] text-white hover:bg-[var(--ink)] shadow-md hover:shadow-lg active:scale-[0.98]": variant === "default",
            "bg-[var(--gold)] text-[var(--ink)] hover:bg-[#e8ac2f]": variant === "secondary",
            "border border-[#E7E5E4] bg-white hover:bg-[#FAFAF9] text-[#1C1917]": variant === "outline",
            "hover:bg-[var(--ivory)] hover:text-[var(--teal)]": variant === "ghost",
            "text-[var(--teal)] underline-offset-4 hover:underline": variant === "link",
          },
          {
            "h-10 px-6 py-2": size === "default",
            "h-9 rounded-full px-4 text-xs": size === "sm",
            "h-12 rounded-full px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
