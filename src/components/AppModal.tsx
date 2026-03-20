"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AppModalProps {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

const maxWidthMap = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[550px]",
  lg: "sm:max-w-[700px]",
  xl: "sm:max-w-[850px]",
  "2xl": "sm:max-w-[1000px]",
  "3xl": "sm:max-w-[1200px]",
  "4xl": "sm:max-w-[1400px]",
  "5xl": "sm:max-w-[1600px]",
  full: "sm:max-w-[95vw]",
};

export function AppModal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  className,
  maxWidth = "sm",
}: AppModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(maxWidthMap[maxWidth], className)}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
