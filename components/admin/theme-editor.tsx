"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ThemeEditorProps {
  theme: any;
  isNew?: boolean;
}

export function ThemeEditor({ theme, isNew = false }: ThemeEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [themeData, setThemeData] = useState(theme);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from name for new themes
  useEffect(() => {
    if (isNew && themeData.name && !themeData.slug) {
      const newSlug = themeData.name
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setThemeData((prev: any) => ({ ...prev, slug: newSlug }));
    }
  }, [themeData.name, isNew, themeData.slug]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = isNew ? "/api/themes" : `/api/themes/${theme._id}`;
      const method = isNew ? "POST" : "PATCH";

      // Remove _id and other non-serializable fields for new themes
      const dataToSend = isNew
        ? {
            name: themeData.name,
            slug: themeData.slug,
            description: themeData.description,
            colors: themeData.colors,
            typography: themeData.typography,
            styles: themeData.styles,
            isActive: themeData.isActive,
            isDefault: themeData.isDefault,
            customCSS: themeData.customCSS,
          }
        : themeData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: isNew ? "Theme created" : "Theme updated",
          description: "Your changes have been saved successfully.",
        });

        if (isNew) {
          router.push(`/admin/themes/${data.theme._id}`);
        } else {
          router.refresh();
        }
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to save theme.",
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

  const updateColors = (key: string, value: string) => {
    setThemeData({
      ...themeData,
      colors: {
        ...themeData.colors,
        [key]: value,
      },
    });
  };

  const updateTypography = (key: string, value: any) => {
    setThemeData({
      ...themeData,
      typography: {
        ...themeData.typography,
        [key]: value,
      },
    });
  };

  const updateStyles = (key: string, value: any) => {
    setThemeData({
      ...themeData,
      styles: {
        ...themeData.styles,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/themes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {isNew ? "Create New Theme" : "Edit Theme"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : isNew ? "Create Theme" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Theme Name</Label>
                <Input
                  id="name"
                  value={themeData.name || ""}
                  onChange={(e) => setThemeData({ ...themeData, name: e.target.value })}
                  placeholder="e.g., Modern Breeder"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={themeData.slug || ""}
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
                    setThemeData({ ...themeData, slug });
                  }}
                  placeholder="modern-breeder"
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (auto-generated from name)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={themeData.description || ""}
                  onChange={(e) => setThemeData({ ...themeData, description: e.target.value })}
                  placeholder="Describe your theme..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={themeData.isActive !== false}
                  onChange={(e) => setThemeData({ ...themeData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="cursor-pointer font-medium">
                  Active (theme can be used)
                </Label>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={themeData.colors?.primary || "#667eea"}
                    onChange={(e) => updateColors("primary", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={themeData.colors?.primary || "#667eea"}
                    onChange={(e) => updateColors("primary", e.target.value)}
                    placeholder="#667eea"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={themeData.colors?.secondary || "#764ba2"}
                    onChange={(e) => updateColors("secondary", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={themeData.colors?.secondary || "#764ba2"}
                    onChange={(e) => updateColors("secondary", e.target.value)}
                    placeholder="#764ba2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent"
                    type="color"
                    value={themeData.colors?.accent || "#818cf8"}
                    onChange={(e) => updateColors("accent", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={themeData.colors?.accent || "#818cf8"}
                    onChange={(e) => updateColors("accent", e.target.value)}
                    placeholder="#818cf8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="background">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={themeData.colors?.background || "#ffffff"}
                    onChange={(e) => updateColors("background", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={themeData.colors?.background || "#ffffff"}
                    onChange={(e) => updateColors("background", e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="foreground">Foreground (Text) Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="foreground"
                    type="color"
                    value={themeData.colors?.foreground || "#1f2937"}
                    onChange={(e) => updateColors("foreground", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={themeData.colors?.foreground || "#1f2937"}
                    onChange={(e) => updateColors("foreground", e.target.value)}
                    placeholder="#1f2937"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destructive">Destructive (Error) Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="destructive"
                    type="color"
                    value={themeData.colors?.destructive || "#ef4444"}
                    onChange={(e) => updateColors("destructive", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={themeData.colors?.destructive || "#ef4444"}
                    onChange={(e) => updateColors("destructive", e.target.value)}
                    placeholder="#ef4444"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                  id="fontFamily"
                  value={themeData.typography?.fontFamily || "Inter, sans-serif"}
                  onChange={(e) => updateTypography("fontFamily", e.target.value)}
                  placeholder="Inter, sans-serif"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headingFont">Heading Font Family (optional)</Label>
                <Input
                  id="headingFont"
                  value={themeData.typography?.headingFont || ""}
                  onChange={(e) => updateTypography("headingFont", e.target.value)}
                  placeholder="Leave empty to use main font"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="styles" className="space-y-6">
          {/* General Styles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">General Styles</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  value={themeData.styles?.borderRadius || "0.5rem"}
                  onChange={(e) => updateStyles("borderRadius", e.target.value)}
                  placeholder="0.5rem"
                />
                <p className="text-xs text-muted-foreground">
                  Default border radius for UI elements (e.g., 0.5rem, 0.25rem, 0)
                </p>
              </div>
            </div>
          </Card>

          {/* Button Styles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Button Styles</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buttonStyle">Button Border Radius</Label>
                <Select
                  value={themeData.styles?.buttonStyle || "rounded"}
                  onValueChange={(value: "rounded" | "square" | "pill") => updateStyles("buttonStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="pill">Pill</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls the border radius style for all buttons
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> For more advanced button customization (colors, sizes, hover effects), 
                  use the <Link href="/admin/button-presets" className="text-primary underline">Button Presets</Link> feature.
                </p>
              </div>
            </div>
          </Card>

          {/* Navbar Styles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Navbar Styles</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="navbarStyle">Navbar Layout Style</Label>
                <Select
                  value={themeData.styles?.navbarStyle || "default"}
                  onValueChange={(value: "default" | "centered" | "minimal" | "sticky") => updateStyles("navbarStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="centered">Centered</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="sticky">Sticky</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  <strong>Default:</strong> Standard navbar with logo on left, links on right<br/>
                  <strong>Centered:</strong> Centered logo and navigation links<br/>
                  <strong>Minimal:</strong> Compact navbar with reduced padding<br/>
                  <strong>Sticky:</strong> Navbar stays fixed at the top when scrolling
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Note:</strong> Additional navbar settings (logo, position, visibility) can be configured 
                  in the <Link href="/admin/pages" className="text-primary underline">Page Editor</Link> under the Navbar tab.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

