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

interface ButtonPresetEditorProps {
  preset: any;
  isNew?: boolean;
}

export function ButtonPresetEditor({ preset, isNew = false }: ButtonPresetEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [presetData, setPresetData] = useState(preset);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from name for new presets
  useEffect(() => {
    if (isNew && presetData.name && !presetData.slug) {
      const newSlug = presetData.name
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setPresetData((prev: any) => ({ ...prev, slug: newSlug }));
    }
  }, [presetData.name, isNew, presetData.slug]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = isNew ? "/api/button-presets" : `/api/button-presets/${preset._id}`;
      const method = isNew ? "POST" : "PATCH";

      // Remove _id and other non-serializable fields for new presets
      const dataToSend = isNew
        ? {
            name: presetData.name,
            slug: presetData.slug,
            description: presetData.description,
            colors: presetData.colors,
            sizes: presetData.sizes,
            borderRadius: presetData.borderRadius,
            isActive: presetData.isActive,
            isDefault: presetData.isDefault,
          }
        : presetData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if this preset is the active one
        const settingsResponse = await fetch("/api/button-presets/active-css");
        const settingsData = await settingsResponse.json();
        const isActivePreset = !isNew && settingsData.preset?.slug === (data.preset?.slug || presetData.slug);
        
        toast({
          title: isNew ? "Button preset created" : "Button preset updated",
          description: isActivePreset 
            ? "Your changes have been saved. If this preset is active, refresh your website pages to see the updates."
            : "Your changes have been saved successfully.",
        });

        // If this is the active preset, trigger a CSS refresh on any open public pages
        if (isActivePreset && typeof window !== "undefined") {
          // Dispatch event to refresh preset CSS (this will update the style tag on public pages)
          window.dispatchEvent(new CustomEvent("refreshButtonPreset"));
          
          // Also dispatch the update event for buttons
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("buttonPresetUpdated"));
          }, 200);
        }

        if (isNew) {
          router.push(`/admin/button-presets/${data.preset._id}`);
        } else {
          router.refresh();
        }
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to save button preset.",
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
    setPresetData({
      ...presetData,
      colors: {
        ...presetData.colors,
        [key]: value,
      },
    });
  };

  const updateSizes = (size: string, key: string, value: string) => {
    setPresetData({
      ...presetData,
      sizes: {
        ...presetData.sizes,
        [size]: {
          ...presetData.sizes[size],
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/button-presets">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {isNew ? "Create New Button Preset" : "Edit Button Preset"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : isNew ? "Create Preset" : "Save Changes"}
        </Button>
      </div>

      {/* Info about active preset */}
      {!isNew && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> If this preset is currently active, you may need to refresh your website pages 
            to see the updated button styles. Changes are saved immediately but may require a page refresh to display.
          </p>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Preset Name</Label>
                <Input
                  id="name"
                  value={presetData.name || ""}
                  onChange={(e) => setPresetData({ ...presetData, name: e.target.value })}
                  placeholder="e.g., Modern Buttons"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={presetData.slug || ""}
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
                    setPresetData({ ...presetData, slug });
                  }}
                  placeholder="modern-buttons"
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (auto-generated from name)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={presetData.description || ""}
                  onChange={(e) => setPresetData({ ...presetData, description: e.target.value })}
                  placeholder="Describe your button preset..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius Style</Label>
                <Select
                  value={presetData.borderRadius || "rounded"}
                  onValueChange={(value: "rounded" | "square" | "pill") => 
                    setPresetData({ ...presetData, borderRadius: value })
                  }
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
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={presetData.isActive !== false}
                  onChange={(e) => setPresetData({ ...presetData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="cursor-pointer font-medium">
                  Active (preset can be used)
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
                    value={presetData.colors?.primary || "#667eea"}
                    onChange={(e) => updateColors("primary", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={presetData.colors?.primary || "#667eea"}
                    onChange={(e) => updateColors("primary", e.target.value)}
                    placeholder="#667eea"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryHover">Primary Hover Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryHover"
                    type="color"
                    value={presetData.colors?.primaryHover || "#5a67d8"}
                    onChange={(e) => updateColors("primaryHover", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={presetData.colors?.primaryHover || "#5a67d8"}
                    onChange={(e) => updateColors("primaryHover", e.target.value)}
                    placeholder="#5a67d8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={presetData.colors?.secondary || "#764ba2"}
                    onChange={(e) => updateColors("secondary", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={presetData.colors?.secondary || "#764ba2"}
                    onChange={(e) => updateColors("secondary", e.target.value)}
                    placeholder="#764ba2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryHover">Secondary Hover Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryHover"
                    type="color"
                    value={presetData.colors?.secondaryHover || "#6b3d8f"}
                    onChange={(e) => updateColors("secondaryHover", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={presetData.colors?.secondaryHover || "#6b3d8f"}
                    onChange={(e) => updateColors("secondaryHover", e.target.value)}
                    placeholder="#6b3d8f"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text"
                    type="color"
                    value={presetData.colors?.text || "#ffffff"}
                    onChange={(e) => updateColors("text", e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={presetData.colors?.text || "#ffffff"}
                    onChange={(e) => updateColors("text", e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sizes" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Small (sm)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sm-height">Height</Label>
                    <Input
                      id="sm-height"
                      value={presetData.sizes?.sm?.height || "2.25rem"}
                      onChange={(e) => updateSizes("sm", "height", e.target.value)}
                      placeholder="2.25rem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sm-paddingX">Padding X</Label>
                    <Input
                      id="sm-paddingX"
                      value={presetData.sizes?.sm?.paddingX || "0.75rem"}
                      onChange={(e) => updateSizes("sm", "paddingX", e.target.value)}
                      placeholder="0.75rem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sm-fontSize">Font Size</Label>
                    <Input
                      id="sm-fontSize"
                      value={presetData.sizes?.sm?.fontSize || "0.875rem"}
                      onChange={(e) => updateSizes("sm", "fontSize", e.target.value)}
                      placeholder="0.875rem"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Default</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-height">Height</Label>
                    <Input
                      id="default-height"
                      value={presetData.sizes?.default?.height || "2.5rem"}
                      onChange={(e) => updateSizes("default", "height", e.target.value)}
                      placeholder="2.5rem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-paddingX">Padding X</Label>
                    <Input
                      id="default-paddingX"
                      value={presetData.sizes?.default?.paddingX || "1rem"}
                      onChange={(e) => updateSizes("default", "paddingX", e.target.value)}
                      placeholder="1rem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-fontSize">Font Size</Label>
                    <Input
                      id="default-fontSize"
                      value={presetData.sizes?.default?.fontSize || "0.875rem"}
                      onChange={(e) => updateSizes("default", "fontSize", e.target.value)}
                      placeholder="0.875rem"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Large (lg)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lg-height">Height</Label>
                    <Input
                      id="lg-height"
                      value={presetData.sizes?.lg?.height || "2.75rem"}
                      onChange={(e) => updateSizes("lg", "height", e.target.value)}
                      placeholder="2.75rem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lg-paddingX">Padding X</Label>
                    <Input
                      id="lg-paddingX"
                      value={presetData.sizes?.lg?.paddingX || "2rem"}
                      onChange={(e) => updateSizes("lg", "paddingX", e.target.value)}
                      placeholder="2rem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lg-fontSize">Font Size</Label>
                    <Input
                      id="lg-fontSize"
                      value={presetData.sizes?.lg?.fontSize || "1rem"}
                      onChange={(e) => updateSizes("lg", "fontSize", e.target.value)}
                      placeholder="1rem"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

