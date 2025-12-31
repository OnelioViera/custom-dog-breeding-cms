"use client";

import { HeroBlock } from "@/components/blocks/hero-block";
import { TextBlock } from "@/components/blocks/text-block";
import { PuppyCardsBlock } from "@/components/blocks/puppy-cards-block";

const blockComponents: Record<string, any> = {
  hero: HeroBlock,
  "text-content": TextBlock,
  "puppy-cards": PuppyCardsBlock,
};

interface PageRendererProps {
  page: {
    title?: string;
    blocks?: Array<{
      id: string;
      type: string;
      content: Record<string, any>;
    }>;
  };
}

export function PageRenderer({ page }: PageRendererProps) {
  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen">
        {page.blocks && Array.isArray(page.blocks) && page.blocks.length > 0 ? (
          page.blocks.map((block) => {
            if (!block || !block.type) {
              return null;
            }

            const BlockComponent = blockComponents[block.type];
            
            // Hero blocks should be full width, others should have container
            const isHero = block.type === "hero";
            
            return BlockComponent ? (
              <div key={block.id || Math.random()} className={isHero ? "" : "container mx-auto px-4 py-8"}>
                <BlockComponent content={block.content || {}} />
              </div>
            ) : (
              <div
                key={block.id || Math.random()}
                className="container mx-auto px-4 py-8 text-center text-muted-foreground"
              >
                Unknown block type: {block.type}
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{page.title || "Untitled Page"}</h1>
              <p className="text-muted-foreground">
                This page has no content yet.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error: any) {
    console.error("Error rendering page:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error Loading Page</h1>
          <p className="text-muted-foreground">
            {error?.message || "An error occurred while loading this page."}
          </p>
        </div>
      </div>
    );
  }
}

