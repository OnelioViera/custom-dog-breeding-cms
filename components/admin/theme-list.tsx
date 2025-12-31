"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Check } from "lucide-react";
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
import { Card } from "@/components/ui/card";

interface ThemeListProps {
  themes: Array<{
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
    createdBy: { name: string };
  }>;
}

export function ThemeList({ themes }: ThemeListProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const response = await fetch(`/api/themes/${deletingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Theme deleted",
          description: "The theme has been successfully deleted.",
        });
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete theme",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the theme.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (themeId: string) => {
    setSettingDefaultId(themeId);
    try {
      const response = await fetch(`/api/themes/${themeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });

      if (response.ok) {
        toast({
          title: "Default theme updated",
          description: "The default theme has been changed.",
        });
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to set default theme",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while setting the default theme.",
        variant: "destructive",
      });
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleApplyTheme = async (themeId: string) => {
    setApplyingId(themeId);
    try {
      const response = await fetch("/api/themes/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId }),
      });

      if (response.ok) {
        toast({
          title: "Theme applied",
          description: "The theme has been applied to your live site. Please refresh the home page to see changes.",
        });
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to apply theme",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while applying the theme.",
        variant: "destructive",
      });
    } finally {
      setApplyingId(null);
    }
  };

  if (themes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No themes found.</p>
        <Link href="/admin/themes/new">
          <Button>+ Create Your First Theme</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme._id} className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{theme.name}</h3>
                  {theme.isDefault && (
                    <Badge variant="default" className="bg-primary">
                      Default
                    </Badge>
                  )}
                  {!theme.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                {theme.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {theme.description}
                  </p>
                )}
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex gap-2 mb-4">
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: theme.colors.primary }}
                title="Primary Color"
              />
              <div
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: theme.colors.secondary }}
                title="Secondary Color"
              />
            </div>

            <div className="text-xs text-muted-foreground mb-4">
              Slug: <code className="bg-gray-100 px-1 rounded">{theme.slug}</code>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant={theme.isDefault ? "default" : "outline"}
                size="sm"
                onClick={() => handleApplyTheme(theme._id)}
                disabled={applyingId === theme._id || !theme.isActive}
                className="w-full"
              >
                {applyingId === theme._id ? (
                  "Applying..."
                ) : theme.isDefault ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Active Theme
                  </>
                ) : (
                  "Apply Theme"
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Link href={`/admin/themes/${theme._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                {!theme.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(theme._id)}
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
              This action cannot be undone. This will permanently delete your theme
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

