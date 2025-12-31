"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { NavbarPreview } from "./navbar-preview";
import { HeroBlock } from "@/components/blocks/hero-block";
import { TextBlock } from "@/components/blocks/text-block";
import { PuppyCardsBlock } from "@/components/blocks/puppy-cards-block";

const blockComponents: Record<string, any> = {
  hero: HeroBlock,
  "text-content": TextBlock,
  "puppy-cards": PuppyCardsBlock,
};

export function LivePreview({ pageData }: { pageData: any }) {
  const [navbarData, setNavbarData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/navbar")
      .then((res) => res.json())
      .then((data) => setNavbarData(data))
      .catch(() => {
        setNavbarData({
          pages: [],
          settings: { showNavbar: false },
        });
      });
  }, []);

  return (
    <Card className="p-0 h-[calc(100vh-200px)] overflow-y-auto bg-white">
      <div className="mb-4 text-sm text-muted-foreground border-b pb-2 px-6 pt-4">
        Live Preview
      </div>
      <div className="space-y-0">
        {/* Navbar Preview */}
        {navbarData && navbarData.settings.showNavbar && (
          <div className="border-b">
            <NavbarPreview
              pages={navbarData.pages || []}
              settings={navbarData.settings || {}}
              currentSlug={pageData.slug}
            />
          </div>
        )}
        
        {/* Page Content Preview */}
        <div className="px-6 py-4 space-y-6">
          {pageData.blocks && pageData.blocks.length > 0 ? (
            pageData.blocks.map((block: any) => {
              const BlockComponent = blockComponents[block.type];
              const isHero = block.type === "hero";
              
              return BlockComponent ? (
                <div key={block.id} className={isHero ? "" : "container mx-auto"}>
                  <BlockComponent content={block.content} />
                </div>
              ) : (
                <div
                  key={block.id}
                  className="p-4 border border-dashed rounded-lg text-center text-muted-foreground"
                >
                  Block type: {block.type}
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>No blocks yet. Add blocks to see preview.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

