"use client";

import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlock } from "./sortable-block";
import { BlockSelector } from "./block-selector";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Block {
  id: string;
  type: string;
  order: number;
  content: Record<string, any>;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: string, defaultContent?: Record<string, any>) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: blocks.length,
      content: defaultContent || getDefaultContent(type),
    };
    onChange([...blocks, newBlock]);
  };

  const getDefaultContent = (type: string): Record<string, any> => {
    switch (type) {
      case "hero":
        return {
          title: "Welcome to Our Kennel",
          subtitle: "<p>Quality Breeding Since 1990</p>",
          image: "",
          ctaText: "Learn More",
          ctaLink: "#",
          showCTA: true,
          layout: "centered",
        };
      case "text-content":
        return {
          heading: "About Us",
          text: "<p>Enter your content here...</p>",
        };
      case "puppy-cards":
        return {
          title: "Available Puppies",
          puppies: [],
        };
      case "image-gallery":
        return {
          title: "Gallery",
          images: [],
        };
      case "contact-form":
        return {
          title: "Contact Us",
          email: "",
        };
      default:
        return {};
    }
  };

  const updateBlock = (blockId: string, updatedBlock: Block) => {
    onChange(
      blocks.map((b) => (b.id === blockId ? updatedBlock : b))
    );
  };

  const deleteBlock = (blockId: string) => {
    onChange(blocks.filter((b) => b.id !== blockId));
  };

  return (
    <div className="space-y-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onChange={(updatedBlock) => updateBlock(block.id, updatedBlock)}
              onDelete={() => deleteBlock(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsSelectorOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Block
      </Button>

      <BlockSelector
        open={isSelectorOpen}
        onOpenChange={setIsSelectorOpen}
        onSelect={(type, defaultContent) => addBlock(type, defaultContent)}
      />
    </div>
  );
}

