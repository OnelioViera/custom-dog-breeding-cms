"use client";

import { Card } from "@/components/ui/card";

interface PuppyCardsBlockProps {
  content: {
    title?: string;
    puppies?: Array<{
      name: string;
      breed: string;
      age: string;
      image?: string;
    }>;
  };
}

export function PuppyCardsBlock({ content }: PuppyCardsBlockProps) {
  return (
    <div>
      {content.title && (
        <h2 className="text-3xl font-bold mb-6 text-center">
          {content.title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.puppies && content.puppies.length > 0 ? (
          content.puppies.map((puppy, index) => (
            <Card key={index} className="overflow-hidden">
              {puppy.image ? (
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${puppy.image})` }}
                />
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{puppy.name}</h3>
                <p className="text-sm text-muted-foreground">{puppy.breed}</p>
                <p className="text-sm text-muted-foreground">{puppy.age}</p>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No puppies available yet
          </div>
        )}
      </div>
    </div>
  );
}

