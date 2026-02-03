import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface SubscriptionButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
    >
      {isSubscribed ? "Unsubcribe" : "Subscribe"}
    </Button>
  );
};
