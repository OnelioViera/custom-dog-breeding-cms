"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Page {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
}

interface PageLinkSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function PageLinkSelector({
  value,
  onChange,
  placeholder = "/page",
  label = "Link",
}: PageLinkSelectorProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomLink, setIsCustomLink] = useState(false);

  useEffect(() => {
    // Fetch published pages
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => {
        if (data.pages) {
          // Filter to only published pages and sort by title
          const publishedPages = data.pages
            .filter((page: Page) => page.status === "published")
            .sort((a: Page, b: Page) => a.title.localeCompare(b.title));
          setPages(publishedPages);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pages:", error);
        setIsLoading(false);
      });
  }, []);

  // Check if current value is a custom link (not matching any page slug)
  useEffect(() => {
    const matchingPage = pages.find((page) => `/${page.slug}` === value);
    setIsCustomLink(!matchingPage && value !== "");
  }, [value, pages]);

  const handleSelectChange = (selectedSlug: string) => {
    if (selectedSlug === "custom") {
      setIsCustomLink(true);
      // Keep the current value if it exists, otherwise clear it
      if (!value || pages.some((p) => `/${p.slug}` === value)) {
        onChange("");
      }
    } else {
      setIsCustomLink(false);
      onChange(`/${selectedSlug}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select
          value={
            isCustomLink
              ? "custom"
              : pages.find((p) => `/${p.slug}` === value)?.slug || ""
          }
          onValueChange={handleSelectChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Link</SelectItem>
            {pages.length > 0 && (
              <>
                {pages.map((page) => (
                  <SelectItem key={page._id} value={page.slug}>
                    {page.title}
                  </SelectItem>
                ))}
              </>
            )}
            {!isLoading && pages.length === 0 && (
              <SelectItem value="no-pages" disabled>
                No published pages
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1"
        />
      </div>
      {value && !isCustomLink && (
        <p className="text-xs text-muted-foreground">
          Selected: {pages.find((p) => `/${p.slug}` === value)?.title}
        </p>
      )}
    </div>
  );
}

