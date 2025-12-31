"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ButtonPresetListProps {
  presets: Array<{
    _id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    isDefault: boolean;
    colors: {
      primary: string;
      secondary: string;
    };
    borderRadius: "rounded" | "square" | "pill";
    createdBy: { name: string };
  }>;
}

export function ButtonPresetList({ presets }: ButtonPresetListProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const response = await fetch(`/api/button-presets/${deletingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Button preset deleted",
          description: "The button preset has been successfully deleted.",
        });
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete button preset",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the button preset.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleApplyPreset = async (presetId: string) => {
    setApplyingId(presetId);
    try {
      const response = await fetch("/api/button-presets/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId }),
      });

      if (response.ok) {
        toast({
          title: "Button preset applied",
          description: "The button preset has been applied. Refreshing page...",
        });
        // Force a full page refresh to ensure CSS is reloaded
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to apply button preset",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while applying the button preset.",
        variant: "destructive",
      });
    } finally {
      setApplyingId(null);
    }
  };

  if (presets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No button presets found.</p>
        <Link href="/admin/button-presets/new">
          <Button>+ Create Your First Button Preset</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use Button Presets</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
          <li>Create a button preset with your desired colors, sizes, and border radius</li>
          <li>Click <strong>"Apply Preset"</strong> on any preset card to make it active</li>
          <li>The active preset will automatically style <strong>all buttons</strong> across your website</li>
          <li>Buttons in the page editor, live preview, and published pages will all use the active preset</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <Card key={preset._id} className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{preset.name}</h3>
                  {preset.isDefault && (
                    <Badge variant="default" className="bg-primary">
                      Default
                    </Badge>
                  )}
                  {!preset.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                {preset.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {preset.description}
                  </p>
                )}
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex gap-2 mb-4">
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: preset.colors.primary }}
                title="Primary Color"
              />
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: preset.colors.secondary }}
                title="Secondary Color"
              />
            </div>

            <div className="text-xs text-muted-foreground mb-4">
              Style: <code className="bg-gray-100 px-1 rounded">{preset.borderRadius}</code>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant={preset.isDefault ? "default" : "outline"}
                size="sm"
                onClick={() => handleApplyPreset(preset._id)}
                disabled={applyingId === preset._id || !preset.isActive}
                className="w-full"
              >
                {applyingId === preset._id ? (
                  "Applying..."
                ) : preset.isDefault ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Active Preset
                  </>
                ) : (
                  "Apply Preset"
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Link href={`/admin/button-presets/${preset._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                {!preset.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(preset._id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your button preset
              and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

