import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HorizontalScrollerProps {
  children: React.ReactNode;
  className?: string;
}

export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  className,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: dir * ref.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };
  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 no-scrollbar"
      >
        {children}
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center pl-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
        >
          <ChevronLeft />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
