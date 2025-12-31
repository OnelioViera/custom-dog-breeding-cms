"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./rich-text-editor";
import { PageLinkSelector } from "./page-link-selector";
import { ButtonPresetSelector } from "./button-preset-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Block {
  id: string;
  type: string;
  order: number;
  content: Record<string, any>;
}

interface SortableBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
}

export function SortableBlock({
  block,
  onChange,
  onDelete,
}: SortableBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const updateContent = (key: string, value: any) => {
    onChange({
      ...block,
      content: {
        ...block.content,
        [key]: value,
      },
    });
  };

  const renderBlockEditor = () => {
    switch (block.type) {
      case "hero":
        return (
          <div className="space-y-3">
            <div>
              <Label>Layout Style</Label>
              <Select
                value={block.content.layout || "centered"}
                onValueChange={(value) => updateContent("layout", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centered">Centered Hero</SelectItem>
                  <SelectItem value="left">Left Aligned Hero</SelectItem>
                  <SelectItem value="pattern">Hero with Pattern</SelectItem>
                  <SelectItem value="minimal">Minimal Hero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={block.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Hero title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <RichTextEditor
                content={block.content.subtitle || ""}
                onChange={(html) => updateContent("subtitle", html)}
                placeholder="Hero subtitle"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`show-cta-${block.id}`}
                checked={block.content.showCTA !== false}
                onChange={(e) => updateContent("showCTA", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`show-cta-${block.id}`} className="cursor-pointer font-medium">
                Show CTA Button
              </Label>
            </div>
            {block.content.showCTA !== false && (
              <>
                <div>
                  <Label>CTA Text</Label>
                  <Input
                    value={block.content.ctaText || ""}
                    onChange={(e) => updateContent("ctaText", e.target.value)}
                    placeholder="Button text"
                  />
                </div>
                <div>
                  <PageLinkSelector
                    value={block.content.ctaLink || ""}
                    onChange={(value) => updateContent("ctaLink", value)}
                    placeholder="/page"
                    label="CTA Link"
                  />
                </div>
                <div>
                  <ButtonPresetSelector
                    value={block.content.buttonPreset || null}
                    onChange={(presetSlug) => updateContent("buttonPreset", presetSlug)}
                    label="Button Style"
                  />
                </div>
              </>
            )}
          </div>
        );
      case "text-content":
        return (
          <div className="space-y-3">
            <div>
              <Label>Heading</Label>
              <Input
                value={block.content.heading || ""}
                onChange={(e) => updateContent("heading", e.target.value)}
                placeholder="Section heading"
              />
            </div>
            <div>
              <Label>Content</Label>
              <RichTextEditor
                content={block.content.text || ""}
                onChange={(html) => updateContent("text", html)}
                placeholder="Enter your content..."
              />
            </div>
          </div>
        );
      case "puppy-cards":
        return (
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              placeholder="Available Puppies"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Puppy cards will be managed separately
            </p>
          </div>
        );
      default:
        return (
          <div>
            <p className="text-sm text-muted-foreground">
              Block type: {block.type}
            </p>
          </div>
        );
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 relative group"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <span className="text-sm font-medium capitalize">
                {block.type.replace("-", " ")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
          {!isCollapsed && renderBlockEditor()}
        </div>
      </div>
    </Card>
  );
}

