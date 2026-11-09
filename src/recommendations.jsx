import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, Linkedin, Quote } from "lucide-react";

const ACCENT = "hsl(var(--hero-accent))";
const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
const attribution = (item) =>
  [item.designation, item.company].filter(Boolean).join(" · ");

/** The reference Home carousel: layered cards, both arrows, six-second advance. */
export function Testimonials({ items, Fade }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length],
  );
  const previous = () => setIndex((i) => (i - 1 + items.length) % items.length);
  useEffect(() => {
    if (
      paused ||
      items.length < 2 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next, items.length]);
  const arrowClass =
    "w-9 h-9 rounded-full border border-border/60 flex items-center justify-center transition-all duration-200 hover:border-foreground/20 hover:bg-muted";
  return (
    <section className="py-24 lg:py-36" data-home-recommendations>
      <div className="container mx-auto px-6 lg:px-20 max-w-6xl">
        <Fade className="mb-16">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-4"
            style={{ color: ACCENT }}
          >
            What people say
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            Quiet confidence,{" "}
            <em className="not-italic" style={{ color: ACCENT }}>
              spoken by others.
            </em>
          </h2>
        </Fade>
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setPaused(false);
          }}
        >
          <div
            className="absolute -top-6 left-0 font-display font-black leading-none select-none pointer-events-none"
            style={{
              fontSize: "clamp(6rem,14vw,12rem)",
              color: `${ACCENT}08`,
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            "
          </div>
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 rounded-3xl border border-border/30 bg-card/50"
              style={{
                transform:
                  "translateX(4%) translateY(34px) scale(0.94) rotate(0.8deg)",
                zIndex: 0,
              }}
            />
            <div
              className="absolute inset-0 rounded-3xl border border-border/40 bg-card/70"
              style={{
                transform:
                  "translateX(2.5%) translateY(18px) scale(0.97) rotate(0.4deg)",
                zIndex: 1,
              }}
            />
          </div>
          <div className="relative" style={{ zIndex: 10 }} aria-live="off">
            {items.map((item, i) => (
              <div
                key={item.name}
                style={{ display: i === index ? "block" : "none" }}
                data-quote-index={i}
                aria-hidden={i !== index}
              >
                <div
                  className="w-full rounded-3xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-2xl overflow-hidden"
                  style={{
                    boxShadow:
                      "0 24px 64px -16px hsl(var(--foreground) / 0.12), 0 0 0 1px hsl(var(--border) / 0.6)",
                  }}
                >
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}60, transparent)`,
                    }}
                  />
                  <div className="p-7 lg:p-12">
                    <p
                      className="font-display text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-foreground leading-relaxed mb-8"
                      style={{ quotes: "none" }}
                    >
                      <span
                        style={{
                          color: ACCENT,
                          fontWeight: 900,
                          fontSize: "1.4em",
                          lineHeight: 0,
                          verticalAlign: "bottom",
                          marginRight: "0.1em",
                        }}
                      >
                        "
                      </span>
                      {item.message}
                      <span
                        style={{
                          color: ACCENT,
                          fontWeight: 900,
                          fontSize: "1.4em",
                          lineHeight: 0,
                          verticalAlign: "top",
                          marginLeft: "0.1em",
                        }}
                      >
                        "
                      </span>
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2"
                          style={{
                            backgroundColor: `${ACCENT}15`,
                            color: ACCENT,
                            borderColor: `${ACCENT}30`,
                          }}
                          aria-hidden="true"
                        >
                          {initials(item.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-tight">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {attribution(item)}
                          </p>
                          {item.period && (
                            <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                              {item.period}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <button
                          onClick={previous}
                          aria-label="Previous testimonial"
                          className={arrowClass}
                          data-quote-previous
                        >
                          <ArrowRight className="w-3.5 h-3.5 rotate-180 text-muted-foreground" />
                        </button>
                        <span
                          className="text-xs font-mono text-muted-foreground/60 select-none"
                          data-quote-counter
                        >
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(items.length).padStart(2, "0")}
                        </span>
                        <button
                          onClick={next}
                          aria-label="Next testimonial"
                          className={arrowClass}
                          data-quote-next
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-8 justify-center">
            {items.map((item, i) => (
              <button
                key={item.name}
                onClick={() => setIndex(i)}
                aria-label={`Testimonial ${i + 1}`}
                aria-pressed={i === index}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === index ? 28 : 6,
                  height: 6,
                  backgroundColor:
                    i === index
                      ? ACCENT
                      : "hsl(var(--muted-foreground) / 0.25)",
                }}
              />
            ))}
          </div>
          <p className="text-center text-[10px] text-muted-foreground/40 tracking-widest uppercase mt-4">
            Tap to navigate · Auto-advances
          </p>
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({ item, duplicate = false }) {
  return (
    <div
      className="relative flex-shrink-0 w-[300px] sm:w-[360px] lg:w-[400px] mx-3 rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 select-none"
      style={{ boxShadow: "0 2px 24px 0 hsl(var(--primary) / 0.07)" }}
      aria-hidden={duplicate || undefined}
      data-recommendation-card={duplicate ? undefined : item.name}
    >
      <Quote
        className="absolute top-5 right-6 opacity-10"
        style={{ width: 38, height: 38, color: "hsl(var(--primary))" }}
        aria-hidden="true"
      />
      <p className="text-card-foreground text-sm sm:text-[15px] leading-relaxed flex-1 font-body pr-4">
        "{item.message}"
      </p>
      <div className="h-px bg-border" />
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
          style={{
            background: "hsl(var(--primary) / 0.1)",
            color: "hsl(var(--primary))",
          }}
          aria-hidden="true"
        >
          {initials(item.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-display font-semibold text-foreground text-sm">
              {item.name}
            </span>
          </div>
          <p className="text-muted-foreground text-xs truncate">
            {attribution(item)}
          </p>
          {item.period && (
            <p className="text-muted-foreground text-[11px] opacity-60 mt-0.5">
              {item.period}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** The reference /about recommendation strip, not the Home carousel or a grid. */
export function AboutRecommendations({ items }) {
  const [paused, setPaused] = useState(false);
  const mask =
    "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)";
  return (
    <section aria-label="Colleague recommendations" data-about-recommendations>
      <div className="container mx-auto px-6 lg:px-0 max-w-2xl mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Linkedin
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "#0A66C2" }}
            aria-hidden="true"
          />
          <span className="text-xs font-body text-muted-foreground uppercase tracking-widest">
            Colleague recommendations
          </span>
        </div>
        <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
          What people say
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {items.length} recommendations from colleagues &amp; collaborators
        </p>
      </div>
      <div
        className="relative overflow-hidden w-full"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-live="off"
        data-recommendation-track
        tabIndex={0}
        aria-label="Recommendations; focus or hover to pause"
      >
        <div
          className="flex py-3"
          style={{
            animation: "marquee 70s linear infinite",
            animationPlayState: paused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {items.map((item) => (
            <RecommendationCard key={item.name} item={item} />
          ))}
          {items.map((item) => (
            <RecommendationCard
              key={`repeat-${item.name}`}
              item={item}
              duplicate
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground opacity-50 tracking-wide">
        Hover to pause
      </p>
    </section>
  );
}
