import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        pixelDisabled:
          "bg-gray-400 text-gray-700 border-2 border-gray-500 shadow-[0px_0px_0_0_#9ca3af,2px_2px_0_0_#9ca3af] cursor-not-allowed hover:brightness-100 active:shadow-[0_0_0_0_#000]",

        pixel:
          "bg-yellow-400 text-black border-2 border-black shadow-[0px_0px_0_0_#c69405,2px_2px_0_0_#c69405] " +
          "active:shadow-[0px_0px_0_0_#c69405] active:translate-x-[2px] active:translate-y-[2px]",
        sex5: "bg-radial from-blue-500 to-black hover:text-black text-primary-foreground shadow hover:bg-primary/90",
        sex4: "bg-radial from-teal-500 to-indigo-900 hover:text-black  text-primary-foreground shadow hover:bg-primary/90",
        sex3: "bg-radial from-purple-500 to-indigo-900 hover:text-black  text-primary-foreground shadow hover:bg-primary/90",
        sex: "gradient-background2 hover:text-blue-600 text-primary-foreground shadow hover:bg-primary/90",
        sex1: "gradient-background2 border-2 border-teal-500 hover:text-teal-400 text-primary-foreground shadow hover:bg-primary/90",
        sex2: "gradient-background2 border border-indigo-500 hover:text-indigo-600 text-primary-foreground shadow hover:bg-primary/90",
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        tertiary: "bg-background hover:bg-blue-500/10 text-blue-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
