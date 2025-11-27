import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type FC,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";

// --- Type Definitions (omitted for brevity) ---
export interface Banner {
  id: number;
  title: string;
  image: string;
  url?: string;
  order?: number;
}
interface BannerCarouselProps {
  banners: Banner[];
  className?: string;
  autoPlayMs?: number;
}

// --- Component ---

export const BannerCarousel: FC<BannerCarouselProps> = ({
  banners,
  className,
  autoPlayMs = 5000,
}) => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = banners.length;
  const isAutomatic = totalSlides > 1 && autoPlayMs > 0;

  // --- Core Functions ---

  const goToSlide = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + totalSlides) % totalSlides);
      // Pause autoplay when the user manually interacts
      setIsPlaying(false);
    },
    [totalSlides]
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setTimer = useCallback(() => {
    if (!isAutomatic || !isPlaying) return;
    clearTimer();
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % totalSlides);
    }, autoPlayMs);
  }, [isAutomatic, isPlaying, totalSlides, autoPlayMs, clearTimer]);

  // --- Effects ---

 
  useEffect(() => {
    setTimer();
    return clearTimer;
  }, [setTimer, clearTimer]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scrollAmount = index * container.offsetWidth;

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });

    const statusEl = document.getElementById("carousel-status");
    if (statusEl) {
      statusEl.textContent = `Slide ${index + 1} of ${totalSlides}`;
    }
  }, [index, totalSlides]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToSlide(-1);
    else if (e.key === "ArrowRight") goToSlide(1);
  };

  if (!banners.length) return null;

  const carouselId = useMemo(
    () => `carousel-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  return (
    <div
      id={carouselId}
      className={cn(
        "relative group focus-visible:ring-4  focus-visible:ring-indigo-500 rounded-xl",
        className
      )}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Product Showcase Carousel"
      role="region"
    >
      <div
        id="carousel-status "
        role="status"
        className="sr-only "
        aria-live="polite"
      >
        {`Slide ${index + 1} of ${totalSlides}`}
      </div>

      <div
        ref={containerRef}
        className="flex w-full h-full overflow-x-hidden snap-x snap-mandatory no-scrollbar rounded-xl"
        onMouseEnter={clearTimer}
        onMouseLeave={setTimer}
        aria-live="polite"
      >
        {banners.map((b) => (
          <div
            key={b.id}
            className="relative  min-w-full snap-start md:aspect-16/6 aspect-4/3 bg-indigo-50/50 overflow-hidden"
            role="group"
            aria-label={`Slide ${b.order || b.id} of ${totalSlides}`}
          >
            <img
              src={b.image}
              alt={b.title}
              className="absolute inset-0 h-full w-full object-fit transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 p-6 md:p-12 h-full flex flex-col justify-center max-w-xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tighter text-white drop-shadow-md">
                {b.title}
              </h2>
              {b.url && (
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="mt-6 w-fit bg-[#4F46E5] hover:bg-[#3730A3] text-white shadow-xl transition-shadow duration-300"
                >
                  <a href={b.url}>Shop Now &rarr;</a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAutomatic && totalSlides > 1 && (
        <>
          {/* Pause/Play Button */}
          <button
            aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
            onClick={() => setIsPlaying((prev) => !prev)}
            className="absolute left-3 top-3 rounded-full bg-black/40 text-white size-8 grid place-content-center hover:bg-black/60 z-30 transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          {/* Arrows */}
          <button
            aria-label="Previous slide"
            onClick={() => goToSlide(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white size-10 grid place-content-center hover:bg-black/60 z-30 transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => goToSlide(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white size-10 grid place-content-center hover:bg-black/60 z-30 transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ArrowRight size={20} />
          </button>
        </>
      )}

      {/* Dots (Pagination Indicators) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
        {banners.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : "false"}
            onClick={() => goToSlide(i - index)}
            className={cn(
              "size-2.5 md:size-3 rounded-full transition-all duration-300 ring-2 ring-white/50",
              i === index
                ? "bg-white shadow-lg scale-110 ring-opacity-100"
                : "bg-white/50 hover:bg-white/80 ring-opacity-50"
            )}
          />
        ))}
      </div>
    </div>
  );
};
