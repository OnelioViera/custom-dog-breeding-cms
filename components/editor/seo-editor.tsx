"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface SEOEditorProps {
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
    focusKeyword?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
  onChange: (seo: any) => void;
}

export function SEOEditor({ seo, onChange }: SEOEditorProps) {
  const updateField = (field: string, value: any) => {
    onChange({
      ...seo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Basic SEO</h3>
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={seo.metaTitle || ""}
            onChange={(e) => updateField("metaTitle", e.target.value)}
            placeholder="Page title for search engines"
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground">
            {seo.metaTitle?.length || 0}/60 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={seo.metaDescription || ""}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            placeholder="Brief description for search results"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">
            {seo.metaDescription?.length || 0}/160 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="focusKeyword">Focus Keyword</Label>
          <Input
            id="focusKeyword"
            value={seo.focusKeyword || ""}
            onChange={(e) => updateField("focusKeyword", e.target.value)}
            placeholder="Primary keyword for this page"
          />
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Open Graph (Social Media)</h3>
        <div className="space-y-2">
          <Label htmlFor="ogTitle">OG Title</Label>
          <Input
            id="ogTitle"
            value={seo.ogTitle || ""}
            onChange={(e) => updateField("ogTitle", e.target.value)}
            placeholder="Title for social media shares"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ogDescription">OG Description</Label>
          <Textarea
            id="ogDescription"
            value={seo.ogDescription || ""}
            onChange={(e) => updateField("ogDescription", e.target.value)}
            placeholder="Description for social media shares"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ogImage">OG Image URL</Label>
          <Input
            id="ogImage"
            value={seo.ogImage || ""}
            onChange={(e) => updateField("ogImage", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Advanced</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="noIndex"
            checked={seo.noIndex || false}
            onChange={(e) => updateField("noIndex", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="noIndex" className="cursor-pointer">
            No Index (prevent search engines from indexing)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="noFollow"
            checked={seo.noFollow || false}
            onChange={(e) => updateField("noFollow", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="noFollow" className="cursor-pointer">
            No Follow (prevent search engines from following links)
          </Label>
        </div>
      </Card>
    </div>
  );
}

