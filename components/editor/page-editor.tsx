"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockEditor } from "./block-editor";
import { SEOEditor } from "./seo-editor";
import { LivePreview } from "./live-preview";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";

interface PageEditorProps {
  page: any;
  isNew?: boolean;
}

export function PageEditor({ page, isNew = false }: PageEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [pageData, setPageData] = useState(page);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    try {
      const url = isNew ? "/api/pages" : `/api/pages/${page._id}`;
      const method = isNew ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pageData, status }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: status === "draft" ? "Draft saved" : "Page published",
          description: "Your changes have been saved successfully.",
        });
        
        // Update pageData with the saved data
        if (data.page) {
          setPageData({ ...pageData, ...data.page, status });
        }
        
        if (isNew) {
          router.push(`/admin/pages/${data.page._id}`);
        } else {
          router.refresh();
        }
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to save changes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Editor Panel */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isNew ? "Create New Page" : "Edit Page"}
          </h1>
          <div className="flex gap-2">
            {!isNew && pageData.status === "published" && pageData.slug && (
              <Link href={`/${pageData.slug}`} target="_blank">
                <Button variant="outline" size="sm" title="View published page">
                  <Eye className="w-4 h-4 mr-2" />
                  View Live
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              disablePreset={true}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button 
              onClick={() => handleSave("published")} 
              disabled={isSaving}
              disablePreset={true}
            >
              {isSaving ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="navbar">Navbar</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={pageData.title || ""}
                onChange={(e) => {
                  const title = e.target.value;
                  // Auto-generate slug from title if slug is empty or matches the old title-based slug
                  const autoSlug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  
                  // Only auto-update slug if it's empty or was previously auto-generated
                  const currentSlug = pageData.slug || "";
                  const shouldAutoUpdate = !currentSlug || 
                    currentSlug === (pageData.title || "")
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                  
                  setPageData({
                    ...pageData,
                    title,
                    slug: shouldAutoUpdate ? autoSlug : currentSlug,
                    seo: {
                      ...pageData.seo,
                      slug: shouldAutoUpdate ? autoSlug : currentSlug,
                    },
                  });
                }}
                placeholder="Enter page title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={pageData.slug || ""}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
                  setPageData({
                    ...pageData,
                    slug,
                    seo: { ...pageData.seo, slug },
                  });
                }}
                placeholder="page-slug"
              />
              <p className="text-xs text-muted-foreground">
                URL: /{pageData.slug || "page-slug"}
                {isNew && (
                  <span className="block mt-1 text-blue-600">
                    Slug will be auto-generated from title
                  </span>
                )}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Blocks</Label>
              <BlockEditor
                blocks={pageData.blocks || []}
                onChange={(blocks) => setPageData({ ...pageData, blocks })}
              />
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <SEOEditor
              seo={pageData.seo || {}}
              onChange={(seo) => setPageData({ ...pageData, seo })}
            />
          </TabsContent>

          <TabsContent value="navbar" className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-lg">Navigation Bar Settings</h3>
              <p className="text-sm text-muted-foreground">
                Control how this page appears in the website navigation bar.
              </p>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="showInNavbar"
                  checked={pageData.showInNavbar ?? true}
                  onChange={(e) =>
                    setPageData({ ...pageData, showInNavbar: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="showInNavbar" className="cursor-pointer font-medium">
                  Show this page in navigation bar
                </Label>
              </div>
              
              {pageData.showInNavbar && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="navbarPosition">Navigation Position</Label>
                  <Input
                    id="navbarPosition"
                    type="number"
                    min="0"
                    value={pageData.navbarPosition ?? ""}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        navbarPosition: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="Leave empty for auto-order"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first in the navbar. Leave empty to order alphabetically.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Preview Panel */}
      <div className="sticky top-6">
        <LivePreview pageData={pageData} />
      </div>
    </div>
  );
}

