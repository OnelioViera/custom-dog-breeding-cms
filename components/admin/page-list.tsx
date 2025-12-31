"use client";

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
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Page {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  createdBy?: { name: string };
  lastEditedBy?: { name: string };
}

interface PageListProps {
  pages: Page[];
}

export function PageList({ pages }: PageListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Page deleted",
          description: "The page has been deleted successfully.",
        });
        router.refresh();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete page",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the page.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No pages found.</p>
        <Link href="/admin/pages/new">
          <Button>Create Your First Page</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Edited</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page._id}>
              <TableCell className="font-medium">{page.title}</TableCell>
              <TableCell className="text-muted-foreground">
                /{page.slug}
              </TableCell>
              <TableCell>
                <Badge
                  variant={page.status === "published" ? "default" : "secondary"}
                >
                  {page.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(page.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {page.status === "published" && (
                    <Link href={`/${page.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" title="View published page">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/admin/pages/${page._id}`}>
                    <Button variant="ghost" size="sm" title="Edit page">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(page._id)}
                    disabled={deletingId === page._id}
                    title="Delete page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

