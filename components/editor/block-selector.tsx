"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface BlockTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  preview: React.ReactNode;
  defaultContent: Record<string, any>;
}

interface BlockSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: string, defaultContent: Record<string, any>) => void;
}

// Hero Block Preview Components
const HeroPreview1 = () => (
  <div className="w-full h-32 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-black/20" />
    <div className="relative z-10 text-center px-4">
      <div className="h-4 bg-white/30 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-white/20 rounded w-1/2 mx-auto mb-3" />
      <div className="h-6 bg-white/40 rounded w-24 mx-auto" />
    </div>
  </div>
);

const HeroPreview2 = () => (
  <div className="w-full h-32 bg-gradient-to-r from-primary via-secondary to-primary rounded-lg flex items-center text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-black/20" />
    <div className="relative z-10 px-6 w-full">
      <div className="h-4 bg-white/30 rounded w-2/3 mb-2" />
      <div className="h-3 bg-white/20 rounded w-1/2 mb-3" />
      <div className="h-6 bg-white/40 rounded w-20" />
    </div>
  </div>
);

const HeroPreview3 = () => {
  const patternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  
  return (
    <div className="w-full h-32 bg-gradient-to-b from-primary/80 to-secondary/80 rounded-lg flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/30" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url("${patternUrl}")` }}
      />
      <div className="relative z-10 text-center px-4">
        <div className="h-5 bg-white/30 rounded w-4/5 mx-auto mb-2" />
        <div className="h-3 bg-white/20 rounded w-3/5 mx-auto mb-3" />
        <div className="h-6 bg-white/40 rounded w-28 mx-auto" />
      </div>
    </div>
  );
};

const HeroPreview4 = () => (
  <div className="w-full h-32 bg-white border-2 border-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
    <div className="relative z-10 text-center px-4 w-full">
      <div className="h-4 bg-primary/30 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-primary/20 rounded w-1/2 mx-auto mb-3" />
      <div className="h-6 bg-primary rounded w-24 mx-auto" />
    </div>
  </div>
);

// Text Content Preview
const TextContentPreview = () => (
  <div className="w-full h-32 bg-white border rounded-lg p-4">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-3" />
    <div className="space-y-2">
      <div className="h-2 bg-gray-200 rounded w-full" />
      <div className="h-2 bg-gray-200 rounded w-5/6" />
      <div className="h-2 bg-gray-200 rounded w-4/6" />
    </div>
  </div>
);

// Puppy Cards Preview
const PuppyCardsPreview = () => (
  <div className="w-full h-32 bg-white border rounded-lg p-4">
    <div className="h-3 bg-gray-300 rounded w-1/2 mb-3" />
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 rounded aspect-square" />
      ))}
    </div>
  </div>
);

// Image Gallery Preview
const ImageGalleryPreview = () => (
  <div className="w-full h-32 bg-white border rounded-lg p-4">
    <div className="h-3 bg-gray-300 rounded w-1/3 mb-3" />
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-gray-200 rounded aspect-square" />
      ))}
    </div>
  </div>
);

// Contact Form Preview
const ContactFormPreview = () => (
  <div className="w-full h-32 bg-white border rounded-lg p-4">
    <div className="h-3 bg-gray-300 rounded w-1/2 mb-3" />
    <div className="space-y-2">
      <div className="h-6 bg-gray-100 rounded" />
      <div className="h-6 bg-gray-100 rounded" />
      <div className="h-12 bg-gray-100 rounded" />
      <div className="h-6 bg-primary rounded w-20" />
    </div>
  </div>
);

const heroTemplates: BlockTemplate[] = [
  {
    id: "hero-1",
    name: "Centered Hero",
    type: "hero",
    category: "hero",
    preview: <HeroPreview1 />,
    defaultContent: {
      title: "Welcome to Our Kennel",
      subtitle: "<p>Quality Breeding Since 1990</p>",
      image: "",
      ctaText: "Learn More",
      ctaLink: "#",
      showCTA: true,
      layout: "centered",
    },
  },
  {
    id: "hero-2",
    name: "Left Aligned Hero",
    type: "hero",
    category: "hero",
    preview: <HeroPreview2 />,
    defaultContent: {
      title: "Premium Dog Breeding",
      subtitle: "<p>Discover our exceptional breeding program</p>",
      image: "",
      ctaText: "Get Started",
      ctaLink: "#",
      showCTA: true,
      layout: "left",
    },
  },
  {
    id: "hero-3",
    name: "Hero with Pattern",
    type: "hero",
    category: "hero",
    preview: <HeroPreview3 />,
    defaultContent: {
      title: "Excellence in Every Generation",
      subtitle: "<p>Trusted by families worldwide</p>",
      image: "",
      ctaText: "View Our Dogs",
      ctaLink: "#",
      showCTA: true,
      layout: "pattern",
    },
  },
  {
    id: "hero-4",
    name: "Minimal Hero",
    type: "hero",
    category: "hero",
    preview: <HeroPreview4 />,
    defaultContent: {
      title: "Simple & Elegant",
      subtitle: "<p>Clean design for modern websites</p>",
      image: "",
      ctaText: "Explore",
      ctaLink: "#",
      showCTA: true,
      layout: "minimal",
    },
  },
];

const otherBlockTemplates: BlockTemplate[] = [
  {
    id: "text-content",
    name: "Text Content",
    type: "text-content",
    category: "content",
    preview: <TextContentPreview />,
    defaultContent: {
      heading: "About Us",
      text: "<p>Enter your content here...</p>",
    },
  },
  {
    id: "puppy-cards",
    name: "Puppy Cards",
    type: "puppy-cards",
    category: "custom",
    preview: <PuppyCardsPreview />,
    defaultContent: {
      title: "Available Puppies",
      puppies: [],
    },
  },
  {
    id: "image-gallery",
    name: "Image Gallery",
    type: "image-gallery",
    category: "gallery",
    preview: <ImageGalleryPreview />,
    defaultContent: {
      title: "Gallery",
      images: [],
    },
  },
  {
    id: "contact-form",
    name: "Contact Form",
    type: "contact-form",
    category: "form",
    preview: <ContactFormPreview />,
    defaultContent: {
      title: "Contact Us",
      email: "",
    },
  },
];

export function BlockSelector({ open, onOpenChange, onSelect }: BlockSelectorProps) {
  const handleSelect = (template: BlockTemplate) => {
    onSelect(template.type, template.defaultContent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Block</DialogTitle>
          <DialogDescription>
            Choose a block template to add to your page
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="form">Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {heroTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelect(template)}
                >
                  <div className="mb-3">{template.preview}</div>
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {otherBlockTemplates
                .filter((t) => t.category === "content" || t.category === "custom")
                .map((template) => (
                  <Card
                    key={template.id}
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelect(template)}
                  >
                    <div className="mb-3">{template.preview}</div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {otherBlockTemplates
                .filter((t) => t.category === "gallery")
                .map((template) => (
                  <Card
                    key={template.id}
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelect(template)}
                  >
                    <div className="mb-3">{template.preview}</div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="form" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {otherBlockTemplates
                .filter((t) => t.category === "form")
                .map((template) => (
                  <Card
                    key={template.id}
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelect(template)}
                  >
                    <div className="mb-3">{template.preview}</div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

