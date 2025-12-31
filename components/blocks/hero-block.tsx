"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroBlockProps {
  content: {
    title?: string;
    subtitle?: string;
    image?: string;
    ctaText?: string;
    ctaLink?: string;
    showCTA?: boolean;
    layout?: "centered" | "left" | "pattern" | "minimal";
  };
}

export function HeroBlock({ content }: HeroBlockProps) {
  const layout = content.layout || "centered";
  const patternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  // Base classes for all layouts
  const baseClasses = "relative w-full py-20 px-6 text-white";
  
  // Layout-specific classes
  const layoutClasses = {
    centered: "text-center bg-gradient-to-br from-primary to-secondary",
    left: "text-left bg-gradient-to-r from-primary via-secondary to-primary",
    pattern: "text-center bg-gradient-to-b from-primary/80 to-secondary/80",
    minimal: "text-center bg-white border-2 border-primary/20",
  };

  // Content container classes
  const containerClasses = {
    centered: "max-w-3xl mx-auto",
    left: "max-w-3xl",
    pattern: "max-w-3xl mx-auto",
    minimal: "max-w-3xl mx-auto",
  };

  // Text color classes
  const textColorClasses = {
    centered: "text-white",
    left: "text-white",
    pattern: "text-white",
    minimal: "text-gray-900",
  };

  return (
    <div
      className={cn(baseClasses, layoutClasses[layout])}
      style={
        content.image
          ? {
              backgroundImage: `url(${content.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {content.image && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      {layout === "pattern" && !content.image && (
        <>
          <div className="absolute inset-0 bg-black/30" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url("${patternUrl}")` }}
          />
        </>
      )}
      {layout === "minimal" && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      )}
      <div className={cn("relative z-10", containerClasses[layout])}>
        {content.title && (
          <h1 className={cn(
            "text-4xl md:text-5xl font-bold mb-4",
            layout === "minimal" ? "text-primary" : textColorClasses[layout]
          )}>
            {content.title}
          </h1>
        )}
        {content.subtitle && (
          <div
            className={cn(
              "text-xl md:text-2xl mb-6 opacity-90 max-w-none",
              layout === "minimal" 
                ? "prose prose-gray-700" 
                : "prose prose-invert",
              textColorClasses[layout]
            )}
            dangerouslySetInnerHTML={{ __html: content.subtitle }}
          />
        )}
        {content.showCTA !== false && content.ctaText && (
          <Link href={content.ctaLink || "#"}>
            <Button 
              size="lg" 
              variant={layout === "minimal" ? "default" : "secondary"}
              className={layout === "minimal" ? "bg-primary" : ""}
            >
              {content.ctaText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

